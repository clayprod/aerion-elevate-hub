import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { CTABlock as CTABlockType, BlockProps } from "@/types/blocks";

interface CTABlockProps extends BlockProps<CTABlockType> {
  // Props específicas do CTABlock se necessário
}

const CTABlock = ({ block, isEditing = false }: CTABlockProps) => {
  const { content } = block;

  // Classes de background
  const getBackgroundClass = (backgroundColor?: string) => {
    switch (backgroundColor) {
      case 'gray':
        return 'bg-gray-light/30';
      case 'blue':
        return 'bg-blue-50';
      case 'dark':
        return 'bg-navy-deep';
      default:
        return 'bg-gray-light/30';
    }
  };

  // Classes de texto
  const getTextColorClass = (textColor?: string) => {
    switch (textColor) {
      case 'white':
        return 'text-white';
      case 'blue':
        return 'text-blue-dark';
      default:
        return 'text-navy-deep';
    }
  };

  // Variantes do botão
  const getButtonVariant = (variant?: string) => {
    switch (variant) {
      case 'secondary':
        return 'secondary';
      case 'outline':
        return 'outline';
      default:
        return 'default';
    }
  };

  return (
    <section className={`py-16 ${getBackgroundClass(content.background_color)}`}>
      <div className="container-custom text-center">
        <h2 className={`text-3xl md:text-4xl font-heading font-bold mb-4 ${getTextColorClass(content.text_color)}`}>
          {content.title}
        </h2>
        
        {content.description && (
          <p className={`text-lg mb-8 max-w-2xl mx-auto ${getTextColorClass(content.text_color)}`}>
            {content.description}
          </p>
        )}
        
        <Button 
          asChild 
          size="lg" 
          variant={getButtonVariant(content.button_variant)}
          className="bg-action hover:bg-action/90 text-action-foreground font-heading font-semibold text-base px-8 py-3 shadow-glow group rounded-xl transition-all duration-300 hover:shadow-xl"
        >
          <Link to={content.button_link} className="flex items-center">
            {content.button_text}
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </div>

      {/* Editing indicator */}
      {isEditing && (
        <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium z-40">
          CTA Block
        </div>
      )}
    </section>
  );
};

export default CTABlock;

