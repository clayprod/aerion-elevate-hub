import { ContactBlock as ContactBlockType, BlockProps } from "@/types/blocks";
import ContactSection from "../home/ContactSection";

interface ContactBlockProps extends BlockProps<ContactBlockType> {
  // Props específicas do ContactBlock se necessário
}

const ContactBlock = ({ block, isEditing = false }: ContactBlockProps) => {
  const { content } = block;

  return (
    <section className={`py-12 md:py-16 ${content.background_color === 'gray' ? 'bg-gray-light/30' : 'bg-white'}`}>
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-navy-deep mb-4">
            {content.title}
          </h2>
          {content.subtitle && (
            <p className="text-lg text-gray-dark max-w-2xl mx-auto">
              {content.subtitle}
            </p>
          )}
        </div>

        {/* Contact Content */}
        <div className="max-w-4xl mx-auto">
          {content.show_form && content.show_info ? (
            // Mostrar ambos (formulário e informações)
            <ContactSection />
          ) : content.show_form ? (
            // Apenas formulário
            <div className="max-w-2xl mx-auto">
              <ContactSection />
            </div>
          ) : content.show_info ? (
            // Apenas informações de contato
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="p-6">
                <div className="w-16 h-16 bg-blue-medium rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-heading font-bold text-navy-deep mb-2">Telefone</h3>
                <p className="text-gray-dark">+55 11 99999-9999</p>
              </div>

              <div className="p-6">
                <div className="w-16 h-16 bg-blue-medium rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-heading font-bold text-navy-deep mb-2">Email</h3>
                <p className="text-gray-dark">contato@aerion.com.br</p>
              </div>

              <div className="p-6">
                <div className="w-16 h-16 bg-blue-medium rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-heading font-bold text-navy-deep mb-2">Endereço</h3>
                <p className="text-gray-dark">São Paulo, SP - Brasil</p>
              </div>
            </div>
          ) : (
            // Nenhum conteúdo específico
            <div className="text-center">
              <p className="text-gray-dark">Configure o bloco para mostrar formulário ou informações de contato.</p>
            </div>
          )}
        </div>
      </div>

      {/* Editing indicator */}
      {isEditing && (
        <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium z-40">
          Contact Block
        </div>
      )}
    </section>
  );
};

export default ContactBlock;

