import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Building, Factory, Shield, Siren } from "lucide-react";

const solutions = [
  {
    title: "Segurança Pública",
    description: "Patrulhamento, busca e resgate, monitoramento de eventos",
    image: "/images/lifestyle/public-safety-1-alpha.jpg",
    link: "/solucoes/seguranca",
  },
  {
    title: "Inspeção Industrial",
    description: "Verificação de equipamentos, monitoramento de infraestrutura",
    image: "/images/lifestyle/oil-and-gas-1.jpg",
    link: "/solucoes/industrial",
  },
  {
    title: "Construção Civil",
    description: "Mapeamento de obras, monitoramento de progresso",
    image: "/images/lifestyle/construction-1.jpeg",
    link: "/solucoes/construcao",
  },
  {
    title: "Resgate e Emergências",
    description: "Operações de resgate, busca de pessoas, resposta a emergências",
    image: "/images/lifestyle/rescue-2.jpg",
    link: "/solucoes/resgate",
  },
];

const SolutionsSection = () => {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-navy-deep mb-4">
            Soluções para Cada Segmento
          </h2>
          <p className="text-lg md:text-xl text-gray-dark max-w-3xl mx-auto">
            Descubra como nossa tecnologia pode transformar suas operações em diferentes setores e aplicações
          </p>
        </div>

        {/* Solutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {solutions.map((solution, index) => (
            <Card
              key={solution.title}
              className="group hover:shadow-xl transition-all duration-300 overflow-hidden animate-fade-in flex flex-col h-full"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Link to={solution.link} className="block flex flex-col h-full">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={solution.image}
                    alt={solution.title}
                    width={600}
                    height={256}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    style={{ aspectRatio: '600 / 256' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white text-lg font-semibold mb-2">
                      {solution.title}
                    </h3>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <p className="text-gray-dark leading-relaxed mb-4 flex-grow">
                    {solution.description}
                  </p>
                  <div className="inline-flex items-center font-heading font-semibold text-blue-medium group-hover:translate-x-2 transition-transform">
                    Saiba mais
                    <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SolutionsSection;
