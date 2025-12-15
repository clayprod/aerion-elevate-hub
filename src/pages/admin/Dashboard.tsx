import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";

const Dashboard = () => {
  // #region agent log
  const logData1 = {location:'Dashboard.tsx:24',message:'Dashboard component rendered',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'};
  console.log('🎯 [DEBUG]', JSON.stringify(logData1));
  fetch('http://127.0.0.1:7242/ingest/533de3d1-c5fa-427f-88e4-6ca8b9bbc865',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(logData1)}).catch(()=>{});
  // #endregion
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
    try {
      const [posts, products, solutions, brands, productFamilies, productVariants, verticals, customPages, mediaFiles, pageBlocks, productPageContent] = await Promise.all([
        supabase.from("blog_posts").select("id, published", { count: "exact" }),
        supabase.from("products").select("id", { count: "exact" }),
        supabase.from("solutions").select("id", { count: "exact" }),
        supabase.from("brands").select("id", { count: "exact" }).catch(() => ({ data: [], count: 0 })),
        supabase.from("product_families").select("id", { count: "exact" }).catch(() => ({ data: [], count: 0 })),
        supabase.from("product_variants").select("id", { count: "exact" }).catch(() => ({ data: [], count: 0 })),
        supabase.from("verticals").select("id", { count: "exact" }).catch(() => ({ data: [], count: 0 })),
        supabase.from("custom_pages").select("id, published", { count: "exact" }),
        supabase.from("media_library").select("id", { count: "exact" }).catch(() => ({ data: [], count: 0 })),
        supabase.from("page_blocks").select("id", { count: "exact" }).catch(() => ({ data: [], count: 0 })),
        supabase.from("product_page_content").select("id", { count: "exact" }).catch(() => ({ data: [], count: 0 })),
      ]);

      const publishedPages = customPages.data?.filter((p) => p.published).length || 0;

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
    } catch (error) {
      console.error("Error fetching stats:", error);
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

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-medium text-sm mb-1">Posts</p>
                  <p className="text-3xl font-bold text-navy-deep">{stats.totalPosts}</p>
                </div>
                <FileText className="text-blue-600" size={32} />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-medium text-sm mb-1">Publicados</p>
                  <p className="text-3xl font-bold text-navy-deep">{stats.publishedPosts}</p>
                </div>
                <TrendingUp className="text-green-600" size={32} />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-medium text-sm mb-1">Produtos</p>
                  <p className="text-3xl font-bold text-navy-deep">{stats.totalProducts}</p>
                </div>
                <Package className="text-green-600" size={32} />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-medium text-sm mb-1">Soluções</p>
                  <p className="text-3xl font-bold text-navy-deep">{stats.totalSolutions}</p>
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

