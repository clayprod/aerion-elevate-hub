import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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
} from "lucide-react";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    totalProducts: 0,
    totalSolutions: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const [posts, products, solutions] = await Promise.all([
      supabase.from("blog_posts").select("id, published", { count: "exact" }),
      supabase.from("products").select("id", { count: "exact" }),
      supabase.from("solutions").select("id", { count: "exact" }),
    ]);

    setStats({
      totalPosts: posts.count || 0,
      publishedPosts: posts.data?.filter((p) => p.published).length || 0,
      totalProducts: products.count || 0,
      totalSolutions: solutions.count || 0,
    });
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
      title: "Produtos",
      description: "Gerenciar catálogo de produtos",
      icon: Package,
      link: "/admin/products",
      color: "text-green-600",
      bgColor: "bg-green-50",
      stat: `${stats.totalProducts} produtos`,
    },
    {
      title: "Soluções",
      description: "Gerenciar soluções oferecidas",
      icon: Lightbulb,
      link: "/admin/solutions",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      stat: `${stats.totalSolutions} soluções`,
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
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-28 pb-20">
        <div className="container-custom max-w-7xl">
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
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;

