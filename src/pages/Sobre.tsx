import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Target, Eye, Award } from "lucide-react";

const Sobre = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-28 pb-20">
        {/* Hero Section */}
        <section className="bg-gradient-primary py-20 text-white">
          <div className="container-custom text-center">
            <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">
              Sobre a Aerion Technologies
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              Distribuindo o futuro da tecnologia aérea no Brasil desde 2026
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20 bg-white">
          <div className="container-custom max-w-4xl">
            <div className="prose prose-lg mx-auto">
              <p className="text-xl text-gray-dark leading-relaxed mb-6">
                A Aerion Technologies nasceu com a missão de democratizar o acesso à tecnologia de drones profissionais no Brasil, oferecendo soluções Autel de ponta com custo-benefício superior e suporte técnico especializado.
              </p>
              <p className="text-lg text-gray-dark leading-relaxed mb-6">
                Reconhecemos que o mercado brasileiro de tecnologia aérea estava dominado por uma única marca global com preços premium, deixando profissionais enterprise sem alternativas viáveis. Nossa parceria estratégica com a Autel Robotics nos permite oferecer tecnologia comparável aos líderes mundiais, mas com investimento mais inteligente e suporte local diferenciado.
              </p>
              <p className="text-lg text-gray-dark leading-relaxed">
                Não somos apenas distribuidores – somos parceiros estratégicos que entendem as necessidades específicas de cada vertical de aplicação, desde construção e topografia até segurança pública e operações de resgate.
              </p>
            </div>
          </div>
        </section>

        {/* Mission, Vision, Values */}
        <section className="py-20 bg-gray-light/30">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Mission */}
              <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-accent flex items-center justify-center shadow-glow">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-heading font-bold text-navy-deep mb-4">
                  Nossa Missão
                </h2>
                <p className="text-gray-dark leading-relaxed">
                  Distribuir e integrar tecnologias de ponta com excelência, segurança e agilidade, impulsionando resultados dos nossos clientes.
                </p>
              </div>

              {/* Vision */}
              <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-accent flex items-center justify-center shadow-glow">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-heading font-bold text-navy-deep mb-4">
                  Nossa Visão 2028
                </h2>
                <p className="text-gray-dark leading-relaxed">
                  Oferecer tecnologias que simplifiquem operações, encantem clientes e gerem impacto positivo no mundo.
                </p>
              </div>

              {/* Values */}
              <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-accent flex items-center justify-center shadow-glow">
                  <Award className="w-8 h-8 text-white" />
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

        {/* Differentials */}
        <section className="py-20 bg-white">
          <div className="container-custom max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-navy-deep mb-12 text-center">
              Diferenciais Competitivos
            </h2>
            
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-lg bg-blue-medium/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-medium" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-heading font-bold text-navy-deep mb-2">
                    Tecnologia Autel Comparável aos Líderes Globais
                  </h3>
                  <p className="text-gray-dark leading-relaxed">
                    Oferecemos drones com especificações técnicas e desempenho comparáveis às marcas premium, mas com custo-benefício significativamente superior.
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

        {/* CTA Section */}
        <section className="py-20 bg-gradient-primary">
          <div className="container-custom text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">
              Pronto para Conhecer Nossa Equipe?
            </h2>
            <p className="text-xl text-blue-light mb-8 max-w-2xl mx-auto">
              Entre em contato e descubra como podemos ajudar a transformar suas operações
            </p>
            <Button
              asChild
              size="lg"
              className="bg-white text-blue-medium hover:bg-white/90 font-heading font-semibold text-lg"
            >
              <Link to="/contato">
                Fale Conosco
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Sobre;
