import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const products = [
  {
    name: "EVO Lite Enterprise",
    tagline: "Compacto, Portátil, Eficiente",
    description: "Drone compacto e portátil para levantamentos rápidos e eficientes",
    specs: [
      "Autonomia: 42 minutos",
      "Câmera: 4K com zoom 30x",
      "Peso: 1.25kg",
      "Variantes: 640T e 6K",
    ],
    link: "/produtos/evo-lite-enterprise",
    image: "/images/products/evo-lite-640t-white.jpg"
  },
  {
    name: "EVO Max V2",
    tagline: "Precisão e Potência",
    description: "O drone de inspeção que paga seu investimento em 6 meses",
    specs: [
      "Zoom óptico: 30x",
      "Câmera térmica integrada",
      "Autonomia: 42 minutos",
      "Variantes: 4N e 4T",
    ],
    link: "/produtos/evo-max-v2",
    image: "/images/products/evo-max-4t-white.jpg"
  },
  {
    name: "Autel Alpha",
    tagline: "Resistência e Alcance",
    description: "Para operações críticas em condições extremas",
    specs: [
      "Alcance: 21km",
      "Resistente a intempéries (IP55)",
      "Câmera térmica 640T",
      "Autonomia: 45 minutos",
    ],
    link: "/produtos/autel-alpha",
    image: "/images/products/autel-alpha-white.jpg"
  },
];

const ProductsSection = () => {
  return (
    <section className="py-20 md:py-28 bg-gray-light/30">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-navy-deep mb-4">
            Conheça os Produtos Autel
          </h2>
          <p className="text-lg md:text-xl text-gray-dark max-w-3xl mx-auto">
            Tecnologia de ponta que transforma operações enterprise em resultados mensuráveis
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {products.map((product, index) => (
            <Card
              key={product.name}
              className="group hover:shadow-xl transition-all duration-300 overflow-hidden animate-fade-in bg-white"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Product Image */}
              <div className="h-48 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
              </div>
              
              <div className="p-8">
                {/* Product Name & Tagline */}
                <div className="mb-6">
                  <h3 className="text-2xl font-heading font-bold text-navy-deep mb-2 group-hover:text-aerion-blue transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm font-heading font-semibold text-teal">
                    {product.tagline}
                  </p>
                </div>

                {/* Description */}
                <p className="text-gray-dark mb-6 leading-relaxed">
                  {product.description}
                </p>

                {/* Specs */}
                <ul className="space-y-2 mb-8">
                  {product.specs.map((spec) => (
                    <li key={spec} className="flex items-start text-sm text-gray-dark">
                      <svg className="w-5 h-5 mr-2 flex-shrink-0 text-aerion-blue mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {spec}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button
                  asChild
                  className="w-full bg-primary hover:bg-primary/90 text-white font-heading font-semibold group"
                >
                  <Link to={product.link} className="flex items-center justify-center">
                    Ver Detalhes
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>

              {/* Bottom Accent */}
              <div className="h-1 bg-gradient-accent" />
            </Card>
          ))}
        </div>

        {/* View All Products CTA */}
        <div className="text-center">
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-2 border-aerion-blue text-aerion-blue hover:bg-aerion-blue hover:text-white font-heading font-semibold"
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
