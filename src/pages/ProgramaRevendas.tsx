import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileFloatingCTA from "@/components/MobileFloatingCTA";
import { SEOHead } from "@/components/SEO/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Users, Award, Headphones, BookOpen, Globe, TrendingUp, Shield, Star, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const ProgramaRevendas = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    website: "",
    experience: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simular envio do formulário
    setTimeout(() => {
      toast({
        title: "Interesse registrado!",
        description: "Entraremos em contato em até 24 horas para conversar sobre o programa de revendas.",
      });
      setIsLoading(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        website: "",
        experience: "",
        message: "",
      });
    }, 2000);
  };

  const benefits = [
    {
      icon: <TrendingUp className="w-8 h-8 text-green-600" />,
      title: "Margens Atraentes",
      description: "Margens de 22-28% vs. 10-15% de produtos commodity",
      highlight: "2x mais lucrativo"
    },
    {
      icon: <Headphones className="w-8 h-8 text-blue-600" />,
      title: "Suporte Técnico N2",
      description: "Equipe especializada para escalar dúvidas complexas",
      highlight: "Suporte em português"
    },
    {
      icon: <BookOpen className="w-8 h-8 text-purple-600" />,
      title: "Treinamento Completo",
      description: "Certificação Autel + materiais de vendas",
      highlight: "3 dias de treinamento"
    },
    {
      icon: <Globe className="w-8 h-8 text-orange-600" />,
      title: "Portal do Parceiro",
      description: "Acesso exclusivo a apresentações, vídeos e cases",
      highlight: "Materiais atualizados"
    },
    {
      icon: <Shield className="w-8 h-8 text-red-600" />,
      title: "Política Flexível",
      description: "Estoque consignado e trocas facilitadas",
      highlight: "Reduz risco"
    },
    {
      icon: <Users className="w-8 h-8 text-teal-600" />,
      title: "Rede de Parceiros",
      description: "Comunidade para troca de experiências",
      highlight: "Networking B2B"
    }
  ];

  const tiers = [
    {
      name: "Parceiro Autorizado",
      badge: "Silver",
      color: "bg-gray-100 text-gray-800",
      requirements: [
        "Faturamento mínimo R$ 2M/ano",
        "8-30 funcionários",
        "Experiência B2B tech 2+ anos",
        "Rede de clientes em 1-2 verticais",
        "Estrutura comercial ativa"
      ],
      benefits: [
        "Margem: 22-25%",
        "Sell-in mínimo: R$ 80k/trimestre",
        "Suporte técnico N2",
        "Treinamento básico",
        "Portal do parceiro"
      ]
    },
    {
      name: "Parceiro Premium",
      badge: "Gold",
      color: "bg-yellow-100 text-yellow-800",
      requirements: [
        "Faturamento mínimo R$ 5M/ano",
        "20-50 funcionários",
        "Experiência B2B tech 5+ anos",
        "Rede de clientes em 2-3 verticais",
        "Estrutura comercial robusta"
      ],
      benefits: [
        "Margem: 25-28%",
        "Sell-in mínimo: R$ 180k/trimestre",
        "Suporte técnico prioritário",
        "Treinamento avançado",
        "Portal premium + materiais exclusivos",
        "Participação em eventos"
      ]
    }
  ];

  const process = [
    {
      step: "1",
      title: "Interesse",
      description: "Preencha o formulário ou entre em contato"
    },
    {
      step: "2",
      title: "Qualificação",
      description: "Análise do perfil e fit com o programa"
    },
    {
      step: "3",
      title: "Apresentação",
      description: "Reunião para apresentar benefícios e requisitos"
    },
    {
      step: "4",
      title: "Negociação",
      description: "Definição de condições e acordos comerciais"
    },
    {
      step: "5",
      title: "Onboarding",
      description: "Treinamento, acesso ao portal e ativação"
    }
  ];

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Programa de Revendas Autel | Margens 22-28% | Aerion Technologies"
        description="Torne-se revendedor oficial Autel. Margens de 22-28%, suporte técnico N2, treinamento, portal do parceiro, materiais de vendas. Sell-in mínimo R$ 80k/trimestre."
        keywords="revenda drones, distribuidor drones, programa revenda autel, parceiro drones profissionais, revenda autel brasil"
        canonical="https://aerion.com.br/programa-revendas"
      />
      <Header />
      
      <main className="pt-28 pb-20">
        {/* Hero Section */}
        <section className="bg-gradient-primary py-16 text-white">
          <div className="container-custom text-center">
            <Badge className="mb-6 bg-white/20 text-white border-white/30">
              Programa de Parcerias
            </Badge>
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              Torne-se Parceiro Oficial Autel
            </h1>
            <p className="text-xl text-cyan-light max-w-3xl mx-auto mb-8">
              Margens de 22-28%, suporte técnico especializado e programa completo para revendedores de drones profissionais
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-navy-deep hover:bg-gray-100">
                Quero ser Parceiro
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Falar com Especialista
              </Button>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-white">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-navy-deep mb-4">
                Por que ser Parceiro Aerion?
              </h2>
              <p className="text-lg text-gray-dark max-w-2xl mx-auto">
                Programa estruturado para maximizar sua lucratividade e oferecer excelência aos seus clientes
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="mx-auto mb-4">
                      {benefit.icon}
                    </div>
                    <CardTitle className="text-xl">{benefit.title}</CardTitle>
                    <Badge variant="secondary" className="w-fit mx-auto">
                      {benefit.highlight}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {benefit.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Tiers Section */}
        <section className="py-16 bg-gray-light/30">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-navy-deep mb-4">
                Níveis de Parceria
              </h2>
              <p className="text-lg text-gray-dark max-w-2xl mx-auto">
                Dois níveis para atender diferentes perfis de revendedores
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {tiers.map((tier, index) => (
                <Card key={index} className="relative">
                  <CardHeader className="text-center">
                    <Badge className={`w-fit mx-auto mb-4 ${tier.color}`}>
                      {tier.badge}
                    </Badge>
                    <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-navy-deep mb-3">Requisitos:</h4>
                      <ul className="space-y-2">
                        {tier.requirements.map((req, reqIndex) => (
                          <li key={reqIndex} className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-dark">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-navy-deep mb-3">Benefícios:</h4>
                      <ul className="space-y-2">
                        {tier.benefits.map((benefit, benIndex) => (
                          <li key={benIndex} className="flex items-start gap-2">
                            <Star className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-dark">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-16 bg-white">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-navy-deep mb-4">
                Como se Tornar Parceiro
              </h2>
              <p className="text-lg text-gray-dark max-w-2xl mx-auto">
                Processo simples e estruturado em 5 etapas
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              {process.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-blue-medium text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-lg font-semibold text-navy-deep mb-2">{step.title}</h3>
                  <p className="text-gray-dark text-sm">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Form Section */}
        <section className="py-16 bg-gradient-primary text-white">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                  Interessado em ser Parceiro?
                </h2>
                <p className="text-xl text-cyan-light">
                  Preencha o formulário e entraremos em contato em até 24 horas
                </p>
              </div>
              
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Nome Completo *
                        </label>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          required
                          className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                          placeholder="Seu nome completo"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Email *
                        </label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          required
                          className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                          placeholder="seu@email.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Telefone *
                        </label>
                        <Input
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          required
                          className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                          placeholder="(11) 99999-9999"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Empresa *
                        </label>
                        <Input
                          value={formData.company}
                          onChange={(e) => setFormData({...formData, company: e.target.value})}
                          required
                          className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                          placeholder="Nome da sua empresa"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Website
                        </label>
                        <Input
                          value={formData.website}
                          onChange={(e) => setFormData({...formData, website: e.target.value})}
                          className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                          placeholder="https://www.suaempresa.com.br"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Experiência B2B Tech
                        </label>
                        <Input
                          value={formData.experience}
                          onChange={(e) => setFormData({...formData, experience: e.target.value})}
                          className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                          placeholder="Ex: 5 anos vendendo equipamentos"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Mensagem
                      </label>
                      <Textarea
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                        placeholder="Conte-nos sobre sua empresa e interesse no programa..."
                        rows={4}
                      />
                    </div>
                    <div className="text-center">
                      <Button
                        type="submit"
                        size="lg"
                        disabled={isLoading}
                        className="bg-white text-navy-deep hover:bg-gray-100"
                      >
                        {isLoading ? "Enviando..." : "Quero ser Parceiro"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <MobileFloatingCTA />
    </div>
  );
};

export default ProgramaRevendas;

