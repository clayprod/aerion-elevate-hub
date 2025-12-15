import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  LayoutDashboard,
  FileText,
  Package,
  Lightbulb,
  Settings,
  Image,
  TrendingUp,
  Users,
  Tag,
  Layers,
  FileEdit,
  FolderOpen,
  Globe,
  AlertCircle,
} from "lucide-react";

const Dashboard = () => {
  // #region agent log
  const logData1 = {location:'Dashboard.tsx:24',message:'Dashboard component rendered',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'};
  console.log('🎯 [DEBUG]', JSON.stringify(logData1));
  fetch('http://127.0.0.1:7242/ingest/533de3d1-c5fa-427f-88e4-6ca8b9bbc865',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(logData1)}).catch(()=>{});
  // #endregion
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    totalProducts: 0,
    totalSolutions: 0,
    totalBrands: 0,
    totalProductFamilies: 0,
    totalProductVariants: 0,
    totalVerticals: 0,
    totalCustomPages: 0,
    totalMediaFiles: 0,
  });

  useEffect(() => {
    // #region agent log
    const logData2 = {location:'Dashboard.tsx:41',message:'Dashboard useEffect triggered',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'};
    console.log('🎯 [DEBUG]', JSON.stringify(logData2));
    fetch('http://127.0.0.1:7242/ingest/533de3d1-c5fa-427f-88e4-6ca8b9bbc865',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(logData2)}).catch(()=>{});
    // #endregion
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("[Dashboard] Iniciando fetchStats...");
      console.log("[Dashboard] Supabase client:", supabase ? "disponível" : "não disponível");
      
      const queries = [
        { name: "blog_posts", query: supabase.from("blog_posts").select("id, published", { count: "exact" }) },
        { name: "products", query: supabase.from("products").select("id", { count: "exact" }) },
        { name: "solutions", query: supabase.from("solutions").select("id", { count: "exact" }) },
        { name: "brands", query: supabase.from("brands").select("id", { count: "exact" }) },
        { name: "product_families", query: supabase.from("product_families").select("id", { count: "exact" }) },
        { name: "product_variants", query: supabase.from("product_variants").select("id", { count: "exact" }) },
        { name: "verticals", query: supabase.from("verticals").select("id", { count: "exact" }) },
        { name: "custom_pages", query: supabase.from("custom_pages").select("id, published", { count: "exact" }) },
        { name: "media_library", query: supabase.from("media_library").select("id", { count: "exact" }) },
        { name: "page_blocks", query: supabase.from("page_blocks").select("id", { count: "exact" }) },
        { name: "product_page_content", query: supabase.from("product_page_content").select("id", { count: "exact" }) },
      ];

      console.log("[Dashboard] Executando queries...");
      const results = await Promise.allSettled(
        queries.map((q) => {
          console.log(`[Dashboard] Preparando query para ${q.name}`);
          return q.query;
        })
      );
      console.log("[Dashboard] Queries executadas, processando resultados...");

      const errors: string[] = [];
      const data: any[] = [];

      results.forEach((result, index) => {
        if (result.status === "rejected") {
          const errorMsg = `${queries[index].name}: ${result.reason?.message || "Erro desconhecido"}`;
          errors.push(errorMsg);
          console.error(`[Dashboard] Erro ao buscar ${queries[index].name}:`, result.reason);
          data.push({ data: [], count: 0, error: true });
        } else {
          const queryResult = result.value;
          const logData = {
            hasError: !!queryResult?.error,
            error: queryResult?.error ? {
              message: queryResult.error.message,
              code: queryResult.error.code,
              details: queryResult.error.details,
              hint: queryResult.error.hint
            } : null,
            count: queryResult?.count,
            dataLength: queryResult?.data?.length,
            data: queryResult?.data ? `Array(${queryResult.data.length})` : null
          };
          console.log(`[Dashboard] Resultado para ${queries[index].name}:`, JSON.stringify(logData, null, 2));
          
          if (queryResult && queryResult.error) {
            const errorMsg = `${queries[index].name}: ${queryResult.error.message || queryResult.error.code || "Erro desconhecido"}`;
            errors.push(errorMsg);
            console.error(`[Dashboard] Erro na query ${queries[index].name}:`, queryResult.error);
            data.push({ data: [], count: 0, error: true });
          } else if (queryResult) {
            // Query bem-sucedida
            data.push(queryResult);
          } else {
            // Resultado vazio ou inválido
            console.warn(`[Dashboard] Resultado inválido para ${queries[index].name}:`, queryResult);
            data.push({ data: [], count: 0, error: false });
          }
        }
      });

      const [
        posts,
        products,
        solutions,
        brands,
        productFamilies,
        productVariants,
        verticals,
        customPages,
        mediaFiles,
        pageBlocks,
        productPageContent,
      ] = data;

      if (errors.length > 0) {
        const errorMessage = `Alguns dados não puderam ser carregados:\n${errors.slice(0, 3).join("\n")}${errors.length > 3 ? `\n... e mais ${errors.length - 3} erro(s)` : ""}`;
        setError(errorMessage);
        toast({
          title: "Aviso",
          description: `Alguns dados não puderam ser carregados. Verifique o console para mais detalhes.`,
          variant: "destructive",
        });
      }

      const statsLog = {
        posts: { count: posts.count, dataLength: posts.data?.length, published: posts.data?.filter((p) => p.published).length },
        products: { count: products.count, dataLength: products.data?.length },
        solutions: { count: solutions.count, dataLength: solutions.data?.length },
        brands: { count: brands.count, dataLength: brands.data?.length },
        productFamilies: { count: productFamilies.count, dataLength: productFamilies.data?.length },
        productVariants: { count: productVariants.count, dataLength: productVariants.data?.length },
        verticals: { count: verticals.count, dataLength: verticals.data?.length },
        customPages: { count: customPages.count, dataLength: customPages.data?.length },
        mediaFiles: { count: mediaFiles.count, dataLength: mediaFiles.data?.length },
        pageBlocks: { count: pageBlocks.count, dataLength: pageBlocks.data?.length },
        productPageContent: { count: productPageContent.count, dataLength: productPageContent.data?.length },
      };
      console.log("[Dashboard] Estatísticas processadas:", JSON.stringify(statsLog, null, 2));

      setStats({
        totalPosts: posts.count || 0,
        publishedPosts: posts.data?.filter((p) => p.published).length || 0,
        totalProducts: products.count || 0,
        totalSolutions: solutions.count || 0,
        totalBrands: brands.count || 0,
        totalProductFamilies: productFamilies.count || 0,
        totalProductVariants: productVariants.count || 0,
        totalVerticals: verticals.count || 0,
        totalCustomPages: customPages.count || 0,
        totalMediaFiles: mediaFiles.count || 0,
      });
    } catch (error: any) {
      const errorMessage = error?.message || "Erro desconhecido ao carregar estatísticas";
      console.error("[Dashboard] Erro geral:", error);
      setError(errorMessage);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as estatísticas do dashboard.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const adminSections = [
    {
      title: "Blog",
      description: "Gerenciar posts do blog",
      icon: FileText,
      link: "/admin/blog",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      stat: `${stats.publishedPosts}/${stats.totalPosts} publicados`,
    },
    {
      title: "Hero Section",
      description: "Gerenciar banner principal e mídia",
      icon: Image,
      link: "/admin/hero",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Marcas",
      description: "Gerenciar marcas de produtos",
      icon: Tag,
      link: "/admin/brands",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      stat: `${stats.totalBrands} marcas`,
    },
    {
      title: "Famílias de Produtos",
      description: "Gerenciar famílias de produtos",
      icon: Package,
      link: "/admin/product-families",
      color: "text-green-600",
      bgColor: "bg-green-50",
      stat: `${stats.totalProductFamilies} famílias`,
    },
    {
      title: "Variantes de Produtos",
      description: "Gerenciar variantes de produtos",
      icon: Layers,
      link: "/admin/product-variants",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      stat: `${stats.totalProductVariants} variantes`,
    },
    {
      title: "Verticais/Soluções",
      description: "Gerenciar verticais e soluções",
      icon: Lightbulb,
      link: "/admin/verticals",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      stat: `${stats.totalVerticals} verticais`,
    },
    {
      title: "Editor de Páginas",
      description: "Editor visual de páginas",
      icon: FileEdit,
      link: "/admin/page-editor",
      color: "text-pink-600",
      bgColor: "bg-pink-50",
    },
    {
      title: "Páginas Personalizadas",
      description: "Criar e gerenciar páginas dinâmicas",
      icon: Globe,
      link: "/admin/pages",
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
      stat: `${stats.totalCustomPages} páginas`,
    },
    {
      title: "Biblioteca de Mídia",
      description: "Gerenciar arquivos e imagens",
      icon: FolderOpen,
      link: "/admin/media-library",
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      stat: `${stats.totalMediaFiles} arquivos`,
    },
    {
      title: "Configurações",
      description: "Configurações gerais do site",
      icon: Settings,
      link: "/admin/settings",
      color: "text-gray-600",
      bgColor: "bg-gray-50",
    },
  ];

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-heading font-bold text-navy-deep mb-2">
              <LayoutDashboard className="inline-block mr-3 mb-1" size={36} />
              Dashboard Administrativo
            </h1>
            <p className="text-gray-dark text-lg">
              Gerencie todo o conteúdo do site AERION Elevate Hub
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <Card className="p-4 mb-6 border-red-200 bg-red-50">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-red-600 mt-0.5" size={20} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-900">Aviso</p>
                  <p className="text-sm text-red-700 mt-1 whitespace-pre-line">{error}</p>
                </div>
              </div>
            </Card>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-medium text-sm mb-1">Posts</p>
                  {loading ? (
                    <div className="h-9 w-16 bg-gray-200 animate-pulse rounded"></div>
                  ) : (
                    <p className="text-3xl font-bold text-navy-deep">{stats.totalPosts}</p>
                  )}
                </div>
                <FileText className="text-blue-600" size={32} />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-medium text-sm mb-1">Publicados</p>
                  {loading ? (
                    <div className="h-9 w-16 bg-gray-200 animate-pulse rounded"></div>
                  ) : (
                    <p className="text-3xl font-bold text-navy-deep">{stats.publishedPosts}</p>
                  )}
                </div>
                <TrendingUp className="text-green-600" size={32} />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-medium text-sm mb-1">Produtos</p>
                  {loading ? (
                    <div className="h-9 w-16 bg-gray-200 animate-pulse rounded"></div>
                  ) : (
                    <p className="text-3xl font-bold text-navy-deep">{stats.totalProducts}</p>
                  )}
                </div>
                <Package className="text-green-600" size={32} />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-medium text-sm mb-1">Soluções</p>
                  {loading ? (
                    <div className="h-9 w-16 bg-gray-200 animate-pulse rounded"></div>
                  ) : (
                    <p className="text-3xl font-bold text-navy-deep">{stats.totalSolutions}</p>
                  )}
                </div>
                <Lightbulb className="text-orange-600" size={32} />
              </div>
            </Card>
          </div>

          {/* Admin Sections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminSections.map((section) => (
              <Link key={section.title} to={section.link}>
                <Card className="p-6 hover:shadow-lg transition-all duration-300 h-full">
                  <div className={`${section.bgColor} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                    <section.icon className={section.color} size={24} />
                  </div>
                  <h3 className="text-xl font-heading font-bold text-navy-deep mb-2">
                    {section.title}
                  </h3>
                  <p className="text-gray-dark mb-4">{section.description}</p>
                  {section.stat && (
                    <p className="text-sm text-gray-medium font-semibold">{section.stat}</p>
                  )}
                  <Button variant="link" className="px-0 text-action hover:text-action/80 mt-2">
                    Acessar →
                  </Button>
                </Card>
              </Link>
            ))}
          </div>
        </div>
    </AdminLayout>
  );
};

export default Dashboard;

