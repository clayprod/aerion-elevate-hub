import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { SolutionsBlock as SolutionsBlockType, BlockProps } from "@/types/blocks";
import { useVerticals } from "@/hooks/useVerticals";

interface SolutionsBlockProps extends BlockProps<SolutionsBlockType> {
  // Props específicas do SolutionsBlock se necessário
}

const SolutionsBlock = ({ block, isEditing = false }: SolutionsBlockProps) => {
  const { content } = block;
  const { verticals, isLoading } = useVerticals();

  // Filtrar soluções se necessário
  const displaySolutions = content.show_all_solutions 
    ? verticals 
    : verticals.filter(vertical => 
        content.selected_solutions?.includes(vertical.id)
      );

  if (isLoading) {
    return (
      <section className="py-12 md:py-16 bg-white">
        <div className="container-custom">
          <div className="text-center">
            <p className="text-gray-dark">Carregando soluções...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-navy-deep mb-4">
            {content.title}
          </h2>
          <p className="text-lg md:text-xl text-gray-dark max-w-3xl mx-auto">
            {content.subtitle}
          </p>
        </div>

        {/* Solutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {displaySolutions.map((solution, index) => (
            <Card
              key={solution.id}
              className="group hover:shadow-xl transition-all duration-300 overflow-hidden animate-fade-in flex flex-col h-full"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Link to={`/solucoes/${solution.slug}`} className="block flex flex-col h-full">
                {/* Solution Image */}
                <div className="aspect-video bg-gray-100 overflow-hidden">
                  {solution.image_url ? (
                    <img
                      src={solution.image_url}
                      alt={solution.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
                      {solution.icon ? (
                        <div className="text-6xl text-blue-300">{solution.icon}</div>
                      ) : (
                        <div className="text-6xl text-blue-300">💡</div>
                      )}
                    </div>
                  )}
                </div>

                {/* Solution Info */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-heading font-bold text-navy-deep mb-3 group-hover:text-action transition-colors">
                    {solution.name}
                  </h3>
                  
                  <p className="text-gray-dark text-sm mb-4 line-clamp-3 flex-grow">
                    {solution.short_description || solution.description}
                  </p>

                  {/* Benefits */}
                  {solution.benefits && solution.benefits.length > 0 && (
                    <ul className="space-y-1 mb-4">
                      {solution.benefits.slice(0, 2).map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="flex items-start text-xs text-gray-dark">
                          <svg className="w-3 h-3 mr-2 flex-shrink-0 text-blue-medium mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* CTA */}
                  <div className="mt-auto">
                    <span className="text-action text-sm font-semibold group-hover:underline">
                      Saiba mais →
                    </span>
                  </div>
                </div>
              </Link>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        {content.show_all_solutions && displaySolutions.length > 4 && (
          <div className="text-center mt-8">
            <Button asChild size="lg" variant="outline">
              <Link to="/solucoes" className="flex items-center">
                Ver Todas as Soluções
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        )}
      </div>

      {/* Editing indicator */}
      {isEditing && (
        <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium z-40">
          Solutions Block
        </div>
      )}
    </section>
  );
};

export default SolutionsBlock;

