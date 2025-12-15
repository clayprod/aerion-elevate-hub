import React, { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CookieProvider } from "./contexts/CookieContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";
import CookieConsent from "./components/CookieConsent";
import StaticPageWrapper from "./components/StaticPageWrapper";

// Rotas principais - carregadas imediatamente
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Produtos from "./pages/Produtos";
import Solucoes from "./pages/Solucoes";
import Sobre from "./pages/Sobre";
import Contato from "./pages/Contato";
import PoliticaPrivacidade from "./pages/PoliticaPrivacidade";
import TermosUso from "./pages/TermosUso";
import Auth from "./pages/Auth";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import AutelAlpha from "./pages/products/AutelAlpha";
import EvoLiteEnterprise from "./pages/products/EvoLiteEnterprise";
import EvoMaxV2 from "./pages/products/EvoMaxV2";
import AutelMapper from "./pages/products/AutelMapper";
import ConstrucaoTopografia from "./pages/solucoes/ConstrucaoTopografia";
import InspecaoIndustrial from "./pages/solucoes/InspecaoIndustrial";
import SegurancaPublica from "./pages/solucoes/SegurancaPublica";
import ResgateEmergencias from "./pages/solucoes/ResgateEmergencias";

// Rotas admin - lazy loaded (menos acessadas)
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminBlog = lazy(() => import("./pages/admin/AdminBlog"));
const AdminHero = lazy(() => import("./pages/admin/AdminHero"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const AdminSolutions = lazy(() => import("./pages/admin/AdminSolutions"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const AdminPages = lazy(() => import("./pages/admin/AdminPages"));

// Rota dinâmica handler - lazy loaded
const DynamicRouteHandler = lazy(() => import("./components/DynamicRouteHandler"));

// Componente de loading para Suspense
const PageLoader = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="text-center">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-medium border-r-transparent"></div>
      <p className="mt-4 text-gray-dark">Carregando...</p>
    </div>
  </div>
);

const queryClient = new QueryClient();

const App = () => {
  // #region agent log
  const logDataApp = {location:'App.tsx:59',message:'App component rendered',data:{pathname:window.location.pathname},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'};
  console.log('🚀 [DEBUG]', JSON.stringify(logDataApp));
  fetch('http://127.0.0.1:7242/ingest/533de3d1-c5fa-427f-88e4-6ca8b9bbc865',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(logDataApp)}).catch(()=>{});
  // #endregion
  return (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CookieProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <CookieConsent />
            <Routes>
              {/* Rotas estáticas com suporte a override via CMS */}
              <Route path="/" element={<StaticPageWrapper><Index /></StaticPageWrapper>} />
              <Route path="/produtos" element={<StaticPageWrapper><Produtos /></StaticPageWrapper>} />
              <Route path="/produtos/evo-lite-enterprise" element={<StaticPageWrapper><EvoLiteEnterprise /></StaticPageWrapper>} />
              <Route path="/produtos/evo-max-v2" element={<StaticPageWrapper><EvoMaxV2 /></StaticPageWrapper>} />
              <Route path="/produtos/autel-alpha" element={<StaticPageWrapper><AutelAlpha /></StaticPageWrapper>} />
              <Route path="/produtos/autel-mapper" element={<StaticPageWrapper><AutelMapper /></StaticPageWrapper>} />
              <Route path="/solucoes" element={<StaticPageWrapper><Solucoes /></StaticPageWrapper>} />
              <Route path="/solucoes/construcao" element={<StaticPageWrapper><ConstrucaoTopografia /></StaticPageWrapper>} />
              <Route path="/solucoes/industrial" element={<StaticPageWrapper><InspecaoIndustrial /></StaticPageWrapper>} />
              <Route path="/solucoes/seguranca" element={<StaticPageWrapper><SegurancaPublica /></StaticPageWrapper>} />
              <Route path="/solucoes/resgate" element={<StaticPageWrapper><ResgateEmergencias /></StaticPageWrapper>} />
              <Route path="/sobre" element={<StaticPageWrapper><Sobre /></StaticPageWrapper>} />
              <Route path="/contato" element={<StaticPageWrapper><Contato /></StaticPageWrapper>} />
              <Route path="/politica-privacidade" element={<StaticPageWrapper><PoliticaPrivacidade /></StaticPageWrapper>} />
              <Route path="/termos-uso" element={<StaticPageWrapper><TermosUso /></StaticPageWrapper>} />
              
              {/* Blog - não usa wrapper pois tem sistema próprio */}
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              
              {/* Auth - não precisa de override */}
              <Route path="/auth" element={<Auth />} />
                
                {/* Protected Admin Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requireAdmin>
                      <Suspense fallback={<PageLoader />}>
                        <Dashboard />
                      </Suspense>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/blog"
                  element={
                    <ProtectedRoute requireAdmin>
                      <Suspense fallback={<PageLoader />}>
                        <AdminBlog />
                      </Suspense>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/hero"
                  element={
                    <ProtectedRoute requireAdmin>
                      <Suspense fallback={<PageLoader />}>
                        <AdminHero />
                      </Suspense>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/products"
                  element={
                    <ProtectedRoute requireAdmin>
                      <Suspense fallback={<PageLoader />}>
                        <AdminProducts />
                      </Suspense>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/solutions"
                  element={
                    <ProtectedRoute requireAdmin>
                      <Suspense fallback={<PageLoader />}>
                        <AdminSolutions />
                      </Suspense>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/settings"
                  element={
                    <ProtectedRoute requireAdmin>
                      <Suspense fallback={<PageLoader />}>
                        <AdminSettings />
                      </Suspense>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/pages"
                  element={
                    <ProtectedRoute requireAdmin>
                      <Suspense fallback={<PageLoader />}>
                        <AdminPages />
                      </Suspense>
                    </ProtectedRoute>
                  }
                />
                
              {/* Dynamic route handler - must come after all static routes but before NotFound */}
              <Route
                path="/*"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <DynamicRouteHandler />
                  </Suspense>
                }
              />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CookieProvider>
    </AuthProvider>
  </QueryClientProvider>
  );
};

export default App;
