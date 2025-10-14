import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, Factory, Shield, Siren, ArrowRight } from "lucide-react";

const solutions = [
  {
    id: "construcao",
    icon: Building,
    title: "Construção e Topografia",
    tagline: "Agilidade e precisão em obras e mapeamento",
    description: "Transforme suas obras com tecnologia aérea de ponta. Levantamentos topográficos com precisão centimétrica, modelagem BIM, mapeamento urbano para planejamento territorial e medição de volumes com eficiência incomparável.",
    needs: [
      "Levantamentos topográficos precisos",
      "Modelagem BIM para cronogramas",
      "Mapeamento urbano e planejamento territorial",
      "Medição de volumes de terra",
      "Cadastro urbano e regularização fundiária",
      "Integração com software de projeto",
    ],
    color: "text-aerion-blue",
    bg: "bg-aerion-blue",
  },
  {
    id: "industrial",
    icon: Factory,
    title: "Inspeção Industrial e Energia",
    tagline: "Precisão e segurança operacional",
    description: "Maximize a eficiência e segurança das suas instalações. Inspeções térmicas avançadas em energia, óleo & gás, mineração, detecção precoce de hotspots e operações BVLOS que reduzem paradas não planejadas em até 60%.",
    needs: [
      "Inspeção térmica de painéis solares e equipamentos",
      "Monitoramento de oleodutos e gasodutos (óleo & gás)",
      "Inspeção de minas e pilhas de rejeito (mineração)",
      "Inspeção de linhas de transmissão e torres",
      "Detecção de hotspots e manutenção preditiva",
      "Operações BVLOS em ambientes críticos",
    ],
    color: "text-teal",
    bg: "bg-teal",
  },
  {
    id: "seguranca",
    icon: Shield,
    title: "Segurança Pública e Defesa Civil",
    tagline: "Proteção e resposta estratégica",
    description: "Amplie suas capacidades operacionais com tecnologia de vigilância avançada. Visão 360°, patrulha inteligente, gestão de tráfego urbano e resposta rápida a emergências com visão noturna de última geração.",
    needs: [
      "Vigilância de áreas extensas 24/7",
      "Patrulhamento inteligente e tático",
      "Gestão de tráfego e monitoramento viário",
      "Fiscalização de trânsito e infrações",
      "Monitoramento de eventos de massa",
      "Resposta rápida com visão noturna",
    ],
    color: "text-orange-energy",
    bg: "bg-orange-energy",
  },
  {
    id: "resgate",
    icon: Siren,
    title: "Resgate e Emergências",
    tagline: "Salvamento e preservação de vidas",
    description: "Salve vidas com tecnologia que não falha. Busca e resgate eficaz, combate a incêndios florestais, localização de vítimas em minutos e avaliação de danos em tempo real, mesmo em áreas remotas.",
    needs: [
      "Busca e resgate de vítimas com térmica",
      "Prevenção e combate a incêndios florestais",
      "Detecção de focos de incêndio em tempo real",
      "Operações em áreas remotas e desastres",
      "Monitoramento ambiental e queimadas",
      "Coordenação de equipes de resgate",
    ],
    color: "text-green-success",
    bg: "bg-green-success",
  },
];

const Solucoes = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-28 pb-20">
        <div className="container-custom">
          {/* Page Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-navy-deep mb-4">
              Soluções Especializadas por Vertical
            </h1>
            <p className="text-lg md:text-xl text-gray-dark max-w-3xl mx-auto">
              Expertise específica para as principais aplicações de tecnologia aérea enterprise
            </p>
          </div>

          {/* Solutions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {solutions.map((solution, index) => (
              <Card
                key={solution.id}
                className="group hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-aerion-blue/20 overflow-hidden animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Link to={`/solucoes/${solution.id}`}>
                  {/* Header with Icon */}
                  <div className={`${solution.bg} p-8 text-white`}>
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <solution.icon className="w-8 h-8" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-heading font-bold mb-1">
                          {solution.title}
                        </h2>
                        <p className="text-sm font-heading font-semibold text-teal">
                          {solution.tagline}
                        </p>
                      </div>
                    </div>
                    <p className="text-white/90 leading-relaxed">
                      {solution.description}
                    </p>
                  </div>

                  {/* Needs List */}
                  <div className="p-8 bg-white">
                    <h3 className="font-heading font-bold text-navy-deep mb-4">
                      Principais Necessidades:
                    </h3>
                    <ul className="space-y-2 mb-6">
                      {solution.needs.slice(0, 4).map((need) => (
                        <li key={need} className="flex items-start text-sm text-gray-dark">
                          <svg className={`w-5 h-5 mr-2 flex-shrink-0 ${solution.color} mt-0.5`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {need}
                        </li>
                      ))}
                    </ul>

                    <Button
                      className={`w-full ${solution.bg} hover:opacity-90 text-white font-heading font-semibold group`}
                    >
                      <span className="flex items-center justify-center">
                        Explorar Solução
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Button>
                  </div>
                </Link>
              </Card>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center p-12 bg-gradient-primary rounded-2xl">
            <h3 className="text-3xl font-heading font-bold text-white mb-4">
              Sua vertical não está listada?
            </h3>
            <p className="text-white text-lg mb-6 max-w-2xl mx-auto">
              Trabalhamos com diversas aplicações. Entre em contato para discutir sua necessidade específica
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

export default Solucoes;
