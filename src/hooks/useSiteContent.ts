import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface SiteContent {
  id: string;
  section: string;
  content: any;
  created_at: string;
  updated_at: string;
}

/**
 * Hook para buscar conteúdo dinâmico do site da tabela site_content
 * @param section - Nome da seção (ex: 'hero', 'about', 'contact')
 * @param fallback - Conteúdo fallback caso não encontre no banco
 */
export const useSiteContent = (section: string, fallback?: any) => {
  return useQuery({
    queryKey: ['site-content', section],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .eq('section', section)
        .single();

      if (error) {
        // Se não encontrado, não é erro crítico - retorna null para usar fallback
        if (error.code === 'PGRST116') {
          return null;
        }
        console.warn(`Erro ao buscar conteúdo da seção '${section}':`, error);
        return null;
      }

      return data as SiteContent | null;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 1,
  });
};

/**
 * Hook para buscar múltiplas seções de conteúdo de uma vez
 */
export const useMultipleSiteContent = (sections: string[]) => {
  return useQuery({
    queryKey: ['site-content', 'multiple', sections.join(',')],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .in('section', sections);

      if (error) {
        console.warn('Erro ao buscar múltiplas seções:', error);
        return [];
      }

      return (data || []) as SiteContent[];
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};






