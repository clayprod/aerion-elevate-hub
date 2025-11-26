import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEOHead } from "@/components/SEO/SEOHead";

const PoliticaPrivacidade = () => {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="Política de Privacidade | Aerion Technologies"
        description="Conheça como a Aerion Technologies coleta, utiliza e protege suas informações pessoais. Política de privacidade transparente e em conformidade com a LGPD."
        keywords="política privacidade, LGPD, proteção dados, privacidade aerion, termos uso"
        canonical="https://aerion.com.br/politica-privacidade"
        ogType="website"
      />
      <Header />
      
      <main className="pt-28 pb-20">
        {/* Hero Section */}
        <section className="bg-gradient-primary py-16 text-white">
          <div className="container-custom text-center">
            <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Política de Privacidade
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Conheça como coletamos, utilizamos e protegemos suas informações pessoais
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-600 mb-6">
                    <strong>Última atualização:</strong> {new Date().toLocaleDateString('pt-BR')}
                  </p>

                  <div className="space-y-8">
                    <section>
                      <h2 className="text-2xl font-heading font-bold text-navy-deep mb-4">
                        1. Introdução
                      </h2>
                      <p className="text-gray-700 leading-relaxed">
                        A Aerion Technologies Ltda. ("nós", "nossa" ou "empresa") respeita sua privacidade e está comprometida em proteger suas informações pessoais. Esta Política de Privacidade descreve como coletamos, utilizamos, armazenamos e protegemos suas informações quando você utiliza nosso site e serviços.
                      </p>
                    </section>

                    <section>
                      <h2 className="text-2xl font-heading font-bold text-navy-deep mb-4">
                        2. Informações que Coletamos
                      </h2>
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-xl font-heading font-semibold text-navy-deep mb-2">
                            2.1 Informações Fornecidas Voluntariamente
                          </h3>
                          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                            <li>Nome completo e dados de contato (email, telefone)</li>
                            <li>Informações da empresa (nome, setor de atuação)</li>
                            <li>Mensagens e comunicações enviadas através de nossos formulários</li>
                            <li>Dados de cadastro em nossa plataforma</li>
                          </ul>
                        </div>
                        <div>
                          <h3 className="text-xl font-heading font-semibold text-navy-deep mb-2">
                            2.2 Informações Coletadas Automaticamente
                          </h3>
                          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                            <li>Endereço IP e dados de localização</li>
                            <li>Informações do navegador e dispositivo</li>
                            <li>Páginas visitadas e tempo de permanência</li>
                            <li>Cookies e tecnologias similares</li>
                          </ul>
                        </div>
                      </div>
                    </section>

                    <section>
                      <h2 className="text-2xl font-heading font-bold text-navy-deep mb-4">
                        3. Como Utilizamos suas Informações
                      </h2>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        Utilizamos suas informações pessoais para:
                      </p>
                      <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                        <li>Responder às suas solicitações e fornecer suporte</li>
                        <li>Enviar informações sobre nossos produtos e serviços</li>
                        <li>Melhorar nosso site e experiência do usuário</li>
                        <li>Cumprir obrigações legais e regulamentares</li>
                        <li>Prevenir fraudes e garantir a segurança</li>
                        <li>Realizar análises e pesquisas de mercado</li>
                      </ul>
                    </section>

                    <section>
                      <h2 className="text-2xl font-heading font-bold text-navy-deep mb-4">
                        4. Compartilhamento de Informações
                      </h2>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, exceto nas seguintes situações:
                      </p>
                      <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                        <li>Com seu consentimento explícito</li>
                        <li>Para cumprir obrigações legais</li>
                        <li>Com prestadores de serviços que nos auxiliam (sob acordos de confidencialidade)</li>
                        <li>Em caso de fusão, aquisição ou reestruturação da empresa</li>
                      </ul>
                    </section>

                    <section>
                      <h2 className="text-2xl font-heading font-bold text-navy-deep mb-4">
                        5. Segurança dos Dados
                      </h2>
                      <p className="text-gray-700 leading-relaxed">
                        Implementamos medidas de segurança técnicas e organizacionais adequadas para proteger suas informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição. Isso inclui criptografia, controles de acesso e monitoramento regular de segurança.
                      </p>
                    </section>

                    <section>
                      <h2 className="text-2xl font-heading font-bold text-navy-deep mb-4">
                        6. Cookies e Tecnologias Similares
                      </h2>
                      <p className="text-gray-700 leading-relaxed">
                        Utilizamos cookies e tecnologias similares para melhorar sua experiência em nosso site, analisar o tráfego e personalizar conteúdo. Você pode controlar o uso de cookies através das configurações do seu navegador.
                      </p>
                    </section>

                    <section>
                      <h2 className="text-2xl font-heading font-bold text-navy-deep mb-4">
                        7. Seus Direitos
                      </h2>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem os seguintes direitos:
                      </p>
                      <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                        <li>Acesso às suas informações pessoais</li>
                        <li>Correção de dados incompletos ou incorretos</li>
                        <li>Exclusão de dados desnecessários</li>
                        <li>Portabilidade dos dados</li>
                        <li>Revogação do consentimento</li>
                        <li>Informações sobre o compartilhamento de dados</li>
                      </ul>
                    </section>

                    <section>
                      <h2 className="text-2xl font-heading font-bold text-navy-deep mb-4">
                        8. Retenção de Dados
                      </h2>
                      <p className="text-gray-700 leading-relaxed">
                        Mantemos suas informações pessoais apenas pelo tempo necessário para cumprir os propósitos descritos nesta política, a menos que um período de retenção mais longo seja exigido ou permitido por lei.
                      </p>
                    </section>

                    <section>
                      <h2 className="text-2xl font-heading font-bold text-navy-deep mb-4">
                        9. Alterações nesta Política
                      </h2>
                      <p className="text-gray-700 leading-relaxed">
                        Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos sobre mudanças significativas através de nosso site ou por email. Recomendamos que revise esta política regularmente.
                      </p>
                    </section>

                    <section>
                      <h2 className="text-2xl font-heading font-bold text-navy-deep mb-4">
                        10. Contato
                      </h2>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        Se você tiver dúvidas sobre esta Política de Privacidade ou sobre como tratamos suas informações pessoais, entre em contato conosco:
                      </p>
                      <div className="bg-gray-50 p-6 rounded-xl">
                        <p className="text-gray-700 mb-2">
                          <strong>Email:</strong> contato@aerion.com.br
                        </p>
                        <p className="text-gray-700 mb-2">
                          <strong>Telefone:</strong> +55 11 5102-4229
                        </p>
                        <p className="text-gray-700">
                          <strong>Endereço:</strong> Edifício Itamaracá, R. Quintana 887, Cj. 111, 11º Andar, Brooklin Novo - SP, 04569-011
                        </p>
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PoliticaPrivacidade;
