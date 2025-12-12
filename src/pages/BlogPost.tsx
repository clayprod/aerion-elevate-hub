import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileFloatingCTA from "@/components/MobileFloatingCTA";
import { SEOHead } from "@/components/SEO/SEOHead";
import { BlogPostSchema } from "@/components/SEO/BlogPostSchema";
import { Breadcrumbs } from "@/components/SEO/Breadcrumbs";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, User, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import SanitizedHTML from "@/components/SanitizedHTML";

const BlogPost = () => {
  const { slug } = useParams();

  const { data: post, isLoading } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .single();

      if (error) throw error;
      return data;
    },
  });

  // Construir meta tags dinâmicas baseadas no post
  const getSEOProps = () => {
    if (!post) {
      return {
        title: "Post não encontrado | Blog Aerion",
        description: "O post solicitado não foi encontrado.",
        canonical: "https://aerion.com.br/blog",
      };
    }

    const title = `${post.title} | Blog Aerion`;
    const description = post.excerpt || `Leia mais sobre ${post.title} no blog da Aerion Technologies.`;
    const canonical = `https://aerion.com.br/blog/${post.slug}`;
    const ogImage = post.cover_image || "https://aerion.com.br/images/logos/logo-aerion.png";
    const keywords = post.tags?.join(", ") || post.category || "drones, tecnologia aérea, Autel";

    return {
      title,
      description,
      keywords,
      canonical,
      ogType: "article" as const,
      ogImage,
    };
  };

  const seoProps = getSEOProps();

  return (
    <div className="min-h-screen">
      {!isLoading && <SEOHead {...seoProps} />}
      {!isLoading && post && (
        <BlogPostSchema
          title={post.title}
          description={post.excerpt || post.title}
          author="Admin"
          publishedDate={post.published_at || post.created_at || new Date().toISOString()}
          modifiedDate={post.updated_at || post.published_at || post.created_at}
          image={post.cover_image || undefined}
          url={`https://aerion.com.br/blog/${post.slug}`}
        />
      )}
      <Header />

      <main className="pt-28 pb-20">
        {!isLoading && post && (
          <Breadcrumbs items={[
            { label: 'Home', path: '/' },
            { label: 'Blog', path: '/blog' },
            { label: post.title, path: `/blog/${post.slug}` }
          ]} />
        )}
        {isLoading ? (
          <div className="container-custom max-w-6xl py-12">
            <div className="space-y-8">
              {/* Skeleton Header */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-4">
                  <div className="h-12 bg-gray-200 rounded animate-pulse w-3/4" />
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="md:col-span-1">
                  <div className="aspect-[4/5] bg-gray-200 rounded-xl animate-pulse" />
                </div>
              </div>
              {/* Skeleton Content */}
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
              </div>
            </div>
          </div>
        ) : post ? (
          <>
            {/* Botão Voltar */}
            <div className="container-custom max-w-6xl mb-4">
              <Button
                asChild
                variant="outline"
                className="flex items-center gap-2"
              >
                <Link to="/blog" className="flex items-center">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar para o Blog
                </Link>
              </Button>
            </div>

            {/* Post Header com Imagem */}
            <section className="container-custom max-w-6xl my-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Coluna Esquerda: Título, Autor, Data, Resumo */}
                <div className="md:col-span-2 flex flex-col justify-center">
                  <h1 className="text-4xl md:text-5xl font-heading font-bold text-navy-deep mb-4">
                    {post.title}
                  </h1>
                  
                  <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                    <div className="flex items-center space-x-2">
                      <User className="w-5 h-5" />
                      <span>Por Admin</span>
                    </div>
                    {post.published_at && (
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-5 h-5" />
                        <span>{format(new Date(post.published_at), "dd 'de' MMMM, yyyy", { locale: ptBR })}</span>
                      </div>
                    )}
                  </div>
                  
                  {post.excerpt && (
                    <p className="text-lg text-gray-700 leading-relaxed">
                      {post.excerpt}
                    </p>
                  )}
                </div>
                
                {/* Coluna Direita: Imagem */}
                <div className="md:col-span-1">
                  {post.cover_image && (
                    <img
                      src={post.cover_image}
                      alt={post.title}
                      width={400}
                      height={500}
                      loading="eager"
                      className="w-full h-full object-cover rounded-xl shadow-lg"
                      style={{ aspectRatio: '4 / 5' }}
                    />
                  )}
                </div>
              </div>
            </section>

            {/* Content */}
            <article className="container-custom max-w-4xl py-4">
              <div className="prose prose-lg max-w-none">
                <SanitizedHTML 
                  html={post.content}
                  className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap" 
                />
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
