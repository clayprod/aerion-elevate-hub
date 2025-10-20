import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Produtos from "./pages/Produtos";
import Solucoes from "./pages/Solucoes";
import Sobre from "./pages/Sobre";
import Contato from "./pages/Contato";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import AutelAlpha from "./pages/products/AutelAlpha";
import EvoLiteEnterprise from "./pages/products/EvoLiteEnterprise";
import EvoMaxV2 from "./pages/products/EvoMaxV2";
import AdminBlog from "./pages/admin/AdminBlog";
import Dashboard from "./pages/admin/Dashboard";
import AdminHero from "./pages/admin/AdminHero";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminSolutions from "./pages/admin/AdminSolutions";
import AdminSettings from "./pages/admin/AdminSettings";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/produtos" element={<Produtos />} />
            <Route path="/produtos/evo-lite-enterprise" element={<EvoLiteEnterprise />} />
            <Route path="/produtos/evo-max-v2" element={<EvoMaxV2 />} />
            <Route path="/produtos/autel-alpha" element={<AutelAlpha />} />
            <Route path="/solucoes" element={<Solucoes />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Protected Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/blog"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminBlog />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/hero"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminHero />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminProducts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/solutions"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminSolutions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminSettings />
                </ProtectedRoute>
              }
            />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
