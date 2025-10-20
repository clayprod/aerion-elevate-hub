import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileFloatingCTA from '@/components/MobileFloatingCTA';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Eye, 
  Users, 
  Car, 
  Camera, 
  MapPin,
  ArrowRight,
  CheckCircle,
  Star,
  Award,
  Target,
  Clock
} from 'lucide-react';

const SegurancaPublica = () => {
  const drones = [
    {
      name: "EVO Lite Enterprise",
      variant: "640T",
      image: "/images/products/evo_lite/640t/1.png",
      features: [
        "Câmera térmica 640×512",
        "Autonomia 40 minutos",
        "Alcance 12km",
        "Peso compacto 866g"
      ],
      applications: [
        "Patrulhamento urbano",
        "Busca e resgate",
        "Monitoramento de eventos",
        "Fiscalização de trânsito"
      ],
      bestFor: "Operações urbanas e patrulhamento"
    },
    {
      name: "EVO Max V2",
      variant: "4N",
      image: "/images/products/evo_max/4n/1.png",
      features: [
        "Visão noturna Starlight",
        "Zoom óptico 8x",
        "Alcance 20km",
        "Evitação 720°"
      ],
      applications: [
        "Operações noturnas",
        "Monitoramento 24/7",
        "Busca em áreas extensas",
        "Operações táticas"
      ],
      bestFor: "Operações noturnas e táticas"
    },
    {
      name: "Autel Alpha",
      variant: "Industrial",
      image: "/images/products/alpha/1.png",
      features: [
        "Zoom híbrido 560x",
        "RTK milimétrico",
        "Telêmetro laser 2000m",
        "Sistema dual-térmico"
      ],
      applications: [
        "Operações de longo alcance",
        "Inspeção de infraestrutura",
        "Missões táticas complexas",
        "Monitoramento de fronteiras"
      ],
      bestFor: "Operações críticas e de longo alcance"
    }
  ];

  const benefits = [
    {
      icon: Eye,
      title: "Visão 360°",
      description: "Monitoramento completo de áreas extensas"
    },
    {
      icon: Clock,
      title: "Resposta Rápida",
      description: "Chegada em minutos a qualquer local"
    },
    {
      icon: Shield,
      title: "Segurança",
      description: "Operações sem exposição de pessoal"
    },
    {
      icon: Camera,
      title: "Documentação",
      description: "Evidências em tempo real com vídeo 4K"
    }
  ];

  const applications = [
    {
      title: "Patrulhamento Inteligente",
      description: "Monitoramento proativo de áreas urbanas e rurais",
      image: "/images/lifestyle/public-safety-1-alpha.jpg",
      features: [
        "Roteiros automatizados",
        "Detecção de anomalias",
        "Alertas em tempo real",
        "Integração com CCO"
      ],
      results: ["Redução de 40% em crimes", "Resposta 3x mais rápida", "Cobertura 24/7"]
    },
    {
      title: "Busca e Resgate",
      description: "Localização eficiente de pessoas desaparecidas",
      image: "/images/lifestyle/public-safety-2-alpha.jpg",
      features: [
        "Câmera térmica para busca noturna",
        "Alcance de até 20km",
        "Zoom para identificação",
        "Comunicação com equipes"
      ],
      results: ["Localização 5x mais rápida", "Sucesso em 90% dos casos", "Operação segura"]
    },
    {
      title: "Gestão de Tráfego",
      description: "Monitoramento e fiscalização de trânsito",
      image: "/images/lifestyle/public-safety-3-max.jpg",
      features: [
        "Monitoramento de congestionamentos",
        "Detecção de infrações",
        "Controle de velocidade",
        "Relatórios automáticos"
      ],
      results: ["Redução de 30% em acidentes", "Fiscalização eficiente", "Dados em tempo real"]
    },
    {
      title: "Monitoramento de Eventos",
      description: "Segurança em eventos de massa e manifestações",
      image: "/images/lifestyle/construction-1.jpeg",
      features: [
        "Visão aérea completa",
        "Detecção de aglomerações",
        "Monitoramento de perimetral",
        "Comunicação com comando"
      ],
      results: ["Segurança garantida", "Resposta rápida", "Documentação completa"]
    }
  ];

  const useCases = [
    {
      title: "Operações de Busca e Resgate",
      description: "Localização eficiente de pessoas desaparecidas em áreas extensas",
      icon: Users,
      benefits: ["Localização 5x mais rápida", "Operação segura para equipes", "Cobertura noturna com térmica"]
    },
    {
      title: "Patrulhamento Preventivo",
      description: "Monitoramento proativo de áreas de risco e pontos críticos",
      icon: Shield,
      benefits: ["Redução de 40% em crimes", "Resposta 3x mais rápida", "Cobertura 24/7"]
    },
    {
      title: "Fiscalização de Trânsito",
      description: "Monitoramento e controle de infrações de trânsito",
      icon: Car,
      benefits: ["Redução de 30% em acidentes", "Fiscalização eficiente", "Dados em tempo real"]
    },
    {
      title: "Segurança em Eventos",
      description: "Monitoramento de eventos de massa e manifestações",
      icon: Camera,
      benefits: ["Segurança garantida", "Resposta rápida", "Documentação completa"]
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
                  <Shield className="w-4 h-4" />
                  Segurança Pública e Defesa Civil
                </div>
                <h1 className="text-4xl md:text-5xl font-heading font-bold text-navy-deep mb-6">
                  Proteção e Resposta Estratégica
                </h1>
                <p className="text-xl text-gray-dark leading-relaxed mb-8">
                  Amplie suas capacidades operacionais com tecnologia de vigilância avançada. Visão 360°, 
                  patrulha inteligente, gestão de tráfego urbano e resposta rápida a emergências com visão noturna de última geração.
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
                  src="/images/lifestyle/public-safety-1-alpha.jpg"
                  alt="Segurança Pública com Drones"
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
                Por que drones para segurança pública?
              </h2>
              <p className="text-xl text-gray-dark max-w-3xl mx-auto">
                Tecnologia que revoluciona a proteção e resposta a emergências
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

        {/* Applications Section */}
        <section className="py-20 bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-navy-deep mb-4">
                Aplicações em Segurança Pública
              </h2>
              <p className="text-xl text-gray-dark max-w-3xl mx-auto">
                Soluções especializadas para diferentes necessidades de segurança
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
                Drones Ideais para Segurança Pública
              </h2>
              <p className="text-xl text-gray-dark max-w-3xl mx-auto">
                Cada drone tem características específicas para diferentes operações
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
        <section className="py-20 bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-navy-deep mb-4">
                Casos de Uso em Segurança Pública
              </h2>
              <p className="text-xl text-gray-dark max-w-3xl mx-auto">
                Aplicações práticas que transformam a segurança pública
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {useCases.map((useCase, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <useCase.icon className="w-6 h-6 text-blue-600" />
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

export default SegurancaPublica;
