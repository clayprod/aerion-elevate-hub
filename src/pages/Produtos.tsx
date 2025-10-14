import Header from "@/components/Header";
import Footer from "@/components/Footer";
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
    image: "/images/products/evo-lite-640t-white.jpg"
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
    image: "/images/products/evo-max-4t-white.jpg"
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
    image: "/images/products/autel-alpha-white.jpg"
  },
];

const Produtos = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-28 pb-20">
        <div className="container-custom">
          {/* Page Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-navy-deep mb-4">
              Produtos Autel para Sua Operação
            </h1>
            <p className="text-lg md:text-xl text-gray-dark max-w-3xl mx-auto">
              Tecnologia de ponta que transforma operações enterprise em resultados mensuráveis
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 gap-12 max-w-5xl mx-auto">
            {products.map((product, index) => (
              <Card
                key={product.id}
                className="group hover:shadow-xl transition-all duration-300 overflow-hidden animate-fade-in bg-white border-2"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="md:flex">
                  {/* Content */}
                  <div className="md:w-2/3 p-8 md:p-12">
                    <div className="mb-6">
                      <h2 className="text-3xl font-heading font-bold text-navy-deep mb-2 group-hover:text-blue-medium transition-colors">
                        {product.name}
                      </h2>
                      <p className="text-base font-heading font-semibold text-blue-medium">
                        {product.tagline}
                      </p>
                    </div>

                    <p className="text-gray-dark mb-6 leading-relaxed text-lg">
                      {product.description}
                    </p>

                    <div className="mb-8">
                      <h3 className="font-heading font-bold text-navy-deep mb-3">
                        Especificações Principais:
                      </h3>
                      <ul className="space-y-2">
                        {product.keySpecs.map((spec) => (
                          <li key={spec} className="flex items-start text-gray-dark">
                            <svg className="w-5 h-5 mr-2 flex-shrink-0 text-aerion-blue mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {spec}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mb-8">
                      <h3 className="font-heading font-bold text-navy-deep mb-3">
                        Aplicações:
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {product.applications.map((app) => (
                          <span
                            key={app}
                            className="px-3 py-1 bg-aerion-blue/10 text-aerion-blue rounded-full text-sm font-heading font-semibold"
                          >
                            {app}
                          </span>
                        ))}
                      </div>
                    </div>

                    <Button
                      asChild
                      size="lg"
                      className="bg-action hover:bg-action/90 text-action-foreground font-heading font-semibold group"
                    >
                      <Link to={`/produtos/${product.id}`} className="flex items-center">
                        Ver Especificações Completas
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>

                  {/* Product Image */}
                  <div className="md:w-1/3 bg-gradient-accent p-8 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-48 h-48 mx-auto mb-4 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback to icon if image fails to load
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling!.style.display = 'flex';
                          }}
                        />
                        <div className="w-full h-full hidden items-center justify-center">
                          <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 3L2 12h3v8h14v-8h3L12 3zm0 2.5L18.5 12H17v6h-4v-4h-2v4H7v-6H5.5L12 5.5z"/>
                          </svg>
                        </div>
                      </div>
                      <p className="font-heading font-bold text-xl text-white">
                        {product.name.split(' ')[0]}
                      </p>
                      <p className="text-white/80 text-sm">
                        Tecnologia Autel
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center p-12 bg-gradient-primary rounded-2xl">
            <h3 className="text-3xl font-heading font-bold text-white mb-4">
              Não sabe qual produto escolher?
            </h3>
            <p className="text-white/90 text-lg mb-6 max-w-2xl mx-auto">
              Nossa equipe de especialistas pode ajudá-lo a encontrar a solução perfeita para suas necessidades
            </p>
            <Button
              asChild
              size="lg"
              className="bg-white text-aerion-blue hover:bg-white/90 font-heading font-semibold"
            >
              <Link to="/contato">
                Falar com Especialista
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Produtos;
