import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import SolutionPage from "@/pages/SolutionPage";
import ConstrucaoTopografia from "@/pages/solucoes/ConstrucaoTopografia";
import InspecaoIndustrial from "@/pages/solucoes/InspecaoIndustrial";
import SegurancaPublica from "@/pages/solucoes/SegurancaPublica";
import ResgateEmergencias from "@/pages/solucoes/ResgateEmergencias";
import NotFound from "@/pages/NotFound";

// Mapeamento de slugs hardcoded para componentes
const HARDCODED_SOLUTIONS: Record<string, React.ComponentType> = {
  construcao: ConstrucaoTopografia,
  industrial: InspecaoIndustrial,
  seguranca: SegurancaPublica,
  resgate: ResgateEmergencias,
};

/**
 * Componente que verifica se existe uma solução no banco de dados.
 * Se existir, renderiza SolutionPage (dinâmica).
 * Se não existir mas for uma página hardcoded, renderiza a página hardcoded.
 * Caso contrário, mostra NotFound.
 */
const SolutionRouteHandler = () => {
  const { slug } = useParams<{ slug: string }>();

  if (!slug) {
    return <NotFound />;
  }

  // Verificar se existe solução no banco de dados
  const { data: solution, isLoading } = useQuery({
    queryKey: ["solution-check", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("solutions")
        .select("id, slug, active")
        .eq("slug", slug)
        .eq("active", true)
        .maybeSingle();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      return data;
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  // Enquanto carrega, mostrar loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-medium border-r-transparent"></div>
          <p className="mt-4 text-gray-dark">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se existe solução no banco, usar página dinâmica
  if (solution) {
    return <SolutionPage />;
  }

  // Se não existe no banco mas é uma página hardcoded, usar componente hardcoded
  const HardcodedComponent = HARDCODED_SOLUTIONS[slug];
  if (HardcodedComponent) {
    return <HardcodedComponent />;
  }

  // Caso contrário, não encontrado
  return <NotFound />;
};

export default SolutionRouteHandler;

