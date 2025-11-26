import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEOHead } from "@/components/SEO/SEOHead";

const TermosUso = () => {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="Termos de Uso | Aerion Technologies"
        description="Condições gerais para utilização do site e serviços da Aerion Technologies. Leia nossos termos de uso antes de utilizar nossos serviços."
        keywords="termos uso, condições uso, termos serviço, aerion technologies termos"
        canonical="https://aerion.com.br/termos-uso"
        ogType="website"
      />
      <Header />
      
      <main className="pt-28 pb-20">
        {/* Hero Section */}
        <section className="bg-gradient-primary py-16 text-white">
          <div className="container-custom text-center">
            <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Termos de Uso
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Condições gerais para utilização do site e serviços da Aerion Technologies
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
                        1. Aceitação dos Termos
                      </h2>
                      <p className="text-gray-700 leading-relaxed">
                        Ao acessar e utilizar o site da Aerion Technologies Ltda. ("Site"), você concorda em cumprir e estar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não deve utilizar nosso Site.
                      </p>
                    </section>

                    <section>
                      <h2 className="text-2xl font-heading font-bold text-navy-deep mb-4">
                        2. Descrição dos Serviços
                      </h2>
                      <p className="text-gray-700 leading-relaxed">
                        A Aerion Technologies é uma empresa especializada na distribuição de drones e tecnologias aéreas no Brasil. Nosso Site fornece informações sobre nossos produtos, serviços, soluções e permite que você entre em contato conosco para solicitações comerciais.
                      </p>
                    </section>

                    <section>
                      <h2 className="text-2xl font-heading font-bold text-navy-deep mb-4">
                        3. Uso Aceitável
                      </h2>
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-xl font-heading font-semibold text-navy-deep mb-2">
                            3.1 Uso Permitido
                          </h3>
                          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                            <li>Navegar e visualizar informações sobre nossos produtos e serviços</li>
                            <li>Entrar em contato conosco através dos formulários disponíveis</li>
                            <li>Baixar materiais informativos disponibilizados</li>
                            <li>Utilizar o Site de acordo com sua finalidade comercial</li>
                          </ul>
                        </div>
                        <div>
                          <h3 className="text-xl font-heading font-semibold text-navy-deep mb-2">
                            3.2 Uso Proibido
                          </h3>
                          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                            <li>Utilizar o Site para atividades ilegais ou não autorizadas</li>
                            <li>Interferir no funcionamento normal do Site</li>
                            <li>Tentar acessar áreas restritas ou dados de outros usuários</li>
                            <li>Transmitir vírus, malware ou código malicioso</li>
                            <li>Fazer engenharia reversa ou copiar conteúdo protegido</li>
                            <li>Utilizar bots, spiders ou outros meios automatizados</li>
                          </ul>
                        </div>
                      </div>
                    </section>

                    <section>
                      <h2 className="text-2xl font-heading font-bold text-navy-deep mb-4">
                        4. Propriedade Intelectual
                      </h2>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        Todo o conteúdo do Site, incluindo textos, imagens, logotipos, marcas, design, layout e software, é propriedade da Aerion Technologies ou de seus licenciadores e está protegido por leis de propriedade intelectual. Você não pode:
                      </p>
                      <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                        <li>Copiar, reproduzir ou distribuir nosso conteúdo sem autorização</li>
                        <li>Modificar, adaptar ou criar obras derivadas</li>
                        <li>Utilizar nossas marcas ou logotipos sem permissão</li>
                        <li>Remover avisos de direitos autorais ou propriedade</li>
                      </ul>
                    </section>

                    <section>
                      <h2 className="text-2xl font-heading font-bold text-navy-deep mb-4">
                        5. Informações do Site
                      </h2>
                      <p className="text-gray-700 leading-relaxed">
                        Embora nos esforcemos para manter as informações do Site atualizadas e precisas, não garantimos a exatidão, completude ou atualidade de todas as informações. As especificações dos produtos podem ser alteradas sem aviso prévio. Recomendamos que entre em contato conosco para obter informações mais recentes sobre produtos e serviços.
                      </p>
                    </section>

                    <section>
                      <h2 className="text-2xl font-heading font-bold text-navy-deep mb-4">
                        6. Links para Terceiros
                      </h2>
                      <p className="text-gray-700 leading-relaxed">
                        Nosso Site pode conter links para sites de terceiros. Não somos responsáveis pelo conteúdo, políticas de privacidade ou práticas desses sites externos. O acesso a sites de terceiros é por sua conta e risco.
                      </p>
                    </section>

                    <section>
                      <h2 className="text-2xl font-heading font-bold text-navy-deep mb-4">
                        7. Limitação de Responsabilidade
                      </h2>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        Na máxima extensão permitida por lei, a Aerion Technologies não será responsável por:
                      </p>
                      <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                        <li>Danos diretos, indiretos, incidentais ou consequenciais</li>
                        <li>Perda de dados, lucros ou oportunidades de negócio</li>
                        <li>Interrupção de serviços ou indisponibilidade do Site</li>
                        <li>Ações de terceiros ou conteúdo de sites externos</li>
                        <li>Decisões tomadas com base nas informações do Site</li>
                      </ul>
                    </section>

                    <section>
                      <h2 className="text-2xl font-heading font-bold text-navy-deep mb-4">
                        8. Disponibilidade do Site
                      </h2>
                      <p className="text-gray-700 leading-relaxed">
                        Nos esforçamos para manter o Site disponível 24/7, mas não garantimos disponibilidade ininterrupta. Podemos realizar manutenções programadas ou de emergência que podem resultar em indisponibilidade temporária.
                      </p>
                    </section>

                    <section>
                      <h2 className="text-2xl font-heading font-bold text-navy-deep mb-4">
                        9. Modificações dos Termos
                      </h2>
                      <p className="text-gray-700 leading-relaxed">
                        Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. As alterações entrarão em vigor imediatamente após a publicação no Site. É sua responsabilidade revisar periodicamente estes termos. O uso continuado do Site após as modificações constitui aceitação dos novos termos.
                      </p>
                    </section>

                    <section>
                      <h2 className="text-2xl font-heading font-bold text-navy-deep mb-4">
                        10. Lei Aplicável e Jurisdição
                      </h2>
                      <p className="text-gray-700 leading-relaxed">
                        Estes Termos de Uso são regidos pelas leis brasileiras. Qualquer disputa relacionada ao uso do Site será resolvida nos tribunais competentes de São Paulo, SP, Brasil.
                      </p>
                    </section>

                    <section>
                      <h2 className="text-2xl font-heading font-bold text-navy-deep mb-4">
                        11. Disposições Gerais
                      </h2>
                      <div className="space-y-4">
                        <p className="text-gray-700 leading-relaxed">
                          Se qualquer disposição destes termos for considerada inválida ou inaplicável, as demais disposições permanecerão em pleno vigor e efeito.
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                          A falha em fazer cumprir qualquer direito ou disposição destes termos não constituirá renúncia a tal direito ou disposição.
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                          Estes termos constituem o acordo completo entre você e a Aerion Technologies em relação ao uso do Site.
                        </p>
                      </div>
                    </section>

                    <section>
                      <h2 className="text-2xl font-heading font-bold text-navy-deep mb-4">
                        12. Contato
                      </h2>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco:
                      </p>
                      <div className="bg-gray-50 p-6 rounded-xl">
                        <p className="text-gray-700 mb-2">
                          <strong>Email:</strong> contato@aerion.com.br
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

export default TermosUso;
