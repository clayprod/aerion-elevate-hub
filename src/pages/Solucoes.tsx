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
    image: "/images/lifestyle/construction-1.jpeg",
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
    image: "/images/lifestyle/oil-and-gas-1.jpg",
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
    image: "/images/lifestyle/public-safety-1-alpha.jpg",
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
    image: "/images/lifestyle/rescue-2.jpg",
  },
];

const Solucoes = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-28 pb-20">
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

          {/* Solutions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {solutions.map((solution, index) => (
              <Card
                key={solution.id}
                className="group hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-blue-medium/20 overflow-hidden animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Link to={`/solucoes/${solution.id}`} className="block">
                  {/* Background Image with Overlay */}
                  <div className="relative h-96 overflow-hidden">
                    <img
                      src={solution.image}
                      alt={solution.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors" />
                    
                    {/* Title Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h2 className="text-2xl font-heading font-bold text-white mb-2">
                        {solution.title}
                      </h2>
                    </div>
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
              className="bg-white text-blue-medium hover:bg-white/90 font-heading font-semibold"
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
