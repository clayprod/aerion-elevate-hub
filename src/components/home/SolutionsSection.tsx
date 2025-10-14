import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Building, Factory, Shield, Siren } from "lucide-react";

const solutions = [
  {
    icon: Building,
    title: "Construção",
    tagline: "Agilidade e precisão em obras",
    description: "Levantamentos topográficos, modelagem BIM, mapeamento urbano e medição de volumes com eficiência incomparável",
    features: [
      "Topografia com precisão centimétrica",
      "Modelagem BIM para cronogramas",
      "Mapeamento urbano e territorial",
    ],
    color: "text-aerion-blue",
    bg: "bg-aerion-blue/5",
    link: "/solucoes/construcao",
  },
  {
    icon: Factory,
    title: "Industrial",
    tagline: "Precisão e segurança operacional",
    description: "Inspeções térmicas em energia, óleo & gás, mineração e operações BVLOS para máxima eficiência",
    features: [
      "Inspeção térmica avançada",
      "Monitoramento óleo & gás",
      "Inspeção de minas e mineração",
    ],
    color: "text-teal",
    bg: "bg-teal/5",
    link: "/solucoes/industrial",
  },
  {
    icon: Shield,
    title: "Segurança",
    tagline: "Proteção e resposta estratégica",
    description: "Vigilância inteligente, gestão de tráfego urbano e inteligência operacional em tempo real",
    features: [
      "Vigilância 360° contínua",
      "Gestão de tráfego viário",
      "Resposta rápida a emergências",
    ],
    color: "text-orange-energy",
    bg: "bg-orange-energy/5",
    link: "/solucoes/seguranca",
  },
  {
    icon: Siren,
    title: "Resgate",
    tagline: "Salvamento e preservação",
    description: "Busca e resgate, combate a incêndios florestais e preservação ambiental com tecnologia de ponta",
    features: [
      "Busca e resgate eficaz",
      "Combate a incêndios florestais",
      "Monitoramento ambiental",
    ],
    color: "text-green-success",
    bg: "bg-green-success/5",
    link: "/solucoes/resgate",
  },
];

const SolutionsSection = () => {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-navy-deep mb-4">
            Soluções para Cada Segmento
          </h2>
          <p className="text-lg md:text-xl text-gray-dark max-w-3xl mx-auto">
            Expertise especializada para as principais verticais de aplicação de tecnologia aérea
          </p>
        </div>

        {/* Solutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {solutions.map((solution, index) => (
            <Card
              key={solution.title}
              className="group hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-aerion-blue/20 overflow-hidden animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Link to={solution.link} className="block p-8">
                {/* Icon & Header */}
                <div className="flex items-start space-x-4 mb-6">
                  <div className={`w-14 h-14 rounded-xl ${solution.bg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <solution.icon className={`w-7 h-7 ${solution.color}`} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-heading font-bold text-navy-deep mb-1 group-hover:text-aerion-blue transition-colors">
                      {solution.title}
                    </h3>
                    <p className={`text-sm font-heading font-semibold ${solution.color}`}>
                      {solution.tagline}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-dark mb-6 leading-relaxed">
                  {solution.description}
                </p>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {solution.features.map((feature) => (
                    <li key={feature} className="flex items-center text-sm text-gray-dark">
                      <svg className={`w-5 h-5 mr-2 flex-shrink-0 ${solution.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div className={`inline-flex items-center font-heading font-semibold ${solution.color} group-hover:translate-x-2 transition-transform`}>
                  Saiba mais
                  <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
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
