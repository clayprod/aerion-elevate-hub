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
import { AutelLogo } from "@/components/AutelLogo";
import { ArrowRight } from "lucide-react";

interface Product {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  description: string;
  features: string[] | null;
  image_url: string | null;
  order_index: number | null;
}

const Produtos = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("active", true)
        .order("order_index", { ascending: true });

      if (error) throw error;

      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      // Fallback para produtos hardcoded em caso de erro
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Fallback hardcoded caso não haja produtos no banco
  const fallbackProducts = [
    {
      id: "evo-lite-enterprise",
      name: "EVO Lite Enterprise",
      slug: "evo-lite-enterprise",
      short_description: "Compacto, Portátil, Eficiente",
      description: "Plataforma compacta oferecida em duas configurações dedicadas: 640T (câmera térmica 640×512 + sensor visível 48 MP) ou 6K (sensor 1\" de 20 MP). Garante 40 minutos de voo, transmissão até 12 km (FCC) / 6 km (CE) e detecção tridirecional até 30 m para inspeções ágeis e missões de segurança.",
      features: [
        "Configurações 640T (térmica + visível) ou 6K (sensor 1\" 20 MP)",
        "Autonomia de 40 min e resistência a ventos de 10.7 m/s",
        "Transmissão até 12 km (FCC) / 6 km (CE)",
        "Detecção tridirecional 0.2-30 m com GNSS GPS/BDS/GLONASS",
      ],
      image_url: "/images/products/evo_lite/640t/1.png",
      order_index: 1,
    },
    {
      id: "evo-max-v2",
      name: "EVO Max V2",
      slug: "evo-max-v2",
      short_description: "Precisão e Potência em Um Só Drone",
      description: "Sistema de câmeras triplas com navegação Autonomy Engine e SLAM 3D que dispensa georreferenciamento e garante voo seguro em ambientes complexos. A versão 4N combina visão térmica 640×512 + Starlight, enquanto a 4T traz zoom óptico 2.7-10x com híbrido até 160x.",
      features: [
        "Navegação SLAM + autonomia de voo sem GNSS (Autonomy Engine)",
        "Câmeras triplas: 4N (Visível + Térmica + Starlight) / 4T (Visível + Térmica + Zoom)",
        "Transmissão até 15 km (FCC) / 8 km (SRRC/CE)",
        "Autonomia de 42 min e resistência IP43 com detecção 720°",
      ],
      image_url: "/images/products/evo_max/4t/1.png",
      order_index: 2,
    },
    {
      id: "autel-alpha",
      name: "Autel Alpha",
      slug: "autel-alpha",
      short_description: "Resistência e Alcance para Operações Críticas",
      description: "Drone industrial IP55 com gimbal DG-L35T quíntuplo (duas térmicas, câmera wide, zoom óptico 35x e laser). Oferece 40 minutos de voo, alcance de até 30 km, navegação Autonomy Engine com sensores 360° + radar 60G/24G e baterias hot swap.",
      features: [
        "Gimbal DG-L35T: zoom óptico 35x, térmicas 13/45 mm e laser 2000 m",
        "Alcance de voo até 30 km (carbono) e 40 min de autonomia",
        "Navegação Autonomy Engine com sensores visuais 360° + radar 60G/24G",
        "Smart Controller V3 7.9\" 2000 nits e baterias hot swap LiPo 6S",
      ],
      image_url: "/images/products/alpha/1.png",
      order_index: 3,
    },
    {
      id: "autel-mapper",
      name: "Autel Mapper",
      slug: "autel-mapper",
      short_description: "Mapeamento Profissional com Deep Learning",
      description: "Software profissional de reconstrução 2D e 3D com processamento em nuvem ou local, utilizando deep learning para resultados altamente precisos. Processamento rápido e preciso para mapeamento, topografia e inspeções.",
      features: [
        "Reconstrução 2D e 3D com precisão centimétrica (1:500)",
        "Processamento rápido com algoritmos de deep learning",
        "Suporte para processamento local ou em nuvem",
        "Compatível com drones Autel e múltiplos formatos de saída",
      ],
      image_url: "/images/products/mapper/autel-mapper.png",
      order_index: 4,
    },
  ];

  const displayProducts = products.length > 0 ? products : fallbackProducts;

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Produtos Autel | Drones Profissionais para Operações Enterprise"
        description="Conheça a linha completa de drones Autel profissionais: EVO Lite Enterprise, EVO Max V2, Autel Alpha e Autel Mapper. Tecnologia de ponta para construção, inspeção industrial, segurança pública e resgate."
        keywords="drones Autel, EVO Lite Enterprise, EVO Max V2, Autel Alpha, drones profissionais, drones enterprise, tecnologia aérea, drones Brasil"
        canonical="https://aerion.com.br/produtos"
        ogType="website"
      />
      <Header />
      
      <main className="pt-28 pb-20">
        <Breadcrumbs />
        <div className="container-custom">
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="mb-4">
              <AutelLogo 
                className="h-10 md:h-12 w-auto" 
                textFallback="Produtos Autel para Sua Operação"
              />
            </div>
            <p className="text-lg md:text-xl text-gray-dark max-w-3xl mx-auto">
              Tecnologia de ponta que transforma operações enterprise em resultados mensuráveis
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Carregando produtos...</p>
            </div>
          ) : (
            <>
              {/* Products Grid - Primeiros 3 produtos */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                {displayProducts.slice(0, 3).map((product, index) => (
                  <Card
                    key={product.id}
                    className="group hover:shadow-xl transition-all duration-300 overflow-hidden animate-fade-in bg-white border-2"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <Link to={`/produtos/${product.slug}`} className="block">
                      {/* Product Image */}
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={product.image_url || "/images/placeholder-product.png"}
                          alt={product.name}
                          width={400}
                          height={192}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          style={{ aspectRatio: '400 / 192' }}
                          onError={(e) => {
                            // Fallback to gradient background if image fails to load
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling!.style.display = 'flex';
                          }}
                        />
                        <div className="w-full h-full hidden items-center justify-center bg-gradient-accent">
                          <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 3L2 12h3v8h14v-8h3L12 3zm0 2.5L18.5 12H17v6h-4v-4h-2v4H7v-6H5.5L12 5.5z"/>
                          </svg>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <div className="mb-4">
                          <h2 className="text-xl font-heading font-bold text-navy-deep mb-2 group-hover:text-blue-medium transition-colors">
                            {product.name}
                          </h2>
                          {product.short_description && (
                            <p className="text-sm font-heading font-semibold text-blue-medium">
                              {product.short_description}
                            </p>
                          )}
                        </div>

                        <p className="text-gray-dark mb-4 leading-relaxed text-sm">
                          {product.description}
                        </p>

                        {product.features && product.features.length > 0 && (
                          <div className="mb-4">
                            <h3 className="font-heading font-bold text-navy-deep mb-2 text-sm">
                              Especificações Principais:
                            </h3>
                            <ul className="space-y-1">
                              {product.features.slice(0, 2).map((spec, idx) => (
                                <li key={idx} className="flex items-start text-gray-dark text-xs">
                                  <svg className="w-4 h-4 mr-2 flex-shrink-0 text-blue-medium mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  {spec}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="inline-flex items-center font-heading font-semibold text-blue-medium group-hover:translate-x-2 transition-transform text-sm">
                          Saber mais
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </div>
                      </div>
                    </Link>
                  </Card>
                ))}
              </div>

              {/* Autel Mapper - Linha separada */}
              {displayProducts.slice(3).map((product, index) => (
                <div key={product.id} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div>
                    <Card
                      className="group hover:shadow-xl transition-all duration-300 overflow-hidden animate-fade-in bg-white border-2"
                      style={{ animationDelay: `${(index + 3) * 0.1}s` }}
                    >
                      <Link to={`/produtos/${product.slug}`} className="block">
                        {/* Product Image */}
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={product.image_url || "/images/placeholder-product.png"}
                            alt={product.name}
                            width={400}
                            height={192}
                            loading="lazy"
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                            style={{ aspectRatio: '400 / 192' }}
                            onError={(e) => {
                              // Fallback to gradient background if image fails to load
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling!.style.display = 'flex';
                            }}
                          />
                          <div className="w-full h-full hidden items-center justify-center bg-gradient-accent">
                            <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 3L2 12h3v8h14v-8h3L12 3zm0 2.5L18.5 12H17v6h-4v-4h-2v4H7v-6H5.5L12 5.5z"/>
                            </svg>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          <div className="mb-4">
                            <h2 className="text-xl font-heading font-bold text-navy-deep mb-2 group-hover:text-blue-medium transition-colors">
                              {product.name}
                            </h2>
                            {product.short_description && (
                              <p className="text-sm font-heading font-semibold text-blue-medium">
                                {product.short_description}
                              </p>
                            )}
                          </div>

                          <p className="text-gray-dark mb-4 leading-relaxed text-sm">
                            {product.description}
                          </p>

                          {product.features && product.features.length > 0 && (
                            <div className="mb-4">
                              <h3 className="font-heading font-bold text-navy-deep mb-2 text-sm">
                                Especificações Principais:
                              </h3>
                              <ul className="space-y-1">
                                {product.features.slice(0, 2).map((spec, idx) => (
                                  <li key={idx} className="flex items-start text-gray-dark text-xs">
                                    <svg className="w-4 h-4 mr-2 flex-shrink-0 text-blue-medium mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {spec}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          <div className="inline-flex items-center font-heading font-semibold text-blue-medium group-hover:translate-x-2 transition-transform text-sm">
                            Saber mais
                            <ArrowRight className="ml-1 h-4 w-4" />
                          </div>
                        </div>
                      </Link>
                    </Card>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </main>

      <Footer />
      <MobileFloatingCTA />
    </div>
  );
};

export default Produtos;
