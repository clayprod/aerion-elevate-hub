import { ReactNode, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  // #region agent log
  const logData1 = {location:'ProtectedRoute.tsx:11',message:'ProtectedRoute render',data:{requireAdmin,hasUser:!!user,isAdmin,loading},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,B,C'};
  console.log('🔍 [DEBUG]', JSON.stringify(logData1));
  fetch('http://127.0.0.1:7242/ingest/533de3d1-c5fa-427f-88e4-6ca8b9bbc865',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(logData1)}).catch(()=>{});
  // #endregion

  useEffect(() => {
    // #region agent log
    const logData2 = {location:'ProtectedRoute.tsx:16',message:'ProtectedRoute useEffect',data:{loading,hasUser:!!user,isAdmin,requireAdmin},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,B,C'};
    console.log('🔍 [DEBUG]', JSON.stringify(logData2));
    fetch('http://127.0.0.1:7242/ingest/533de3d1-c5fa-427f-88e4-6ca8b9bbc865',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(logData2)}).catch(()=>{});
    // #endregion
    if (!loading) {
      if (!user) {
        // #region agent log
        const logData3 = {location:'ProtectedRoute.tsx:20',message:'redirecting to /auth (no user)',data:{requireAdmin},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'};
        console.log('🔄 [DEBUG]', JSON.stringify(logData3));
        fetch('http://127.0.0.1:7242/ingest/533de3d1-c5fa-427f-88e4-6ca8b9bbc865',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(logData3)}).catch(()=>{});
        // #endregion
        navigate("/auth", { replace: true });
      } else if (requireAdmin && !isAdmin) {
        // #region agent log
        const logData4 = {location:'ProtectedRoute.tsx:23',message:'redirecting to / (not admin)',data:{userId:user?.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'};
        console.log('🔄 [DEBUG]', JSON.stringify(logData4));
        fetch('http://127.0.0.1:7242/ingest/533de3d1-c5fa-427f-88e4-6ca8b9bbc865',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(logData4)}).catch(()=>{});
        // #endregion
        navigate("/", { replace: true });
      } else {
        // #region agent log
        const logData5 = {location:'ProtectedRoute.tsx:26',message:'access granted',data:{requireAdmin,hasUser:!!user,isAdmin},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,B,C'};
        console.log('✅ [DEBUG]', JSON.stringify(logData5));
        fetch('http://127.0.0.1:7242/ingest/533de3d1-c5fa-427f-88e4-6ca8b9bbc865',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(logData5)}).catch(()=>{});
        // #endregion
      }
    }
  }, [user, isAdmin, loading, navigate, requireAdmin]);

  if (loading) {
    // #region agent log
    const logData1 = {location:'ProtectedRoute.tsx:30',message:'showing loading state',data:{requireAdmin},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'};
    console.log('⏳ [DEBUG]', JSON.stringify(logData1));
    fetch('http://127.0.0.1:7242/ingest/533de3d1-c5fa-427f-88e4-6ca8b9bbc865',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(logData1)}).catch(()=>{});
    // #endregion
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-action mx-auto mb-4"></div>
          <p className="text-gray-dark">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user || (requireAdmin && !isAdmin)) {
    // #region agent log
    const logData2 = {location:'ProtectedRoute.tsx:42',message:'returning null (blocked)',data:{hasUser:!!user,requireAdmin,isAdmin},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,C'};
    console.log('🚫 [DEBUG]', JSON.stringify(logData2));
    fetch('http://127.0.0.1:7242/ingest/533de3d1-c5fa-427f-88e4-6ca8b9bbc865',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(logData2)}).catch(()=>{});
    // #endregion
    return null;
  }

  // #region agent log
  const logData3 = {location:'ProtectedRoute.tsx:47',message:'rendering children',data:{requireAdmin,hasUser:!!user,isAdmin},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,B,C'};
  console.log('✅ [DEBUG]', JSON.stringify(logData3));
  fetch('http://127.0.0.1:7242/ingest/533de3d1-c5fa-427f-88e4-6ca8b9bbc865',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(logData3)}).catch(()=>{});
  // #endregion
  return <>{children}</>;
};

export default ProtectedRoute;

