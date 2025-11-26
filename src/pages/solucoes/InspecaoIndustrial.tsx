import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileFloatingCTA from '@/components/MobileFloatingCTA';
import { SEOHead } from '@/components/SEO/SEOHead';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Factory, 
  Zap, 
  Thermometer, 
  Eye, 
  Shield, 
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  Star,
  Users,
  Award,
  Target
} from 'lucide-react';

const InspecaoIndustrial = () => {
  const drones = [
    {
      name: "EVO Lite Enterprise",
      variant: "640T",
      image: "/images/products/evo_lite/640t/1.png",
      features: [
        "Câmera térmica 640×512 com zoom digital 1-16x",
        "Sensor visível 1/2\" 48 MP com modo antifog",
        "Faixa radiométrica -20°C a 150°C / 0 a 550°C",
        "Precisão ±3°C ou ±3% (maior valor)"
      ],
      applications: [
        "Inspeção de painéis solares",
        "Verificação de equipamentos elétricos",
        "Monitoramento de motores",
        "Detecção de hotspots"
      ],
      bestFor: "Inspeções térmicas de médio alcance"
    },
    {
      name: "EVO Max V2",
      variant: "4N",
      image: "/images/products/evo_max/4n/1.png",
      features: [
        "Visão noturna Starlight",
        "Câmera térmica 640×512",
        "Zoom digital 8x",
        "Alcance de até 15km (FCC) ou 8km (SRRC/CE)"
      ],
      applications: [
        "Inspeções noturnas",
        "Monitoramento 24/7",
        "Inspeção de linhas de transmissão",
        "Operações em áreas remotas"
      ],
      bestFor: "Inspeções noturnas e operações BVLOS"
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
        "Inspeções de infraestrutura crítica",
        "Monitoramento de oleodutos",
        "Inspeção de minas",
        "Operações de longo alcance"
      ],
      bestFor: "Infraestrutura crítica e operações complexas"
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title: "Segurança",
      description: "Inspeções sem exposição a riscos operacionais"
    },
    {
      icon: Thermometer,
      title: "Detecção Térmica",
      description: "Identificação precoce de falhas e hotspots"
    },
    {
      icon: Eye,
      title: "Visão Noturna",
      description: "Monitoramento 24/7 com tecnologia Starlight"
    },
    {
      icon: Target,
      title: "Precisão",
      description: "Inspeções detalhadas com zoom até 560x"
    }
  ];

  const industries = [
    {
      title: "Energia Solar",
      description: "Inspeção térmica de painéis solares e detecção de falhas",
      image: "/images/solucoes/setores-atendidos/energia-solar.jpg",
      applications: [
        "Detecção de hot spots em painéis",
        "Mapeamento de falhas em usinas",
        "Monitoramento de performance",
        "Relatórios automatizados"
      ],
      results: ["Redução de 60% em paradas", "Detecção precoce de falhas", "ROI comprovado"]
    },
    {
      title: "Óleo & Gás",
      description: "Monitoramento de oleodutos, gasodutos e instalações offshore",
      image: "/images/solucoes/setores-atendidos/oleo-gas.jpg",
      applications: [
        "Inspeção de oleodutos",
        "Monitoramento de plataformas",
        "Detecção de vazamentos",
        "Inspeção de torres"
      ],
      results: ["Segurança operacional", "Redução de custos", "Compliance regulatório"]
    },
    {
      title: "Mineração",
      description: "Inspeção de equipamentos, pilhas de rejeito e áreas de risco",
      image: "/images/solucoes/inspecao-industrial/mineracao.jpg",
      applications: [
        "Inspeção de equipamentos pesados",
        "Monitoramento de pilhas de rejeito",
        "Mapeamento de áreas de risco",
        "Planejamento de operações"
      ],
      results: ["Otimização de operações", "Redução de riscos", "Eficiência operacional"]
    },
    {
      title: "Transmissão de Energia",
      description: "Inspeção de linhas de transmissão, torres e subestações",
      image: "/images/solucoes/inspecao-industrial/transmissao-energia.jpg",
      applications: [
        "Inspeção de linhas de transmissão",
        "Verificação de torres",
        "Monitoramento de subestações",
        "Detecção de vegetação"
      ],
      results: ["Manutenção preditiva", "Redução de falhas", "Otimização de recursos"]
    }
  ];

  const useCases = [
    {
      title: "Inspeção Térmica de Painéis Solares",
      description: "Detecção automática de hot spots e falhas em usinas solares",
      icon: Zap,
      benefits: ["Redução de 60% em paradas não planejadas", "Detecção precoce de falhas", "ROI de 300% em 12 meses"]
    },
    {
      title: "Monitoramento de Oleodutos",
      description: "Inspeção contínua de dutos e detecção de vazamentos",
      icon: Factory,
      benefits: ["Segurança operacional máxima", "Compliance regulatório", "Redução de custos de manutenção"]
    },
    {
      title: "Inspeção de Linhas de Transmissão",
      description: "Verificação detalhada de torres e cabos de alta tensão",
      icon: Eye,
      benefits: ["Manutenção preditiva", "Redução de falhas", "Otimização de recursos"]
    },
    {
      title: "Monitoramento de Minas",
      description: "Inspeção de equipamentos e monitoramento de áreas de risco",
      icon: AlertTriangle,
      benefits: ["Segurança operacional", "Otimização de operações", "Redução de riscos"]
    }
  ];

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Drones para Inspeção Industrial e Energia | Inspeções Térmicas Avançadas"
        description="Maximize eficiência e segurança com drones Autel para inspeções térmicas em energia, óleo & gás, mineração. Detecção precoce de hotspots, operações BVLOS e redução de paradas não planejadas em até 60%."
        keywords="drones inspeção industrial, inspeção térmica drones, drones energia, drones óleo e gás, drones mineração, inspeção painéis solares, detecção hotspots, drones BVLOS"
        canonical="https://aerion.com.br/solucoes/industrial"
        ogType="website"
      />
      <Header />
      
      <main className="pt-28 pb-20">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-orange-50 to-white">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <Factory className="w-4 h-4" />
                  Inspeção Industrial e Energia
                </div>
                <h1 className="text-4xl md:text-5xl font-heading font-bold text-navy-deep mb-6">
                  Precisão e Segurança Operacional
                </h1>
                <p className="text-xl text-gray-dark leading-relaxed mb-8">
                  Maximize a eficiência e segurança das suas instalações. Inspeções térmicas avançadas em energia, 
                  óleo & gás, mineração, detecção precoce de hotspots e operações BVLOS que reduzem paradas não planejadas em até 60%.
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
                  src="/images/lifestyle/oil-and-gas-1.jpg"
                  alt="Inspeção Industrial com Drones"
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
                Por que drones para inspeção industrial?
              </h2>
              <p className="text-xl text-gray-dark max-w-3xl mx-auto">
                Tecnologia que revoluciona a manutenção preditiva e segurança operacional
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-8 h-8 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-navy-deep mb-3">{benefit.title}</h3>
                  <p className="text-gray-dark">{benefit.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Industries Section */}
        <section className="py-20 bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-navy-deep mb-4">
                Setores Atendidos
              </h2>
              <p className="text-xl text-gray-dark max-w-3xl mx-auto">
                Soluções especializadas para diferentes indústrias
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {industries.map((industry, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="relative h-48">
                    <img
                      src={industry.image}
                      alt={industry.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-navy-deep mb-3">{industry.title}</h3>
                    <p className="text-gray-dark mb-4">{industry.description}</p>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-navy-deep mb-2">Aplicações:</h4>
                      <ul className="space-y-1">
                        {industry.applications.map((app, idx) => (
                          <li key={idx} className="text-sm text-gray-dark flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                            {app}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-semibold text-navy-deep mb-2">Resultados:</h4>
                      <ul className="space-y-1">
                        {industry.results.map((result, idx) => (
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
                Drones Ideais para Inspeção Industrial
              </h2>
              <p className="text-xl text-gray-dark max-w-3xl mx-auto">
                Cada drone tem características específicas para diferentes tipos de inspeção
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
                            <Target className="w-3 h-3 text-orange-500 flex-shrink-0" />
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
                Casos de Uso em Inspeção Industrial
              </h2>
              <p className="text-xl text-gray-dark max-w-3xl mx-auto">
                Aplicações práticas que transformam a manutenção industrial
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {useCases.map((useCase, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <useCase.icon className="w-6 h-6 text-orange-600" />
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

export default InspecaoIndustrial;
