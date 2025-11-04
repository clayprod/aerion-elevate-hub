import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  Vertical, 
  CreateVerticalData,
  UpdateVerticalData,
  VerticalFilters,
  VerticalStats
} from '@/types/products';
import { useToast } from '@/hooks/use-toast';

export const useVerticals = (filters?: VerticalFilters) => {
  const [verticals, setVerticals] = useState<Vertical[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchVerticals = async () => {
    try {
      setIsLoading(true);
      setError(null);

      let query = supabase
        .from('verticals')
        .select('*')
        .order('order_index', { ascending: true });

      // Aplicar filtros
      if (filters?.active !== undefined) {
        query = query.eq('active', filters.active);
      }
      if (filters?.featured !== undefined) {
        query = query.eq('featured', filters.featured);
      }
      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setVerticals(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar verticais';
      setError(errorMessage);
      console.error('Erro ao buscar verticais:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createVertical = async (verticalData: CreateVerticalData) => {
    try {
      const { data, error } = await supabase
        .from('verticals')
        .insert(verticalData)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setVerticals(prev => [...prev, data]);
      toast({
        title: 'Sucesso!',
        description: 'Vertical criada com sucesso.',
      });

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar vertical';
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  };

  const updateVertical = async (verticalData: UpdateVerticalData) => {
    try {
      const { data, error } = await supabase
        .from('verticals')
        .update({
          ...verticalData,
          updated_at: new Date().toISOString()
        })
        .eq('id', verticalData.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setVerticals(prev => prev.map(vertical => 
        vertical.id === verticalData.id ? data : vertical
      ));

      toast({
        title: 'Sucesso!',
        description: 'Vertical atualizada com sucesso.',
      });

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar vertical';
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  };

  const deleteVertical = async (verticalId: string) => {
    try {
      const { error } = await supabase
        .from('verticals')
        .delete()
        .eq('id', verticalId);

      if (error) {
        throw error;
      }

      setVerticals(prev => prev.filter(vertical => vertical.id !== verticalId));
      toast({
        title: 'Sucesso!',
        description: 'Vertical removida com sucesso.',
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao remover vertical';
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  };

  // Estatísticas das verticais
  const getVerticalStats = (): VerticalStats => {
    return {
      total_verticals: verticals.length,
      active_verticals: verticals.filter(v => v.active).length,
      featured_verticals: verticals.filter(v => v.featured).length
    };
  };

  useEffect(() => {
    fetchVerticals();
  }, [filters]);

  return {
    verticals,
    isLoading,
    error,
    createVertical,
    updateVertical,
    deleteVertical,
    verticalStats: getVerticalStats(),
    refetch: fetchVerticals
  };
};

