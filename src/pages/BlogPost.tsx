import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileFloatingCTA from "@/components/MobileFloatingCTA";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, User, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const BlogPost = () => {
  const { slug } = useParams();

  const { data: post, isLoading } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select(`
          *,
          author:profiles!blog_posts_author_id_fkey(full_name)
        `)
        .eq("slug", slug)
        .eq("published", true)
        .single();

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen">
      <Header />

      <main className="pt-28 pb-20">
        {isLoading ? (
          <div className="container-custom py-12 text-center">
            <p className="text-gray-dark">Carregando post...</p>
          </div>
        ) : post ? (
          <>
            {/* Header */}
            <section className="bg-gradient-primary py-16 text-white">
              <div className="container-custom max-w-4xl">
                <Button
                  asChild
                  variant="outline"
                  className="mb-6 bg-white/10 hover:bg-white/20 border-white/30 text-white"
                >
                  <Link to="/blog" className="flex items-center">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar para o Blog
                  </Link>
                </Button>

                {post.category && (
                  <span className="inline-block px-3 py-1 bg-white/20 text-cyan-light rounded-full text-sm font-heading font-semibold mb-4">
                    {post.category}
                  </span>
                )}

                <h1 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                  {post.title}
                </h1>

                <div className="flex flex-wrap items-center gap-6 text-cyan-light">
                  {(post as any).author?.full_name && (
                    <div className="flex items-center space-x-2">
                      <User className="w-5 h-5" />
                      <span>{(post as any).author.full_name}</span>
                    </div>
                  )}

                  {post.published_at && (
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5" />
                      <span>{format(new Date(post.published_at), "dd 'de' MMMM, yyyy", { locale: ptBR })}</span>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Cover Image */}
            {post.cover_image && (
              <div className="container-custom max-w-4xl my-12">
                <img
                  src={post.cover_image}
                  alt={post.title}
                  className="w-full rounded-2xl shadow-lg"
                />
              </div>
            )}

            {/* Content */}
            <article className="container-custom max-w-4xl">
              <div className="prose prose-lg max-w-none">
                <div dangerouslySetInnerHTML={{ __html: post.content }} className="text-gray-dark leading-relaxed whitespace-pre-wrap" />
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-light">
                  <h3 className="text-lg font-heading font-bold text-navy-deep mb-4">Tags:</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-gray-light text-gray-dark rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </article>
          </>
        ) : (
          <div className="container-custom py-12 text-center">
            <h2 className="text-2xl font-heading font-bold text-navy-deep mb-4">
              Post não encontrado
            </h2>
            <Button asChild>
              <Link to="/blog">Voltar para o Blog</Link>
            </Button>
          </div>
        )}
      </main>

      <Footer />
      <MobileFloatingCTA />
    </div>
  );
};

export default BlogPost;
