import { TextBlock as TextBlockType, BlockProps } from "@/types/blocks";

interface TextBlockProps extends BlockProps<TextBlockType> {
  // Props específicas do TextBlock se necessário
}

const TextBlock = ({ block, isEditing = false }: TextBlockProps) => {
  const { content } = block;

  // Função para renderizar HTML de forma segura
  const renderHtml = (html: string) => {
    return { __html: html };
  };

  // Classes de alinhamento
  const getAlignmentClass = (alignment?: string) => {
    switch (alignment) {
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-right';
      default:
        return 'text-left';
    }
  };

  // Classes de background
  const getBackgroundClass = (backgroundColor?: string) => {
    switch (backgroundColor) {
      case 'gray':
        return 'bg-gray-light/30';
      case 'blue':
        return 'bg-blue-50';
      case 'white':
        return 'bg-white';
      default:
        return 'bg-white';
    }
  };

  return (
    <section className={`py-12 md:py-16 ${getBackgroundClass(content.background_color)}`}>
      <div className="container-custom">
        <div className={`max-w-4xl mx-auto ${getAlignmentClass(content.alignment)}`}>
          {/* Title */}
          {content.title && (
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-navy-deep mb-6">
              {content.title}
            </h2>
          )}

          {/* Content */}
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={renderHtml(content.content)}
          />
        </div>
      </div>

      {/* Editing indicator */}
      {isEditing && (
        <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium z-40">
          Text Block
        </div>
      )}
    </section>
  );
};

export default TextBlock;

