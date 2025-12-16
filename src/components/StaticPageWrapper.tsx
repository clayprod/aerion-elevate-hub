import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLocation } from "react-router-dom";
import DynamicPage from "@/pages/DynamicPage";
import { ReactNode } from "react";

interface StaticPageWrapperProps {
  children: ReactNode;
  fallbackPath?: string; // Path alternativo para buscar página customizada
}

/**
 * Componente wrapper que verifica se existe uma página customizada
 * para a rota atual antes de renderizar o componente estático.
 * Se existir página customizada publicada, renderiza ela.
 * Caso contrário, renderiza o componente estático original.
 */
const StaticPageWrapper: React.FC<StaticPageWrapperProps> = ({ 
  children, 
  fallbackPath 
}) => {
  const location = useLocation();
  const pathToCheck = fallbackPath || location.pathname;

  const { data: customPage, isLoading } = useQuery({
    queryKey: ["static-page-override", pathToCheck],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("custom_pages")
          .select("*")
          .eq("path", pathToCheck)
          .eq("published", true)
          .single();

        if (error) {
          // Se não encontrado, não é erro - apenas não há override
          if (error.code === "PGRST116") {
            return null;
          }
          // Erro 406 (Not Acceptable) - geralmente indica problema com formato de dados
          // Não tentar renderizar página customizada, usar página estática
          if (error.code === "406" || error.code === "PGRST301") {
            console.warn(`Custom page for ${pathToCheck} has data format issues (406). Using static page instead.`);
            return null;
          }
          // Log outros erros mas não quebrar a página estática
          console.warn("Error fetching custom page override:", error);
          return null;
        }

        // Validar se os dados retornados são válidos
        if (!data || !data.title || !data.content) {
          console.warn(`Custom page for ${pathToCheck} has invalid data. Using static page instead.`);
          return null;
        }

        return data;
      } catch (err) {
        // Em caso de erro inesperado, não quebrar a página estática
        console.warn("Unexpected error fetching custom page:", err);
        return null;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: false, // Não retry para não atrasar renderização de páginas estáticas
  });

  // Se ainda está carregando, mostrar página estática (evita flash)
  if (isLoading) {
    return <>{children}</>;
  }

  // Se existe página customizada publicada E os dados são válidos, renderizar ela
  if (customPage && customPage.title && customPage.content) {
    return <DynamicPage />;
  }

  // Caso contrário, renderizar componente estático original
  return <>{children}</>;
};

export default StaticPageWrapper;

