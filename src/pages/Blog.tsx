import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileFloatingCTA from "@/components/MobileFloatingCTA";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Calendar, User } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const Blog = () => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select(`
          *,
          author:profiles!blog_posts_author_id_fkey(full_name)
        `)
        .eq("published", true)
        .order("published_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen">
      <Header />

      <main className="pt-28 pb-20">
        {/* Hero Section */}
        <section className="bg-gradient-primary py-16 text-white">
          <div className="container-custom text-center">
            <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Blog Aerion
            </h1>
            <p className="text-xl text-cyan-light max-w-3xl mx-auto">
              Insights, novidades e cases de sucesso sobre tecnologia aérea profissional
            </p>
          </div>
        </section>

        {/* Posts Grid */}
        <section className="py-16">
          <div className="container-custom">
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-dark">Carregando posts...</p>
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
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}

                      <div className="p-6">
                        {post.category && (
                          <span className="inline-block px-3 py-1 bg-teal/10 text-teal rounded-full text-sm font-heading font-semibold mb-3">
                            {post.category}
                          </span>
                        )}

                        <h3 className="text-xl font-heading font-bold text-navy-deep mb-3 group-hover:text-aerion-blue transition-colors">
                          {post.title}
                        </h3>

                        <p className="text-gray-dark mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>

                        <div className="flex items-center justify-between text-sm text-gray-medium">
                          {(post as any).author?.full_name && (
                            <div className="flex items-center space-x-2">
                              <User className="w-4 h-4" />
                              <span>{(post as any).author.full_name}</span>
                            </div>
                          )}

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
