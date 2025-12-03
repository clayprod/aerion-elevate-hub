import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileFloatingCTA from "@/components/MobileFloatingCTA";
import { SEOHead } from "@/components/SEO/SEOHead";
import { Breadcrumbs } from "@/components/SEO/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Target, Eye, Award, Globe, Users, Shield } from "lucide-react";
import { AutelLogo } from "@/components/AutelLogo";

const Sobre = () => {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="Sobre a Aerion Technologies | Distribuidor Oficial Autel no Brasil"
        description="Conheça a Aerion Technologies, distribuidor oficial Autel Robotics no Brasil. Especialistas em drones profissionais com suporte técnico local e parcerias estratégicas."
        keywords="aerion technologies, sobre aerion, distribuidor autel brasil, drones profissionais brasil, suporte técnico drones"
        canonical="https://aerion.com.br/sobre"
      />
      <Header />
      
      <main className="pt-28 pb-20">
        <Breadcrumbs />
        {/* Story Section */}
        <section className="py-10 bg-gray-light/30">
          <div className="container-custom max-w-4xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-navy-deep mb-4">
                Nossa História
              </h2>
              <p className="text-lg text-gray-dark max-w-2xl mx-auto">
                Excelência técnica e paixão por resultados reais
              </p>
            </div>
            
            <div className="prose prose-lg mx-auto">
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <p className="text-xl text-gray-dark leading-relaxed mb-6">
                  Somos uma equipe especializada em tecnologia aérea com foco total em performance e impacto prático. Cada integrante traz experiência consolidada em operações profissionais com drones e conhecimento técnico aprofundado para transformar desafios em soluções eficientes.
                </p>
                <p className="text-lg text-gray-dark leading-relaxed mb-6">
                  Nosso trabalho vai além da simples distribuição: estruturamos uma rede de parceiros sólida, com suporte técnico especializado e proximidade real com o mercado. Entendemos as necessidades específicas de cada setor — da construção civil à segurança pública — e entregamos soluções precisas que geram valor direto para nossos clientes.
                </p>
                <p className="text-lg text-gray-dark leading-relaxed">
                  Estamos comprometidos em levar ao Brasil as melhores tecnologias, com confiabilidade, suporte local e excelência operacional. Nossa missão é clara: impulsionar a adoção de drones profissionais com seriedade, precisão e resultados mensuráveis.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission, Vision, Values */}
        <section className="py-10 bg-white">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Mission */}
              <div className="bg-gray-light/50 p-8 rounded-2xl shadow-lg text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-medium to-blue-dark flex items-center justify-center shadow-lg">
                  <Target className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-heading font-bold text-navy-deep mb-4">
                  Nossa Missão
                </h2>
                <p className="text-gray-dark leading-relaxed">
                  Distribuir e integrar tecnologias de ponta com excelência, segurança e agilidade, impulsionando resultados dos nossos clientes.
                </p>
              </div>

              {/* Vision */}
              <div className="bg-gray-light/50 p-8 rounded-2xl shadow-lg text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-dark to-navy-deep flex items-center justify-center shadow-lg">
                  <Eye className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-heading font-bold text-navy-deep mb-4">
                  Nossa Visão 2028
                </h2>
                <p className="text-gray-dark leading-relaxed">
                  Oferecer tecnologias que simplifiquem operações, encantem clientes e gerem impacto positivo no mundo.
                </p>
              </div>

              {/* Values */}
              <div className="bg-gray-light/50 p-8 rounded-2xl shadow-lg text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-800 to-blue-900 flex items-center justify-center shadow-lg">
                  <Award className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-heading font-bold text-navy-deep mb-4">
                  Nossos Valores
                </h2>
                <ul className="text-gray-dark leading-relaxed text-left space-y-2">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 mr-2 flex-shrink-0 text-blue-medium mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Inovação com Responsabilidade
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 mr-2 flex-shrink-0 text-blue-medium mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Excelência no Atendimento
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 mr-2 flex-shrink-0 text-blue-medium mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Agilidade com Qualidade
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* About Autel Section */}
        <section className="py-10 bg-white">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <div className="mb-6">
                  <AutelLogo 
                    className="h-10 md:h-12 w-auto" 
                    textFallback="Sobre a Autel"
                  />
                </div>
                <p className="text-lg text-gray-dark max-w-3xl mx-auto">
                  Conheça a empresa por trás da tecnologia que revoluciona o mercado de drones profissionais
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-medium/10 flex items-center justify-center flex-shrink-0">
                      <Globe className="w-6 h-6 text-blue-medium" />
                    </div>
                    <div>
                      <h3 className="text-xl font-heading font-bold text-navy-deep mb-2">
                        Presença Global
                      </h3>
                      <p className="text-gray-dark leading-relaxed">
                        Presente em mais de 70 países, a Autel Robotics é hoje um dos maiores fabricantes globais de drones profissionais.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-dark/10 flex items-center justify-center flex-shrink-0">
                      <Shield className="w-6 h-6 text-blue-dark" />
                    </div>
                    <div>
                      <h3 className="text-xl font-heading font-bold text-navy-deep mb-2">
                        Reconhecimento Mundial
                      </h3>
                      <p className="text-gray-dark leading-relaxed">
                        Reconhecida por sua precisão, confiabilidade e inovação tecnológica em aplicações enterprise.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-lg bg-orange-energy/10 flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-orange-energy" />
                    </div>
                    <div>
                      <h3 className="text-xl font-heading font-bold text-navy-deep mb-2">
                        Parceria Estratégica no Brasil
                      </h3>
                      <p className="text-gray-dark leading-relaxed">
                        No Brasil, a Aerion Technologies é o distribuidor oficial, responsável por construir a rede nacional de revendas Autel.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-medium/5 to-blue-dark/5 p-8 rounded-2xl">
                  <h4 className="text-xl font-heading font-bold text-navy-deep mb-4">
                    Vantagens da Parceria Oficial
                  </h4>
                  <ul className="space-y-3">
                    <li className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-dark">Suporte técnico em português</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-dark">Pós-venda local especializado</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-dark">Garantia nacional completa</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-dark">Condições comerciais diferenciadas</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-dark">Parcerias estratégicas prioritárias</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* Differentials */}
        <section className="py-10 bg-white">
          <div className="container-custom max-w-4xl">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-lg bg-blue-medium/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-medium" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-heading font-bold text-navy-deep mb-2">
                    Tecnologia Autel — Padrão de Líder Global
                  </h3>
                  <p className="text-gray-dark leading-relaxed">
                    Oferecemos drones com tecnologia de ponta, desenvolvida por uma das líderes globais do setor. Nossas soluções entregam desempenho excepcional em aplicações profissionais — combinando precisão, robustez e confiabilidade — com um custo-benefício altamente competitivo, superando os principais concorrentes do mercado enterprise.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-lg bg-blue-dark/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-heading font-bold text-navy-deep mb-2">
                    Suporte Técnico Local Especializado
                  </h3>
                  <p className="text-gray-dark leading-relaxed">
                    Equipe brasileira de especialistas que compreende as necessidades específicas do mercado local e oferece suporte em português com agilidade.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-lg bg-orange-energy/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-orange-energy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-heading font-bold text-navy-deep mb-2">
                    Especialização por Vertical
                  </h3>
                  <p className="text-gray-dark leading-relaxed">
                    Conhecimento profundo das necessidades específicas de cada setor, permitindo recomendações precisas e treinamento customizado.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
      <MobileFloatingCTA />
    </div>
  );
};

export default Sobre;
