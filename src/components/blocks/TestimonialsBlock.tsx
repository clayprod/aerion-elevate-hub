import { Card } from "@/components/ui/card";
import { TestimonialsBlock as TestimonialsBlockType, BlockProps } from "@/types/blocks";
import { Star } from "lucide-react";

interface TestimonialsBlockProps extends BlockProps<TestimonialsBlockType> {
  // Props específicas do TestimonialsBlock se necessário
}

const TestimonialsBlock = ({ block, isEditing = false }: TestimonialsBlockProps) => {
  const { content } = block;

  // Função para renderizar estrelas
  const renderStars = (rating?: number) => {
    if (!rating) return null;
    
    return (
      <div className="flex items-center space-x-1 mb-3">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`w-4 h-4 ${
              index < rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="py-12 md:py-16 bg-gray-light/30">
      <div className="container-custom">
        {/* Section Header */}
        {(content.title || content.subtitle) && (
          <div className="text-center mb-12">
            {content.title && (
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-navy-deep mb-4">
                {content.title}
              </h2>
            )}
            {content.subtitle && (
              <p className="text-lg text-gray-dark max-w-2xl mx-auto">
                {content.subtitle}
              </p>
            )}
          </div>
        )}

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="p-6 hover:shadow-lg transition-all duration-300 bg-white"
            >
              {/* Rating */}
              {renderStars(testimonial.rating)}

              {/* Content */}
              <blockquote className="text-gray-dark mb-6 leading-relaxed">
                "{testimonial.content}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-medium to-blue-dark flex items-center justify-center text-white font-semibold mr-4 flex-shrink-0">
                  {testimonial.avatar_url ? (
                    <img
                      src={testimonial.avatar_url}
                      alt={testimonial.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    testimonial.name.charAt(0).toUpperCase()
                  )}
                </div>

                {/* Author Info */}
                <div>
                  <h4 className="font-heading font-semibold text-navy-deep">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-dark">
                    {testimonial.role && `${testimonial.role} at `}
                    <span className="font-medium">{testimonial.company}</span>
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Editing indicator */}
      {isEditing && (
        <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium z-40">
          Testimonials Block
        </div>
      )}
    </section>
  );
};

export default TestimonialsBlock;

