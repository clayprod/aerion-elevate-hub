import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileFloatingCTA from "@/components/MobileFloatingCTA";
import { SEOHead } from "@/components/SEO/SEOHead";
import { getKeywordsForSolution } from "@/data/keywords";
import { Breadcrumbs } from "@/components/SEO/Breadcrumbs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import NotFound from "./NotFound";
import * as LucideIcons from "lucide-react";

// Type definitions for JSONB structures
interface HeroSection {
  badge_text?: string;
  badge_icon?: string;
  title?: string;
  description?: string;
  cta_primary_text?: string;
  cta_secondary_text?: string;
  hero_image_url?: string;
  gradient_colors?: string[];
}

interface Benefit {
  icon?: string;
  title?: string;
  description?: string;
}

interface Drone {
  name?: string;
  variant?: string;
  image?: string;
  features?: string[];
  applications?: string[];
  bestFor?: string;
}

interface Application {
  title?: string;
  description?: string;
  image?: string;
  features?: string[];
  results?: string[];
}

interface UseCase {
  title?: string;
  description?: string;
  icon?: string;
  image?: string;
  benefits?: string[];
  results?: string[];
  alignTop?: boolean;
}

interface ThemeColors {
  primary?: string;
  secondary?: string;
  badge_bg?: string;
  badge_text?: string;
}

interface Solution {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string | null;
  image_url: string | null;
  icon: string | null;
  category: string | null;
  active: boolean;
  featured: boolean;
  hero_section: HeroSection | null;
  benefits: string[] | Benefit[] | null;
  drones: Drone[] | null;
  applications: Application[] | null;
  use_cases: string[] | UseCase[] | null;
  theme_colors: ThemeColors | null;
}

// Helper function to get icon component by name
const getIconComponent = (iconName: string | undefined): React.ComponentType<any> | null => {
  if (!iconName) return null;
  const IconComponent = (LucideIcons as any)[iconName];
  return IconComponent || null;
};

