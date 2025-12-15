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

  // #region agent log
  const logData1 = {location:'DynamicRouteHandler.tsx:11',message:'DynamicRouteHandler called',data:{pathname:location.pathname,isLoading},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'};
  console.log('🔄 [DEBUG]', JSON.stringify(logData1));
  fetch('http://127.0.0.1:7242/ingest/533de3d1-c5fa-427f-88e4-6ca8b9bbc865',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(logData1)}).catch(()=>{});
  // #endregion

  // Se ainda está carregando, mostrar loading
  if (isLoading) {
    // #region agent log
    const logData2 = {location:'DynamicRouteHandler.tsx:18',message:'DynamicRouteHandler loading',data:{pathname:location.pathname},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'};
    console.log('⏳ [DEBUG]', JSON.stringify(logData2));
    fetch('http://127.0.0.1:7242/ingest/533de3d1-c5fa-427f-88e4-6ca8b9bbc865',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(logData2)}).catch(()=>{});
    // #endregion
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
  const isDynamic = isDynamicRoute(location.pathname);
  // #region agent log
  const logData3 = {location:'DynamicRouteHandler.tsx:32',message:'DynamicRouteHandler check result',data:{pathname:location.pathname,isDynamic},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'};
  console.log('🔍 [DEBUG]', JSON.stringify(logData3));
  fetch('http://127.0.0.1:7242/ingest/533de3d1-c5fa-427f-88e4-6ca8b9bbc865',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(logData3)}).catch(()=>{});
  // #endregion

  if (isDynamic) {
    return <DynamicPage />;
  }

  // Se não for rota dinâmica, mostrar NotFound
  return <NotFound />;
};

export default DynamicRouteHandler;


