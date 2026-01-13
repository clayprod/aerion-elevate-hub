-- Fix ambiguous column reference in backup functions
-- This migration fixes the "column reference table_name is ambiguous" error

-- Fix create_site_backup function
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
    -- Check if table exists (FIXED: use alias 't' to avoid ambiguity)
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

-- Fix restore_site_backup function
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
    -- Check if table exists (FIXED: use alias 't' to avoid ambiguity)
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






