import { Card } from "@/components/ui/card";
import { Rocket, DollarSign, HeadphonesIcon } from "lucide-react";

const differentials = [
  {
    icon: Rocket,
    title: "Tecnologia de Ponta",
    description: "Drones Autel com tecnologia digna de um dos líderes globais, oferecendo desempenho excepcional em aplicações enterprise",
    features: [
      "Anti-interferência superior",
      "Navegação visual de alta precisão",
      "Sistema A-Mesh para colaboração",
      "Reconhecimento de alvos por IA",
    ],
  },
  {
    icon: DollarSign,
    title: "Custo-Benefício Superior",
    description: "Investimento estratégico que se paga rapidamente através de eficiência operacional e redução significativa de custos",
    features: [
      "ROI mensurável em meses",
      "Redução de custos operacionais",
      "Menor necessidade de presença física",
      "Autonomia e eficiência energética",
    ],
  },
  {
    icon: HeadphonesIcon,
    title: "Suporte Integral",
    description: "Suporte técnico especializado local, treinamento completo e acompanhamento pós-venda diferenciado",
    features: [
      "Especialistas brasileiros",
      "Treinamento personalizado",
      "Suporte técnico local",
      "Acompanhamento contínuo",
    ],
  },
];

const WhyAerionSection = () => {
  return (
    <section className="py-12 md:py-16 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-dark rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-medium rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-navy-deep mb-2">
            Por Que Escolher Aerion?
          </h2>
          <p className="text-lg md:text-xl text-gray-dark max-w-3xl mx-auto">
            Muito mais que distribuidora: seu parceiro estratégico em tecnologia aérea
          </p>
        </div>

        {/* Differentials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {differentials.map((item, index) => (
            <Card
              key={item.title}
              className="p-8 hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-blue-medium/20 animate-fade-in bg-white"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-dark to-blue-medium flex items-center justify-center mb-6 shadow-glow">
                <item.icon className="w-8 h-8 text-white" />
              </div>

              {/* Title */}
              <h3 className="text-2xl font-heading font-bold text-navy-deep mb-4">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-gray-dark mb-6 leading-relaxed">
                {item.description}
              </p>

              {/* Features */}
              <ul className="space-y-3">
                {item.features.map((feature) => (
                  <li key={feature} className="flex items-start text-sm text-gray-dark">
                    <svg className="w-5 h-5 mr-2 flex-shrink-0 text-blue-medium mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
};

export default WhyAerionSection;
