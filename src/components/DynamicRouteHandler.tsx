import { useLocation } from "react-router-dom";
import { useDynamicRoutes } from "@/hooks/useDynamicRoutes";
import DynamicPage from "@/pages/DynamicPage";
import NotFound from "@/pages/NotFound";

/**
 * Componente que verifica se uma rota é dinâmica antes de renderizar
 * Deve ser usado como catch-all route para páginas dinâmicas
 */
const DynamicRouteHandler = () => {
  const location = useLocation();
  const { isDynamicRoute, isLoading } = useDynamicRoutes();

  // Se ainda está carregando, mostrar loading
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-medium border-r-transparent"></div>
          <p className="mt-4 text-gray-dark">Carregando...</p>
        </div>
      </div>
    );
  }

  // Verificar se é uma rota dinâmica
  if (isDynamicRoute(location.pathname)) {
    return <DynamicPage />;
  }

  // Se não for rota dinâmica, mostrar NotFound
  return <NotFound />;
};

export default DynamicRouteHandler;

