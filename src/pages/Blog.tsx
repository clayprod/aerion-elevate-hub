import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileFloatingCTA from "@/components/MobileFloatingCTA";
import { SEOHead } from "@/components/SEO/SEOHead";
import { getKeywordsForRoute } from "@/data/keywords";
import { Breadcrumbs } from "@/components/SEO/Breadcrumbs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Calendar, User } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const Blog = () => {
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      console.log("🔍 Fetching blog posts...");
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("published_at", { ascending: false });

      if (error) {
        console.error("❌ Error fetching blog posts:", error);
        throw error;
      }
      
      console.log("✅ Blog posts fetched:", data);
      return data;
    },
  });

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Blog Aerion | Insights sobre Drones Profissionais e Tecnologia Aérea"
        description="Acesse insights, novidades e cases de sucesso sobre tecnologia aérea profissional, drones Autel, aplicações industriais e muito mais no blog da Aerion Technologies."
        keywords={getKeywordsForRoute('/blog')}
        canonical="https://aerion.com.br/blog"
        ogType="website"
      />
      <Header />

      <main className="pt-28 pb-20">
        <Breadcrumbs />
        {/* Hero Section */}
        <section className="py-10 bg-gray-light/30">
          <div className="container-custom max-w-4xl">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-navy-deep mb-4">
                Blog Aerion
              </h1>
              <p className="text-lg text-gray-dark max-w-2xl mx-auto">
                Insights, novidades e cases de sucesso sobre tecnologia aérea profissional
              </p>
            </div>
          </div>
        </section>

        {/* Posts Grid */}
        <section className="pt-2 pb-4">
          <div className="container-custom">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="aspect-video bg-gray-200 animate-pulse" style={{ aspectRatio: '16 / 9' }} />
                    <div className="p-6 space-y-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4" />
                      <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4" />
                      <div className="h-4 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <h2 className="text-2xl font-heading font-bold text-navy-deep mb-4">
                  Erro ao carregar posts
                </h2>
                <p className="text-gray-dark mb-4">
                  Não foi possível carregar os posts do blog. Verifique a conexão e tente novamente.
                </p>
                <p className="text-sm text-gray-500">
                  Erro: {error.message}
                </p>
              </div>
            ) : posts && posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <Card key={post.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <Link to={`/blog/${post.slug}`}>
                      {post.cover_image && (
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={post.cover_image}
                            alt={post.title}
                            width={600}
                            height={338}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            style={{ aspectRatio: '16 / 9' }}
                          />
                        </div>
                      )}

                      <div className="p-6">
                        {post.category && (
                          <span className="inline-block px-3 py-1 bg-teal/10 text-teal rounded-full text-sm font-heading font-semibold mb-3">
                            {post.category}
                          </span>
                        )}

                        <h3 className="text-xl font-heading font-bold text-navy-deep mb-3 group-hover:text-blue-medium transition-colors">
                          {post.title}
                        </h3>

                        <p className="text-gray-dark mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>

                        <div className="flex items-center justify-between text-sm text-gray-medium">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4" />
                            <span>Admin</span>
                          </div>
                          {post.published_at && (
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4" />
                              <span>{format(new Date(post.published_at), "dd 'de' MMM, yyyy", { locale: ptBR })}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-dark text-lg">Nenhum post publicado ainda.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
      <MobileFloatingCTA />
    </div>
  );
};

export default Blog;
