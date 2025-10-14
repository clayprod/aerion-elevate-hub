import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const products = [
  {
    id: "evo-lite-enterprise",
    name: "EVO Lite Enterprise",
    tagline: "Compacto, Portátil, Eficiente",
    description: "Drone compacto e portátil ideal para levantamentos topográficos rápidos, mapeamento de áreas e documentação de obras. Perfeito para quem precisa de agilidade sem comprometer qualidade.",
    keySpecs: [
      "Autonomia de 42 minutos",
      "Câmera 4K com zoom 30x",
      "Peso de apenas 1.25kg",
      "Variantes 640T e 6K",
    ],
    applications: ["Construção", "Topografia", "Mapeamento"],
    link: "/produtos/evo-lite-enterprise",
    image: "/images/products/evo_lite/640t/1.png"
  },
  {
    id: "evo-max-v2",
    name: "EVO Max V2",
    tagline: "Precisão e Potência em Um Só Drone",
    description: "O drone de inspeção profissional com câmera térmica e zoom óptico de 30x. Ideal para inspeções industriais, detecção de hotspots e operações que exigem máxima precisão.",
    keySpecs: [
      "Zoom óptico de 30x",
      "Câmera térmica integrada",
      "Autonomia de 42 minutos",
      "Transmissão de até 15km",
    ],
    applications: ["Industrial", "Energia", "Inspeções"],
    link: "/produtos/evo-max-v2",
    image: "/images/products/evo_max/4t/1.jpg"
  },
  {
    id: "autel-alpha",
    name: "Autel Alpha",
    tagline: "Resistência e Alcance para Operações Críticas",
    description: "Drone robusto projetado para operações em condições extremas. Resistente a intempéries, com sistema A-Mesh para colaboração entre múltiplos drones e alcance estendido.",
    keySpecs: [
      "Alcance de transmissão de 21km",
      "Resistente a chuva e vento (IP55)",
      "Câmera térmica 640T",
      "Autonomia de 45 minutos",
    ],
    applications: ["Segurança", "Resgate", "Operações Críticas"],
    link: "/produtos/autel-alpha",
    image: "/images/products/alpha/1.png"
  },
];

const ProductsSection = () => {
  return (
    <section className="py-20 md:py-28 bg-gray-light/30">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-navy-deep mb-2">
            Conheça os Produtos Autel
          </h2>
          <p className="text-lg md:text-xl text-gray-dark max-w-3xl mx-auto">
            Tecnologia de ponta que transforma operações enterprise em resultados mensuráveis
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {products.map((product, index) => (
            <Card
              key={product.id}
              className="group hover:shadow-xl transition-all duration-300 overflow-hidden animate-fade-in bg-white border-2"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Link to={product.link} className="block">
                {/* Product Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
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
                    <p className="text-sm font-heading font-semibold text-blue-medium">
                      {product.tagline}
                    </p>
                  </div>

                  <p className="text-gray-dark mb-4 leading-relaxed text-sm">
                    {product.description}
                  </p>

                  <div className="mb-4">
                    <h3 className="font-heading font-bold text-navy-deep mb-2 text-sm">
                      Especificações Principais:
                    </h3>
                    <ul className="space-y-1">
                      {product.keySpecs.slice(0, 2).map((spec) => (
                        <li key={spec} className="flex items-start text-gray-dark text-xs">
                          <svg className="w-4 h-4 mr-2 flex-shrink-0 text-blue-medium mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {spec}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h3 className="font-heading font-bold text-navy-deep mb-2 text-sm">
                      Aplicações:
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {product.applications.slice(0, 2).map((app) => (
                        <span
                          key={app}
                          className="px-2 py-1 bg-blue-medium/10 text-blue-medium rounded-full text-xs font-heading font-semibold"
                        >
                          {app}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="inline-flex items-center font-heading font-semibold text-blue-medium group-hover:translate-x-2 transition-transform text-sm">
                    Ver Especificações Completas
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </div>
              </Link>
            </Card>
          ))}
        </div>

        {/* View All Products CTA */}
        <div className="text-center">
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-2 border-blue-medium text-blue-medium hover:bg-blue-medium hover:text-white font-heading font-semibold"
          >
            <Link to="/produtos">
              Ver Todos os Produtos
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
