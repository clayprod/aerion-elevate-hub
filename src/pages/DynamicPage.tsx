import { useParams, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileFloatingCTA from "@/components/MobileFloatingCTA";
import { SEOHead } from "@/components/SEO/SEOHead";
import { Breadcrumbs } from "@/components/SEO/Breadcrumbs";
import SanitizedHTML from "@/components/SanitizedHTML";
import NotFound from "./NotFound";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const DynamicPage = () => {
  const location = useLocation();
  const path = location.pathname;

  const { data: page, isLoading, error } = useQuery({
    queryKey: ["dynamic-page", path],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("custom_pages")
        .select("*")
        .eq("path", path)
        .eq("published", true)
        .single();

      if (error) {
        // Se não encontrado, não é erro crítico
        if (error.code === "PGRST116") {
          return null;
        }
        throw error;
      }

      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 3,
    retryDelay: 1000,
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-28 pb-20">
          <div className="container-custom max-w-4xl py-12">
            <div className="space-y-8">
              {/* Skeleton Header */}
              <div className="space-y-4">
                <div className="h-12 bg-gray-200 rounded animate-pulse w-3/4" />
                <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2" />
              </div>
              {/* Skeleton Content */}
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    console.error("Error loading dynamic page:", error);
    return <NotFound />;
  }

  // Page not found or not published
  if (!page) {
    return <NotFound />;
  }

  // SEO props
  const seoProps = {
    title: page.meta_title || `${page.title} | AERION`,
    description: page.meta_description || page.excerpt || `Confira ${page.title} na AERION.`,
    keywords: page.meta_keywords?.join(", ") || "",
    canonical: `https://aerion.com.br${page.path}`,
    ogType: "article" as const,
    ogImage: page.featured_image || "https://aerion.com.br/images/logos/logo-aerion.png",
  };

  return (
    <div className="min-h-screen">
      <SEOHead {...seoProps} />
      <Header />

      <main className="pt-28 pb-20">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: "Home", path: "/" },
            { label: page.title, path: page.path },
          ]}
        />

        {/* Page Header */}
        <section className="container-custom max-w-6xl my-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Coluna Esquerda: Título e Resumo */}
            <div className="md:col-span-2 flex flex-col justify-center">
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-navy-deep mb-4">
                {page.title}
              </h1>

              {page.published_at && (
                <div className="flex items-center gap-4 text-gray-600 mb-4">
                  <span>
                    {format(new Date(page.published_at), "dd 'de' MMMM, yyyy", {
                      locale: ptBR,
                    })}
                  </span>
                </div>
              )}

              {page.excerpt && (
                <p className="text-lg text-gray-700 leading-relaxed">{page.excerpt}</p>
              )}
            </div>

            {/* Coluna Direita: Imagem */}
            {page.featured_image && (
              <div className="md:col-span-1">
                <img
                  src={page.featured_image}
                  alt={page.title}
                  width={400}
                  height={500}
                  loading="eager"
                  className="w-full h-full object-cover rounded-xl shadow-lg"
                  style={{ aspectRatio: "4 / 5" }}
                />
              </div>
            )}
          </div>
        </section>

        {/* Content */}
        <article className="container-custom max-w-4xl py-4">
          <div className="prose prose-lg max-w-none">
            <SanitizedHTML
              html={page.content}
              className="text-lg text-gray-700 leading-relaxed"
            />
          </div>

          {/* Gallery */}
          {page.gallery_images && page.gallery_images.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-light">
              <h3 className="text-lg font-heading font-bold text-navy-deep mb-4">
                Galeria
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {page.gallery_images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${page.title} - Imagem ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                    loading="lazy"
                  />
                ))}
              </div>
            </div>
          )}
        </article>
      </main>

      <Footer />
      <MobileFloatingCTA />
    </div>
  );
};

export default DynamicPage;
