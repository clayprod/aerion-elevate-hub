import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileFloatingCTA from '@/components/MobileFloatingCTA';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Building, 
  Map, 
  Ruler, 
  Camera, 
  Clock, 
  Target,
  ArrowRight,
  CheckCircle,
  Star,
  Users,
  Award
} from 'lucide-react';

const ConstrucaoTopografia = () => {
  const drones = [
    {
      name: "EVO Lite Enterprise",
      variant: "640T",
      image: "/images/products/evo_lite/640t/1.png",
      features: [
        "Carga útil 640T (térmica 640×512) ou 6K (sensor 1\" 20 MP)",
        "Autonomia de até 40 minutos",
        "Transmissão até 12 km (FCC) / 6 km (CE)",
        "Detecção tridirecional 0.2-30 m"
      ],
      applications: [
        "Levantamentos topográficos rápidos",
        "Inspeção térmica de estruturas",
        "Mapeamento de áreas urbanas",
        "Documentação de obras"
      ],
      bestFor: "Projetos de médio porte e inspeções térmicas"
    },
    {
      name: "EVO Max V2",
      variant: "4T",
      image: "/images/products/evo_max/4t/1.png",
      features: [
        "Zoom óptico 10x com alcance 2km",
        "Câmera térmica 640×512",
        "Autonomia de 42 minutos",
        "Alcance de até 15km (FCC) ou 8km (SRRC/CE)"
      ],
      applications: [
        "Levantamentos de grandes áreas",
        "Inspeção detalhada de estruturas",
        "Mapeamento de terrenos complexos",
        "Monitoramento de progresso"
      ],
      bestFor: "Projetos de grande escala e inspeções detalhadas"
    },
    {
      name: "Autel Alpha",
      variant: "Industrial",
      image: "/images/products/alpha/1.png",
      features: [
        "Gimbal DG-L35T (zoom óptico 35x + térmicas 13/45 mm)",
        "Autonomy Engine com sensores 360° + radar 60G/24G",
        "Alcance de voo até 30 km e autonomia de 40 min",
        "RTK integrado e telêmetro laser 2000 m"
      ],
      applications: [
        "Levantamentos de precisão milimétrica",
        "Inspeções de infraestrutura crítica",
        "Mapeamento de áreas remotas",
        "Projetos de engenharia complexos"
      ],
      bestFor: "Projetos de alta precisão e infraestrutura crítica"
    }
  ];

  const benefits = [
    {
      icon: Clock,
      title: "Agilidade",
      description: "Levantamentos 10x mais rápidos que métodos tradicionais"
    },
    {
      icon: Target,
      title: "Precisão",
      description: "Acurácia centimétrica com RTK integrado"
    },
    {
      icon: Camera,
      title: "Documentação",
      description: "Imagens e vídeos 4K para documentação completa"
    },
    {
      icon: Map,
      title: "Modelagem 3D",
      description: "Ortofotos e modelos 3D para projetos BIM"
    }
  ];

  const useCases = [
    {
      title: "Levantamentos Topográficos",
      description: "Mapeamento preciso de terrenos para projetos de engenharia",
      image: "/images/solucoes/casos-uso-construcao/levantamentos-topograficos.jpg",
      results: ["Precisão centimétrica", "Redução de 80% no tempo", "Dados integrados ao BIM"],
      alignTop: false
    },
    {
      title: "Inspeção de Estruturas",
      description: "Verificação térmica e visual de edifícios e pontes",
      image: "/images/solucoes/casos-uso-construcao/inspecao-estruturas.jpg",
      results: ["Detecção de falhas", "Relatórios automatizados", "Manutenção preditiva"],
      alignTop: true
    },
    {
      title: "Mapeamento Urbano",
      description: "Cadastro territorial e planejamento urbano",
      image: "/images/solucoes/casos-uso-construcao/mapeamento-urbano.jpg",
      results: ["Ortofotos atualizadas", "Modelos 3D precisos", "Planejamento otimizado"],
      alignTop: true
    },
    {
      title: "Medição de Volumes",
      description: "Cálculo preciso de volumes de terra e materiais",
      image: "/images/solucoes/casos-uso-construcao/medicao-volumes.jpg",
      results: ["Medições automáticas", "Controle de estoque", "Otimização de custos"],
      alignTop: true
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-28 pb-20">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-blue-50 to-white">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <Building className="w-4 h-4" />
                  Construção e Topografia
                </div>
                <h1 className="text-4xl md:text-5xl font-heading font-bold text-navy-deep mb-6">
                  Agilidade e Precisão em Obras e Mapeamento
                </h1>
                <p className="text-xl text-gray-dark leading-relaxed mb-8">
                  Transforme suas obras com tecnologia aérea de ponta. Levantamentos topográficos com precisão centimétrica, 
                  modelagem BIM, mapeamento urbano e medição de volumes com eficiência incomparável.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg" className="bg-action hover:bg-action/90 text-action-foreground">
                    <Link to="/contato">
                      Solicitar Orçamento
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link to="/produtos">
                      Ver Drones
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="relative">
                <img
                  src="/images/lifestyle/construction-1.jpeg"
                  alt="Construção e Topografia com Drones"
                  className="rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-white">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-navy-deep mb-4">
                Por que escolher drones para construção?
              </h2>
              <p className="text-xl text-gray-dark max-w-3xl mx-auto">
                Tecnologia que revoluciona a forma como você planeja, executa e monitora seus projetos
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-navy-deep mb-3">{benefit.title}</h3>
                  <p className="text-gray-dark">{benefit.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Drones Section */}
        <section className="py-20 bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-navy-deep mb-4">
                Drones Ideais para Construção
              </h2>
              <p className="text-xl text-gray-dark max-w-3xl mx-auto">
                Cada drone tem características específicas para diferentes tipos de projetos
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {drones.map((drone, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="relative h-48 bg-gray-100">
                    <img
                      src={drone.image}
                      alt={drone.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-sm font-semibold text-navy-deep">{drone.variant}</span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-navy-deep mb-2">{drone.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{drone.bestFor}</p>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-navy-deep mb-2">Características:</h4>
                      <ul className="space-y-1">
                        {drone.features.map((feature, idx) => (
                          <li key={idx} className="text-sm text-gray-dark flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-navy-deep mb-2">Aplicações:</h4>
                      <ul className="space-y-1">
                        {drone.applications.map((app, idx) => (
                          <li key={idx} className="text-sm text-gray-dark flex items-center gap-2">
                            <Target className="w-3 h-3 text-blue-500 flex-shrink-0" />
                            {app}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Button asChild className="w-full">
                      <Link to={`/produtos/${drone.name.toLowerCase().replace(/\s+/g, '-')}`}>
                        Ver Detalhes
                      </Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="py-20 bg-white">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-navy-deep mb-4">
                Casos de Uso em Construção
              </h2>
              <p className="text-xl text-gray-dark max-w-3xl mx-auto">
                Aplicações práticas que transformam a gestão de projetos
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {useCases.map((useCase, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    <img
                      src={useCase.image}
                      alt={useCase.title}
                      className={`w-full h-full object-cover ${useCase.alignTop ? 'object-top' : ''}`}
                    />
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-navy-deep mb-3">{useCase.title}</h3>
                    <p className="text-gray-dark mb-4">{useCase.description}</p>
                    
                    <div>
                      <h4 className="text-sm font-semibold text-navy-deep mb-2">Resultados:</h4>
                      <ul className="space-y-1">
                        {useCase.results.map((result, idx) => (
                          <li key={idx} className="text-sm text-gray-dark flex items-center gap-2">
                            <Star className="w-3 h-3 text-yellow-500 flex-shrink-0" />
                            {result}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

      </main>

      <Footer />
      <MobileFloatingCTA />
    </div>
  );
};

export default ConstrucaoTopografia;
