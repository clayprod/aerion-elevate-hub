import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileFloatingCTA from "@/components/MobileFloatingCTA";
import { SEOHead } from "@/components/SEO/SEOHead";
import { Breadcrumbs } from "@/components/SEO/Breadcrumbs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import NotFound from "./NotFound";

interface Solution {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string | null;
  benefits: string[] | null;
  use_cases: string[] | null;
  image_url: string | null;
  icon: string | null;
  category: string | null;
  active: boolean;
  featured: boolean;
}

const SolutionPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { data: solution, isLoading, error } = useQuery({
    queryKey: ["solution", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("solutions")
        .select("*")
        .eq("slug", slug)
        .eq("active", true)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return null;
        }
        throw error;
      }

      return data as Solution;
    },
    staleTime: 5 * 60 * 1000,
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
              <div className="space-y-4">
                <div className="h-12 bg-gray-200 rounded animate-pulse w-3/4" />
                <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2" />
              </div>
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

  // Error state or not found
  if (error || !solution) {
    return <NotFound />;
  }

  // SEO props
  const seoProps = {
    title: `${solution.name} | Soluções AERION`,
    description: solution.short_description || solution.description.substring(0, 160),
    keywords: `solução ${solution.name.toLowerCase()}, drones ${solution.category || ''}, aplicações enterprise`,
    canonical: `https://aerion.com.br/solucoes/${solution.slug}`,
    ogType: "article" as const,
    ogImage: solution.image_url || "https://aerion.com.br/images/logos/logo-aerion.png",
  };

  return (
    <div className="min-h-screen">
      <SEOHead {...seoProps} />
      <Header />

      <main className="pt-28 pb-20">
        <Breadcrumbs
          items={[
            { label: "Home", path: "/" },
            { label: "Soluções", path: "/solucoes" },
            { label: solution.name, path: `/solucoes/${solution.slug}` },
          ]}
        />

        {/* Hero Section */}
        <section className="container-custom my-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              {solution.category && (
                <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold mb-4">
                  {solution.category}
                </span>
              )}
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-navy-deep mb-4">
                {solution.name}
              </h1>
              {solution.short_description && (
                <p className="text-xl text-gray-700 leading-relaxed mb-6">
                  {solution.short_description}
                </p>
              )}
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                {solution.description}
              </p>
              <Link to="/contato">
                <Button className="bg-action hover:bg-action/90 text-action-foreground">
                  Solicitar Orçamento
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {solution.image_url && (
              <div>
                <img
                  src={solution.image_url}
                  alt={solution.name}
                  width={600}
                  height={400}
                  className="w-full h-full object-cover rounded-xl shadow-lg"
                  style={{ aspectRatio: "3 / 2" }}
                />
              </div>
            )}
          </div>
        </section>

        {/* Benefits Section */}
        {solution.benefits && solution.benefits.length > 0 && (
          <section className="container-custom my-12">
            <h2 className="text-3xl font-heading font-bold text-navy-deep mb-8">
              Benefícios e Vantagens
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {solution.benefits.map((benefit, index) => (
                <Card key={index} className="p-6">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-action flex-shrink-0 mt-1" />
                    <p className="text-gray-700 leading-relaxed">{benefit}</p>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Use Cases Section */}
        {solution.use_cases && solution.use_cases.length > 0 && (
          <section className="container-custom my-12">
            <h2 className="text-3xl font-heading font-bold text-navy-deep mb-8">
              Casos de Uso
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {solution.use_cases.map((useCase, index) => (
                <Card key={index} className="p-6">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-medium rounded-full mt-2 flex-shrink-0" />
                    <p className="text-gray-700 leading-relaxed">{useCase}</p>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="container-custom my-12">
          <Card className="p-8 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-navy-deep mb-4">
                Pronto para transformar suas operações?
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Entre em contato com nossa equipe para saber mais sobre esta solução
              </p>
              <Link to="/contato">
                <Button size="lg" className="bg-action hover:bg-action/90 text-action-foreground">
                  Falar com Especialista
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </Card>
        </section>
      </main>

      <Footer />
      <MobileFloatingCTA />
    </div>
  );
};

export default SolutionPage;

