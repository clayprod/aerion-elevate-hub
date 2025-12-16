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
 * Componente que gerencia o roteamento de páginas de soluções.
 * Páginas hardcoded (construcao, industrial, seguranca, resgate) sempre usam os componentes hardcoded.
 * Outras soluções verificam o banco de dados e usam SolutionPage se existirem.
 */
const SolutionRouteHandler = () => {
  const { slug } = useParams<{ slug: string }>();

  if (!slug) {
    return <NotFound />;
  }

  // Verificar primeiro se é uma página hardcoded - essas sempre usam os componentes originais
  const HardcodedComponent = HARDCODED_SOLUTIONS[slug];
  if (HardcodedComponent) {
    return <HardcodedComponent />;
  }

  // Se não for hardcoded, verificar se existe solução no banco de dados
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

  // Se existe solução no banco, usar página dinâmica (com layout rico)
  if (solution) {
    return <SolutionPage />;
  }

  // Caso contrário, não encontrado
  return <NotFound />;
};

export default SolutionRouteHandler;

