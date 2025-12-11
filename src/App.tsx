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

const App = () => (
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
              <Route path="/" element={<Index />} />
              <Route path="/produtos" element={<Produtos />} />
              <Route path="/produtos/evo-lite-enterprise" element={<EvoLiteEnterprise />} />
              <Route path="/produtos/evo-max-v2" element={<EvoMaxV2 />} />
              <Route path="/produtos/autel-alpha" element={<AutelAlpha />} />
              <Route path="/produtos/autel-mapper" element={<AutelMapper />} />
              <Route path="/solucoes" element={<Solucoes />} />
              <Route path="/solucoes/construcao" element={<ConstrucaoTopografia />} />
              <Route path="/solucoes/industrial" element={<InspecaoIndustrial />} />
              <Route path="/solucoes/seguranca" element={<SegurancaPublica />} />
              <Route path="/solucoes/resgate" element={<ResgateEmergencias />} />
              <Route path="/sobre" element={<Sobre />} />
              <Route path="/contato" element={<Contato />} />
              <Route path="/politica-privacidade" element={<PoliticaPrivacidade />} />
              <Route path="/termos-uso" element={<TermosUso />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
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
                
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CookieProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
