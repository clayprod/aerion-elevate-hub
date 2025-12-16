-- Create backups table to store backup metadata and data
CREATE TABLE public.backups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  backup_data JSONB NOT NULL,
  size_bytes BIGINT,
  tables_backed_up TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  restored_at TIMESTAMP WITH TIME ZONE,
  restored_by UUID REFERENCES auth.users(id)
);

-- Create index for faster queries
CREATE INDEX idx_backups_created_at ON public.backups(created_at DESC);
CREATE INDEX idx_backups_restored_at ON public.backups(restored_at DESC);

-- Enable RLS
ALTER TABLE public.backups ENABLE ROW LEVEL SECURITY;

-- Only admins can view backups
CREATE POLICY "Admins can view backups"
ON public.backups
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can create backups
CREATE POLICY "Admins can create backups"
ON public.backups
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only admins can update backups (for restore tracking)
CREATE POLICY "Admins can update backups"
ON public.backups
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete backups
CREATE POLICY "Admins can delete backups"
ON public.backups
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Function to create a backup of all CMS tables
CREATE OR REPLACE FUNCTION public.create_site_backup(
  backup_name TEXT DEFAULT NULL,
  backup_description TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  backup_id UUID;
  backup_data JSONB := '{}'::JSONB;
  table_name TEXT;
  table_data JSONB;
  tables_to_backup TEXT[] := ARRAY[
    'blog_posts',
    'products',
    'solutions',
    'hero_media',
    'site_content',
    'site_settings',
    'custom_pages',
    'page_blocks',
    'brands',
    'product_families',
    'product_variants'
  ];
  backup_size BIGINT;
BEGIN
  -- Generate backup name if not provided
  IF backup_name IS NULL OR backup_name = '' THEN
    backup_name := 'Backup ' || to_char(now(), 'YYYY-MM-DD HH24:MI:SS');
  END IF;

  -- Backup each table
  FOREACH table_name IN ARRAY tables_to_backup
  LOOP
    -- Check if table exists
    IF EXISTS (
      SELECT 1 FROM information_schema.tables t
      WHERE t.table_schema = 'public' 
      AND t.table_name = table_name
    ) THEN
      -- Get all data from table
      EXECUTE format('SELECT json_agg(row_to_json(t)) FROM (SELECT * FROM public.%I) t', table_name)
      INTO table_data;
      
      -- Store in backup_data
      backup_data := jsonb_set(
        backup_data,
        ARRAY[table_name],
        COALESCE(table_data, '[]'::jsonb)
      );
    END IF;
  END LOOP;

  -- Calculate backup size (approximate)
  backup_size := pg_column_size(backup_data);

  -- Insert backup record
  INSERT INTO public.backups (
    name,
    description,
    backup_data,
    size_bytes,
    tables_backed_up,
    created_by
  ) VALUES (
    backup_name,
    backup_description,
    backup_data,
    backup_size,
    tables_to_backup,
    auth.uid()
  )
  RETURNING id INTO backup_id;

  RETURN backup_id;
END;
$$;

-- Function to restore a backup
CREATE OR REPLACE FUNCTION public.restore_site_backup(
  backup_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  backup_record RECORD;
  table_name TEXT;
  table_data JSONB;
  row_data JSONB;
  column_names TEXT;
  column_values TEXT;
  insert_sql TEXT;
  json_record JSONB;
BEGIN
  -- Get backup record
  SELECT * INTO backup_record
  FROM public.backups
  WHERE id = backup_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Backup not found';
  END IF;

  -- Restore each table
  FOREACH table_name IN ARRAY backup_record.tables_backed_up
  LOOP
    -- Check if table exists
    IF EXISTS (
      SELECT 1 FROM information_schema.tables t
      WHERE t.table_schema = 'public' 
      AND t.table_name = table_name
    ) THEN
      -- Get table data from backup
      table_data := backup_record.backup_data->table_name;
      
      IF table_data IS NOT NULL AND jsonb_array_length(table_data) > 0 THEN
        -- Clear existing data (truncate)
        EXECUTE format('TRUNCATE TABLE public.%I CASCADE', table_name);
        
        -- Restore data using json_populate_recordset for better compatibility
        -- This approach handles all column types including arrays and JSONB
        insert_sql := format(
          'INSERT INTO public.%I SELECT * FROM json_populate_recordset(null::public.%I, %L)',
          table_name,
          table_name,
          table_data::text
        );
        
        BEGIN
          EXECUTE insert_sql;
        EXCEPTION WHEN OTHERS THEN
          -- If json_populate_recordset fails, try row-by-row insertion
          FOR json_record IN SELECT * FROM jsonb_array_elements(table_data)
          LOOP
            -- Get column names from the JSON object
            SELECT string_agg(key, ', '), string_agg(format('%L', value), ', ')
            INTO column_names, column_values
            FROM jsonb_each(json_record);
            
            -- Build and execute INSERT statement
            insert_sql := format(
              'INSERT INTO public.%I (%s) VALUES (%s)',
              table_name,
              column_names,
              (SELECT string_agg(format('%L', value::text), ', ') FROM jsonb_each_text(json_record))
            );
            
            EXECUTE insert_sql;
          END LOOP;
        END;
      END IF;
    END IF;
  END LOOP;

  -- Update backup record with restore info
  UPDATE public.backups
  SET 
    restored_at = now(),
    restored_by = auth.uid()
  WHERE id = backup_id;

  RETURN TRUE;
END;
$$;

-- Function to get backup statistics
CREATE OR REPLACE FUNCTION public.get_backup_stats()
RETURNS TABLE (
  total_backups BIGINT,
  total_size_bytes BIGINT,
  oldest_backup TIMESTAMP WITH TIME ZONE,
  newest_backup TIMESTAMP WITH TIME ZONE,
  last_restore TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT as total_backups,
    COALESCE(SUM(size_bytes), 0)::BIGINT as total_size_bytes,
    MIN(created_at) as oldest_backup,
    MAX(created_at) as newest_backup,
    MAX(restored_at) as last_restore
  FROM public.backups;
END;
$$;

-- Create a function to automatically create weekly backups
-- This will be called by pg_cron or a scheduled task
CREATE OR REPLACE FUNCTION public.create_weekly_backup()
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  backup_id UUID;
  backup_name TEXT;
BEGIN
  -- Generate weekly backup name
  backup_name := 'Backup Semanal ' || to_char(now(), 'YYYY-MM-DD');
  
  -- Create backup
  SELECT public.create_site_backup(
    backup_name,
    'Backup automático semanal criado em ' || to_char(now(), 'YYYY-MM-DD HH24:MI:SS')
  ) INTO backup_id;
  
  -- Clean up old backups (keep last 12 weeks = 3 months)
  DELETE FROM public.backups
  WHERE created_at < now() - INTERVAL '12 weeks'
  AND restored_at IS NULL;
  
  RETURN backup_id;
END;
$$;

-- Grant execute permissions to authenticated users (but RLS will restrict to admins)
GRANT EXECUTE ON FUNCTION public.create_site_backup TO authenticated;
GRANT EXECUTE ON FUNCTION public.restore_site_backup TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_backup_stats TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_weekly_backup TO authenticated;

