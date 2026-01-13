import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileFloatingCTA from "@/components/MobileFloatingCTA";
import { SEOHead } from "@/components/SEO/SEOHead";
import { Breadcrumbs } from "@/components/SEO/Breadcrumbs";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, Factory, Shield, Siren, ArrowRight } from "lucide-react";
import { getKeywordsForRoute } from "@/data/keywords";

interface Solution {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  description: string;
  benefits: string[] | null;
  use_cases: string[] | null;
  image_url: string | null;
  icon: string | null;
  order_index: number | null;
}

// Mapeamento de ícones
const iconMap: Record<string, React.ComponentType<any>> = {
  Building,
  Factory,
  Shield,
  Siren,
};

const Solucoes = () => {
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSolutions();
  }, []);

  const fetchSolutions = async () => {
    try {
      const { data, error } = await supabase
        .from("solutions")
        .select("*")
        .eq("active", true)
        .order("order_index", { ascending: true });

      if (error) throw error;

      setSolutions(data || []);
    } catch (error) {
      console.error("Error fetching solutions:", error);
      // Fallback para soluções hardcoded em caso de erro
      setSolutions([]);
    } finally {
      setLoading(false);
    }
  };

  // Fallback hardcoded caso não haja soluções no banco
  const fallbackSolutions = [
    {
      id: "construcao",
      name: "Construção e Topografia",
      slug: "construcao",
      short_description: "Agilidade e precisão em obras e mapeamento",
      description: "Transforme suas obras com tecnologia aérea de ponta. Levantamentos topográficos com precisão centimétrica, modelagem BIM, mapeamento urbano para planejamento territorial e medição de volumes com eficiência incomparável.",
      benefits: [
        "Levantamentos topográficos precisos",
        "Modelagem BIM para cronogramas",
        "Mapeamento urbano e planejamento territorial",
        "Medição de volumes de terra",
        "Cadastro urbano e regularização fundiária",
        "Integração com software de projeto",
      ],
      use_cases: [],
      image_url: "/images/lifestyle/construction-1.jpeg",
      icon: "Building",
      order_index: 1,
    },
    {
      id: "industrial",
      name: "Inspeção Industrial e Energia",
      slug: "industrial",
      short_description: "Precisão e segurança operacional",
      description: "Maximize a eficiência e segurança das suas instalações. Inspeções térmicas avançadas em energia, óleo & gás, mineração, detecção precoce de hotspots e operações BVLOS que reduzem paradas não planejadas em até 60%.",
      benefits: [
        "Inspeção térmica de painéis solares e equipamentos",
        "Monitoramento de oleodutos e gasodutos (óleo & gás)",
        "Inspeção de minas e pilhas de rejeito (mineração)",
        "Inspeção de linhas de transmissão e torres",
        "Detecção de hotspots e manutenção preditiva",
        "Operações BVLOS em ambientes críticos",
      ],
      use_cases: [],
      image_url: "/images/lifestyle/oil-and-gas-1.jpg",
      icon: "Factory",
      order_index: 2,
    },
    {
      id: "seguranca",
      name: "Segurança Pública e Defesa Civil",
      slug: "seguranca",
      short_description: "Proteção e resposta estratégica",
      description: "Amplie suas capacidades operacionais com tecnologia de vigilância avançada. Visão 360°, patrulha inteligente, gestão de tráfego urbano e resposta rápida a emergências com visão noturna de última geração.",
      benefits: [
        "Vigilância de áreas extensas 24/7",
        "Patrulhamento inteligente e tático",
        "Gestão de tráfego e monitoramento viário",
        "Fiscalização de trânsito e infrações",
        "Monitoramento de eventos de massa",
        "Resposta rápida com visão noturna",
      ],
      use_cases: [],
      image_url: "/images/lifestyle/public-safety-1-alpha.jpg",
      icon: "Shield",
      order_index: 3,
    },
    {
      id: "resgate",
      name: "Resgate e Emergências",
      slug: "resgate",
      short_description: "Salvamento e preservação de vidas",
      description: "Salve vidas com tecnologia que não falha. Busca e resgate eficaz, combate a incêndios florestais, localização de vítimas em minutos e avaliação de danos em tempo real, mesmo em áreas remotas.",
      benefits: [
        "Busca e resgate de vítimas com térmica",
        "Prevenção e combate a incêndios florestais",
        "Detecção de focos de incêndio em tempo real",
        "Operações em áreas remotas e desastres",
        "Monitoramento ambiental e queimadas",
        "Coordenação de equipes de resgate",
      ],
      use_cases: [],
      image_url: "/images/lifestyle/rescue-2.jpg",
      icon: "Siren",
      order_index: 4,
    },
  ];

  const displaySolutions = solutions.length > 0 ? solutions : fallbackSolutions;

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Soluções em Drones | Aplicações Enterprise por Vertical"
        description="Soluções especializadas em drones para Construção e Topografia, Inspeção Industrial, Segurança Pública e Resgate. Tecnologia aérea de ponta para transformar suas operações."
        keywords={getKeywordsForRoute('/solucoes')}
        canonical="https://aerion.com.br/solucoes"
        ogType="website"
      />
      <Header />
      
      <main className="pt-28 pb-20">
        <Breadcrumbs />
        <div className="container-custom">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-navy-deep mb-4">
              Soluções Especializadas por Vertical
            </h1>
            <p className="text-lg md:text-xl text-gray-dark max-w-3xl mx-auto">
              Expertise específica para as principais aplicações de tecnologia aérea enterprise
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Carregando soluções...</p>
            </div>
          ) : (
            /* Solutions Grid */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {displaySolutions.map((solution, index) => {
                const IconComponent = solution.icon ? iconMap[solution.icon] : null;
                const needs = solution.benefits || [];
                
                return (
                  <Card
                    key={solution.id}
                    className="group hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-blue-medium/20 overflow-hidden animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <Link to={`/solucoes/${solution.slug}`} className="block">
                      {/* Background Image with Overlay */}
                      <div className="relative h-64 overflow-hidden">
                        <img
                          src={solution.image_url || "/images/placeholder-solution.png"}
                          alt={solution.name}
                          width={600}
                          height={256}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          style={{ aspectRatio: '600 / 256' }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        
                        {/* Title and Tagline Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <h2 className="text-2xl font-heading font-bold text-white mb-2">
                            {solution.name}
                          </h2>
                          {solution.short_description && (
                            <p className="text-white/90 text-sm font-medium">
                              {solution.short_description}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {/* Content Section */}
                      <div className="p-6">
                        <p className="text-gray-dark leading-relaxed mb-6">
                          {solution.description}
                        </p>
                        
                        {/* Key Applications */}
                        {needs.length > 0 && (
                          <div className="mb-6">
                            <h4 className="text-sm font-heading font-semibold text-navy-deep mb-3 uppercase tracking-wide">
                              Principais Aplicações
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {needs.slice(0, 4).map((need, needIndex) => (
                                <div key={needIndex} className="flex items-start space-x-2">
                                  <div className="w-1.5 h-1.5 bg-blue-medium rounded-full mt-2 flex-shrink-0" />
                                  <span className="text-sm text-gray-dark leading-relaxed">
                                    {need}
                                  </span>
                                </div>
                              ))}
                            </div>
                            {needs.length > 4 && (
                              <p className="text-xs text-gray-medium mt-2">
                                +{needs.length - 4} outras aplicações
                              </p>
                            )}
                          </div>
                        )}
                        
                        {/* CTA */}
                        <div className="flex items-center justify-between">
                          <div className="inline-flex items-center font-heading font-semibold text-blue-medium group-hover:translate-x-2 transition-transform">
                            Saiba mais
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </div>
                          <div className="text-xs text-gray-medium">
                            Solução completa
                          </div>
                        </div>
                      </div>
                    </Link>
                  </Card>
                );
              })}
            </div>
          )}

        </div>
      </main>

      <Footer />
      <MobileFloatingCTA />
    </div>
  );
};

export default Solucoes;