const SolutionPage = () => {
  const { slug } = useParams<{ slug: string }>();

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

  const heroSection = solution.hero_section || {};
  const themeColors = solution.theme_colors || {};
  const gradientFrom = heroSection.gradient_colors?.[0] || "from-blue-50";
  const gradientTo = heroSection.gradient_colors?.[1] || "to-white";
  const badgeBg = themeColors.badge_bg || "bg-blue-100";
  const badgeText = themeColors.badge_text || "text-blue-700";
  const primaryColor = themeColors.primary || "blue";

  // SEO props
  const heroTitle = heroSection.title || solution.name;
  const heroDescription = heroSection.description || solution.description;
  const seoProps = {
    title: `${heroTitle} | Soluções AERION`,
    description: solution.short_description || heroDescription.substring(0, 160),
    keywords: getKeywordsForSolution(solution.slug),
    canonical: `https://aerion.com.br/solucoes/${solution.slug}`,
    ogType: "article" as const,
    ogImage: heroSection.hero_image_url || solution.image_url || "https://aerion.com.br/images/logos/logo-aerion.png",
  };

  const BadgeIcon = heroSection.badge_icon ? getIconComponent(heroSection.badge_icon) : null;

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
        <section className={`relative py-20 bg-gradient-to-br ${gradientFrom} ${gradientTo}`}>
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                {heroSection.badge_text && (
                  <div className={`inline-flex items-center gap-2 ${badgeBg} ${badgeText} px-4 py-2 rounded-full text-sm font-medium mb-6`}>
                    {BadgeIcon && <BadgeIcon className="w-4 h-4" />}
                    {heroSection.badge_text}
                  </div>
                )}
                <h1 className="text-4xl md:text-5xl font-heading font-bold text-navy-deep mb-6">
                  {heroTitle}
                </h1>
                <p className="text-xl text-gray-dark leading-relaxed mb-8">
                  {heroDescription}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  {heroSection.cta_primary_text && (
                    <Button asChild size="lg" className="bg-action hover:bg-action/90 text-action-foreground">
                      <Link to="/contato">
                        {heroSection.cta_primary_text}
                        <LucideIcons.ArrowRight className="w-5 h-5 ml-2" />
                      </Link>
                    </Button>
                  )}
                  {heroSection.cta_secondary_text && (
                    <Button asChild variant="outline" size="lg">
                      <Link to="/produtos">
                        {heroSection.cta_secondary_text}
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
              <div className="relative">
                <img
                  src={heroSection.hero_image_url || solution.image_url || "/images/placeholder-solution.png"}
                  alt={heroTitle}
                  className="rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        {solution.benefits && solution.benefits.length > 0 && (
          <section className="py-20 bg-white">
            <div className="container-custom">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-navy-deep mb-4">
                  {solution.slug === 'construcao' 
                    ? 'Por que escolher drones para construção?'
                    : solution.slug === 'industrial'
                    ? 'Por que drones para inspeção industrial?'
                    : solution.slug === 'seguranca'
                    ? 'Por que drones para segurança pública?'
                    : solution.slug === 'resgate'
                    ? 'Por que drones para resgate e emergências?'
                    : `Por que drones para ${solution.name.toLowerCase()}?`}
                </h2>
                <p className="text-xl text-gray-dark max-w-3xl mx-auto">
                  {solution.slug === 'construcao'
                    ? 'Tecnologia que revoluciona a forma como você planeja, executa e monitora seus projetos'
                    : solution.slug === 'industrial'
                    ? 'Tecnologia que revoluciona a manutenção preditiva e segurança operacional'
                    : solution.slug === 'seguranca'
                    ? 'Tecnologia que revoluciona a proteção e resposta a emergências'
                    : solution.slug === 'resgate'
                    ? 'Tecnologia que salva vidas em situações críticas'
                    : 'Tecnologia que revoluciona a forma como você opera'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {(solution.benefits.length > 0 && typeof solution.benefits[0] === 'string' 
                  ? (solution.benefits as string[]).map((b, idx) => ({ icon: '', title: '', description: b }))
                  : solution.benefits as Benefit[]
                ).map((benefit, index) => {
                  const BenefitIcon = benefit.icon ? getIconComponent(benefit.icon) : null;
                  const iconBgClass = `bg-${primaryColor}-100`;
                  const iconColorClass = `text-${primaryColor}-600`;

                  return (
                    <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                      {BenefitIcon && (
                        <div className={`w-16 h-16 ${iconBgClass} rounded-full flex items-center justify-center mx-auto mb-4`}>
                          <BenefitIcon className={`w-8 h-8 ${iconColorClass}`} />
                        </div>
                      )}
                      {benefit.title && (
                        <h3 className="text-xl font-semibold text-navy-deep mb-3">{benefit.title}</h3>
                      )}
                      {benefit.description && (
                        <p className="text-gray-dark">{benefit.description}</p>
                      )}
                    </Card>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Applications/Industries Section */}
        {solution.applications && solution.applications.length > 0 && (
          <section className={`py-20 ${solution.drones ? 'bg-gray-50' : 'bg-white'}`}>
            <div className="container-custom">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-navy-deep mb-4">
                  {solution.slug === 'industrial' ? 'Setores Atendidos' : `Aplicações em ${solution.name}`}
                </h2>
                <p className="text-xl text-gray-dark max-w-3xl mx-auto">
                  {solution.slug === 'industrial' 
                    ? 'Soluções especializadas para diferentes indústrias'
                    : `Soluções especializadas para diferentes necessidades`}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {solution.applications.map((application, index) => (
                  <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow">
                    {application.image && (
                      <div className="relative h-48">
                        <img
                          src={application.image}
                          alt={application.title || ''}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div className="p-6">
                      {application.title && (
                        <h3 className="text-xl font-semibold text-navy-deep mb-3">{application.title}</h3>
                      )}
                      {application.description && (
                        <p className="text-gray-dark mb-4">{application.description}</p>
                      )}

                      {application.features && application.features.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-navy-deep mb-2">
                            {solution.slug === 'industrial' ? 'Aplicações:' : 'Recursos:'}
                          </h4>
                          <ul className="space-y-1">
                            {application.features.map((feature, idx) => (
                              <li key={idx} className="text-sm text-gray-dark flex items-center gap-2">
                                <LucideIcons.CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {application.results && application.results.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-navy-deep mb-2">Resultados:</h4>
                          <ul className="space-y-1">
                            {application.results.map((result, idx) => (
                              <li key={idx} className="text-sm text-gray-dark flex items-center gap-2">
                                <LucideIcons.Star className="w-3 h-3 text-yellow-500 flex-shrink-0" />
                                {result}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Drones Section */}
        {solution.drones && solution.drones.length > 0 && (
          <section className="py-20 bg-white">
            <div className="container-custom">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-navy-deep mb-4">
                  Drones Ideais para {solution.name}
                </h2>
                <p className="text-xl text-gray-dark max-w-3xl mx-auto">
                  Cada drone tem características específicas para diferentes tipos de projetos
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {solution.drones.map((drone, index) => (
                  <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="relative h-48 bg-gray-100">
                      {drone.image && (
                        <img
                          src={drone.image}
                          alt={drone.name || ''}
                          className="w-full h-full object-cover"
                        />
                      )}
                      {drone.variant && (
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                          <span className="text-sm font-semibold text-navy-deep">{drone.variant}</span>
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      {drone.name && (
                        <h3 className="text-xl font-semibold text-navy-deep mb-2">{drone.name}</h3>
                      )}
                      {drone.bestFor && (
                        <p className="text-sm text-gray-600 mb-4">{drone.bestFor}</p>
                      )}

                      {drone.features && drone.features.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-navy-deep mb-2">Características:</h4>
                          <ul className="space-y-1">
                            {drone.features.map((feature, idx) => (
                              <li key={idx} className="text-sm text-gray-dark flex items-center gap-2">
                                <LucideIcons.CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {drone.applications && drone.applications.length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-sm font-semibold text-navy-deep mb-2">Aplicações:</h4>
                          <ul className="space-y-1">
                            {drone.applications.map((app, idx) => {
                              const TargetIcon = getIconComponent('Target');
                              return (
                                <li key={idx} className="text-sm text-gray-dark flex items-center gap-2">
                                  {TargetIcon && <TargetIcon className={`w-3 h-3 text-${primaryColor}-500 flex-shrink-0`} />}
                                  {app}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}

                      {drone.name && (
                        <Button asChild className="w-full">
                          <Link to={`/produtos/${drone.name.toLowerCase().replace(/\s+/g, '-')}`}>
                            Ver Detalhes
                          </Link>
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Use Cases Section */}
        {solution.use_cases && solution.use_cases.length > 0 && (() => {
          const useCases = solution.use_cases.length > 0 && typeof solution.use_cases[0] === 'string'
            ? (solution.use_cases as string[]).map((uc, idx) => ({ title: '', description: uc, icon: '', benefits: [] }))
            : solution.use_cases as UseCase[];
          
          // Check if use cases have images (like Construção) or icons (like Industrial)
          const hasImages = useCases.some(uc => uc.image);
          const bgClass = hasImages ? 'bg-white' : 'bg-gray-50';
          const gridCols = hasImages ? 'lg:grid-cols-2' : 'md:grid-cols-2';
          const gapClass = hasImages ? 'gap-12' : 'gap-8';

          return (
            <section className={`py-20 ${bgClass}`}>
              <div className="container-custom">
                <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-heading font-bold text-navy-deep mb-4">
                    Casos de Uso em {solution.name}
                  </h2>
                  <p className="text-xl text-gray-dark max-w-3xl mx-auto">
                    {hasImages 
                      ? 'Aplicações práticas que transformam a gestão de projetos'
                      : 'Aplicações práticas que transformam operações'}
                  </p>
                </div>

                <div className={`grid grid-cols-1 ${gridCols} ${gapClass}`}>
                  {useCases.map((useCase, index) => {
                    // Render with image if available (like Construção)
                    if (useCase.image) {
                      return (
                        <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                          <div className="relative h-48">
                            <img
                              src={useCase.image}
                              alt={useCase.title || ''}
                              className={`w-full h-full object-cover ${useCase.alignTop ? 'object-top' : ''}`}
                            />
                          </div>
                          
                          <div className="p-6">
                            {useCase.title && (
                              <h3 className="text-xl font-semibold text-navy-deep mb-3">{useCase.title}</h3>
                            )}
                            {useCase.description && (
                              <p className="text-gray-dark mb-4">{useCase.description}</p>
                            )}
                            
                            {(useCase.results && useCase.results.length > 0) && (
                              <div>
                                <h4 className="text-sm font-semibold text-navy-deep mb-2">Resultados:</h4>
                                <ul className="space-y-1">
                                  {useCase.results.map((result, idx) => (
                                    <li key={idx} className="text-sm text-gray-dark flex items-center gap-2">
                                      <LucideIcons.Star className="w-3 h-3 text-yellow-500 flex-shrink-0" />
                                      {result}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </Card>
                      );
                    }

                    // Render with icon if available (like Industrial)
                    const UseCaseIcon = useCase.icon ? getIconComponent(useCase.icon) : null;
                    const iconBgClass = `bg-${primaryColor}-100`;
                    const iconColorClass = `text-${primaryColor}-600`;

                    return (
                      <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-start gap-4">
                          {UseCaseIcon && (
                            <div className={`w-12 h-12 ${iconBgClass} rounded-full flex items-center justify-center flex-shrink-0`}>
                              <UseCaseIcon className={`w-6 h-6 ${iconColorClass}`} />
                            </div>
                          )}
                          <div className="flex-1">
                            {useCase.title && (
                              <h3 className="text-xl font-semibold text-navy-deep mb-2">{useCase.title}</h3>
                            )}
                            {useCase.description && (
                              <p className="text-gray-dark mb-4">{useCase.description}</p>
                            )}

                            {useCase.benefits && useCase.benefits.length > 0 && (
                              <div>
                                <h4 className="text-sm font-semibold text-navy-deep mb-2">Benefícios:</h4>
                                <ul className="space-y-1">
                                  {useCase.benefits.map((benefit, idx) => (
                                    <li key={idx} className="text-sm text-gray-dark flex items-center gap-2">
                                      <LucideIcons.Star className="w-3 h-3 text-yellow-500 flex-shrink-0" />
                                      {benefit}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </section>
          );
        })()}
      </main>

      <Footer />
      <MobileFloatingCTA />
    </div>
  );
};

export default SolutionPage;
