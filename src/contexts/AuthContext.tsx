import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isAdmin: false,
  loading: true,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // #region agent log
  const logDataInit = {location:'AuthContext.tsx:27',message:'AuthProvider initialized',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,B,C'};
  console.log('🚀 [DEBUG]', JSON.stringify(logDataInit));
  fetch('http://127.0.0.1:7242/ingest/533de3d1-c5fa-427f-88e4-6ca8b9bbc865',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(logDataInit)}).catch(()=>{});
  // #endregion
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // #region agent log
    const logDataEffect = {location:'AuthContext.tsx:35',message:'AuthProvider useEffect started',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,B,C'};
    console.log('🚀 [DEBUG]', JSON.stringify(logDataEffect));
    fetch('http://127.0.0.1:7242/ingest/533de3d1-c5fa-427f-88e4-6ca8b9bbc865',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(logDataEffect)}).catch(()=>{});
    // #endregion
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Check admin role when user changes
        if (session?.user) {
          setTimeout(() => {
            checkAdminRole(session.user.id);
          }, 0);
        } else {
          setIsAdmin(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      // #region agent log
      const logData1 = {location:'AuthContext.tsx:52',message:'getSession result',data:{hasSession:!!session,userId:session?.user?.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'};
      console.log('🔍 [DEBUG]', JSON.stringify(logData1));
      fetch('http://127.0.0.1:7242/ingest/533de3d1-c5fa-427f-88e4-6ca8b9bbc865',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(logData1)}).catch(()=>{});
      // #endregion
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setTimeout(() => {
          checkAdminRole(session.user.id);
        }, 0);
      }
      setLoading(false);
      // #region agent log
      const logData2 = {location:'AuthContext.tsx:66',message:'initial loading set to false',data:{hasUser:!!session?.user},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'};
      console.log('🔍 [DEBUG]', JSON.stringify(logData2));
      fetch('http://127.0.0.1:7242/ingest/533de3d1-c5fa-427f-88e4-6ca8b9bbc865',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(logData2)}).catch(()=>{});
      // #endregion
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminRole = async (userId: string) => {
    // #region agent log
    const logData1 = {location:'AuthContext.tsx:73',message:'checkAdminRole called',data:{userId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'};
    console.log('🔍 [DEBUG]', JSON.stringify(logData1));
    fetch('http://127.0.0.1:7242/ingest/533de3d1-c5fa-427f-88e4-6ca8b9bbc865',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(logData1)}).catch(()=>{});
    // #endregion
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();

      // #region agent log
      const logData2 = {location:'AuthContext.tsx:85',message:'checkAdminRole query result',data:{hasData:!!data,hasError:!!error,error:error?.message,role:data?.role},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'};
      console.log('🔍 [DEBUG]', JSON.stringify(logData2));
      fetch('http://127.0.0.1:7242/ingest/533de3d1-c5fa-427f-88e4-6ca8b9bbc865',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(logData2)}).catch(()=>{});
      // #endregion

      if (!error && data) {
        setIsAdmin(true);
        // #region agent log
        const logData3 = {location:'AuthContext.tsx:92',message:'isAdmin set to true',data:{userId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'};
        console.log('✅ [DEBUG]', JSON.stringify(logData3));
        fetch('http://127.0.0.1:7242/ingest/533de3d1-c5fa-427f-88e4-6ca8b9bbc865',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(logData3)}).catch(()=>{});
        // #endregion
      } else {
        setIsAdmin(false);
        // #region agent log
        const logData4 = {location:'AuthContext.tsx:97',message:'isAdmin set to false',data:{userId,error:error?.message,hasData:!!data},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'};
        console.log('❌ [DEBUG]', JSON.stringify(logData4));
        fetch('http://127.0.0.1:7242/ingest/533de3d1-c5fa-427f-88e4-6ca8b9bbc865',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(logData4)}).catch(()=>{});
        // #endregion
      }
    } catch (error) {
      console.error("Error checking admin role:", error);
      setIsAdmin(false);
      // #region agent log
      const logData5 = {location:'AuthContext.tsx:104',message:'checkAdminRole exception',data:{userId,error:error instanceof Error?error.message:String(error)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'};
      console.log('⚠️ [DEBUG]', JSON.stringify(logData5));
      fetch('http://127.0.0.1:7242/ingest/533de3d1-c5fa-427f-88e4-6ca8b9bbc865',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(logData5)}).catch(()=>{});
      // #endregion
    } finally {
      setLoading(false);
      // #region agent log
      const logData6 = {location:'AuthContext.tsx:109',message:'loading set to false',data:{userId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'};
      console.log('🔍 [DEBUG]', JSON.stringify(logData6));
      fetch('http://127.0.0.1:7242/ingest/533de3d1-c5fa-427f-88e4-6ca8b9bbc865',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(logData6)}).catch(()=>{});
      // #endregion
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
