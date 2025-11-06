import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileFloatingCTA from '@/components/MobileFloatingCTA';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Siren, 
  Heart, 
  Flame, 
  MapPin, 
  Thermometer, 
  Eye,
  ArrowRight,
  CheckCircle,
  Star,
  Users,
  Award,
  Target,
  Clock
} from 'lucide-react';

const ResgateEmergencias = () => {
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
        "Busca de vítimas com térmica",
        "Resgate em áreas urbanas",
        "Monitoramento de incêndios",
        "Operações de emergência"
      ],
      bestFor: "Resgates urbanos e emergências"
    },
    {
      name: "EVO Max V2",
      variant: "4N",
      image: "/images/products/evo_max/4n/1.png",
      features: [
        "Visão noturna Starlight",
        "Zoom digital 8x",
        "Alcance de até 15km (FCC) ou 8km (SRRC/CE)",
        "Operações BVLOS"
      ],
      applications: [
        "Busca em áreas extensas",
        "Resgate noturno",
        "Combate a incêndios",
        "Operações remotas"
      ],
      bestFor: "Operações noturnas e áreas remotas"
    },
    {
      name: "Autel Alpha",
      variant: "Industrial",
      image: "/images/products/alpha/1.png",
      features: [
        "Zoom híbrido 560x",
        "Telêmetro laser 2000m",
        "Sistema dual-térmico",
        "RTK milimétrico"
      ],
      applications: [
        "Busca de longo alcance",
        "Resgate em desastres",
        "Monitoramento de fronteiras",
        "Operações complexas"
      ],
      bestFor: "Missões críticas e de longo alcance"
    }
  ];

  const benefits = [
    {
      icon: Clock,
      title: "Resposta Rápida",
      description: "Chegada em minutos a qualquer local de emergência"
    },
    {
      icon: Thermometer,
      title: "Detecção Térmica",
      description: "Localização de vítimas mesmo em condições adversas"
    },
    {
      icon: Eye,
      title: "Visão Noturna",
      description: "Operações 24/7 com tecnologia Starlight"
    },
    {
      icon: Heart,
      title: "Salvamento",
      description: "Tecnologia que salva vidas em situações críticas"
    }
  ];

  const applications = [
    {
      title: "Busca e Resgate de Vítimas",
      description: "Localização eficiente de pessoas desaparecidas com câmera térmica",
      image: "/images/solucoes/resgate-emergencias/busca-resgate-vitimas.jpg",
      features: [
        "Detecção térmica de vítimas",
        "Busca em áreas extensas",
        "Operação noturna",
        "Comunicação com equipes"
      ],
      results: ["Localização 5x mais rápida", "Sucesso em 90% dos casos", "Operação segura"]
    },
    {
      title: "Combate a Incêndios Florestais",
      description: "Prevenção e combate eficaz a incêndios com detecção precoce",
      image: "/images/solucoes/resgate-emergencias/combate-incendios-florestais.jpg",
      features: [
        "Detecção de focos de incêndio",
        "Monitoramento de propagação",
        "Coordenação de equipes",
        "Mapeamento de áreas afetadas"
      ],
      results: ["Detecção precoce", "Redução de 50% em danos", "Coordenação eficiente"]
    },
    {
      title: "Resposta a Desastres",
      description: "Avaliação rápida de danos e coordenação de resgate",
      image: "/images/solucoes/resgate-emergencias/resposta-desastres.jpg",
      features: [
        "Avaliação de danos",
        "Mapeamento de áreas afetadas",
        "Localização de vítimas",
        "Coordenação de resgate"
      ],
      results: ["Avaliação em tempo real", "Resposta coordenada", "Redução de riscos"]
    },
    {
      title: "Monitoramento Ambiental",
      description: "Prevenção de queimadas e monitoramento de áreas de risco",
      image: "/images/solucoes/resgate-emergencias/monitoramento-ambiental.jpg",
      features: [
        "Monitoramento de queimadas",
        "Detecção de focos",
        "Mapeamento de áreas de risco",
        "Alertas preventivos"
      ],
      results: ["Prevenção eficaz", "Redução de incêndios", "Proteção ambiental"]
    }
  ];

  const useCases = [
    {
      title: "Busca de Pessoas Desaparecidas",
      description: "Localização eficiente de vítimas em áreas extensas e remotas",
      icon: Heart,
      benefits: ["Localização 5x mais rápida", "Operação segura para equipes", "Cobertura noturna com térmica"]
    },
    {
      title: "Combate a Incêndios",
      description: "Prevenção e combate eficaz a incêndios florestais",
      icon: Flame,
      benefits: ["Detecção precoce de focos", "Redução de 50% em danos", "Coordenação eficiente"]
    },
    {
      title: "Resposta a Desastres",
      description: "Avaliação rápida de danos e coordenação de resgate",
      icon: Siren,
      benefits: ["Avaliação em tempo real", "Resposta coordenada", "Redução de riscos"]
    },
    {
      title: "Monitoramento Ambiental",
      description: "Prevenção de queimadas e proteção de áreas naturais",
      icon: MapPin,
      benefits: ["Prevenção eficaz", "Redução de incêndios", "Proteção ambiental"]
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-28 pb-20">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-red-50 to-white">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <Siren className="w-4 h-4" />
                  Resgate e Emergências
                </div>
                <h1 className="text-4xl md:text-5xl font-heading font-bold text-navy-deep mb-6">
                  Salvamento e Preservação de Vidas
                </h1>
                <p className="text-xl text-gray-dark leading-relaxed mb-8">
                  Salve vidas com tecnologia que não falha. Busca e resgate eficaz, combate a incêndios florestais, 
                  localização de vítimas em minutos e avaliação de danos em tempo real, mesmo em áreas remotas.
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
                  src="/images/lifestyle/rescue-2.jpg"
                  alt="Resgate e Emergências com Drones"
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
                Por que drones para resgate e emergências?
              </h2>
              <p className="text-xl text-gray-dark max-w-3xl mx-auto">
                Tecnologia que salva vidas em situações críticas
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-navy-deep mb-3">{benefit.title}</h3>
                  <p className="text-gray-dark">{benefit.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Applications Section */}
        <section className="py-20 bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-navy-deep mb-4">
                Aplicações em Resgate e Emergências
              </h2>
              <p className="text-xl text-gray-dark max-w-3xl mx-auto">
                Soluções especializadas para diferentes tipos de emergências
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {applications.map((application, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="relative h-48">
                    <img
                      src={application.image}
                      alt={application.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-navy-deep mb-3">{application.title}</h3>
                    <p className="text-gray-dark mb-4">{application.description}</p>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-navy-deep mb-2">Recursos:</h4>
                      <ul className="space-y-1">
                        {application.features.map((feature, idx) => (
                          <li key={idx} className="text-sm text-gray-dark flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-semibold text-navy-deep mb-2">Resultados:</h4>
                      <ul className="space-y-1">
                        {application.results.map((result, idx) => (
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

        {/* Drones Section */}
        <section className="py-20 bg-white">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-navy-deep mb-4">
                Drones Ideais para Resgate e Emergências
              </h2>
              <p className="text-xl text-gray-dark max-w-3xl mx-auto">
                Cada drone tem características específicas para diferentes tipos de emergência
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
                            <Target className="w-3 h-3 text-red-500 flex-shrink-0" />
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
        <section className="py-20 bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-navy-deep mb-4">
                Casos de Uso em Resgate e Emergências
              </h2>
              <p className="text-xl text-gray-dark max-w-3xl mx-auto">
                Aplicações práticas que salvam vidas em situações críticas
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {useCases.map((useCase, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <useCase.icon className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-navy-deep mb-2">{useCase.title}</h3>
                      <p className="text-gray-dark mb-4">{useCase.description}</p>
                      
                      <div>
                        <h4 className="text-sm font-semibold text-navy-deep mb-2">Benefícios:</h4>
                        <ul className="space-y-1">
                          {useCase.benefits.map((benefit, idx) => (
                            <li key={idx} className="text-sm text-gray-dark flex items-center gap-2">
                              <Star className="w-3 h-3 text-yellow-500 flex-shrink-0" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
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

export default ResgateEmergencias;
