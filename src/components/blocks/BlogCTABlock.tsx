import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { BlogCTABlock as BlogCTABlockType, BlockProps } from "@/types/blocks";

interface BlogCTABlockProps extends BlockProps<BlogCTABlockType> {
  // Props específicas do BlogCTABlock se necessário
}

const BlogCTABlock = ({ block, isEditing = false }: BlogCTABlockProps) => {
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

  return (
    <section className={`py-16 ${getBackgroundClass(content.background_color)}`}>
      <div className="container-custom text-center">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-navy-deep mb-4">
          {content.title}
        </h2>
        <p className="text-lg text-gray-dark mb-8 max-w-2xl mx-auto">
          {content.subtitle}
        </p>
        <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
          <Link to={content.button_link} className="flex items-center">
            {content.button_text}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>

      {/* Editing indicator */}
      {isEditing && (
        <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium z-40">
          Blog CTA Block
        </div>
      )}
    </section>
  );
};

export default BlogCTABlock;

