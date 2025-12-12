import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PROTECTED_ROUTES } from "@/lib/pageUtils";

/**
 * Hook para gerenciar rotas dinâmicas
 * Carrega lista de paths publicados e verifica se um path é dinâmico
 * Agora também inclui páginas que sobrescrevem rotas estáticas
 */
export function useDynamicRoutes() {
  // Cache de paths publicados (atualiza a cada 10 minutos)
  const { data: publishedPaths, isLoading } = useQuery({
    queryKey: ["dynamic-pages-paths"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("custom_pages")
        .select("path")
        .eq("published", true);

      if (error) {
        console.error("Error fetching dynamic pages paths:", error);
        return [];
      }

      return (data || []).map((page) => page.path);
    },
    staleTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: false,
    retry: 3,
  });

  /**
   * Verifica se um path é uma rota dinâmica válida
   * Agora permite paths que sobrescrevem rotas estáticas (exceto protegidas)
   */
  const isDynamicRoute = (path: string): boolean => {
    if (!path || !publishedPaths) return false;
    
    // Não pode ser rota protegida
    if (PROTECTED_ROUTES.includes(path) || PROTECTED_ROUTES.some(route => path.startsWith(route + '/'))) {
      return false;
    }
    
    // Não pode ser rota de blog individual (tem sistema próprio)
    if (path.startsWith('/blog/')) {
      return false;
    }
    
    // Deve estar na lista de paths publicados
    return publishedPaths.includes(path);
  };

  return {
    publishedPaths: publishedPaths || [],
    isLoading,
    isDynamicRoute,
  };
}

