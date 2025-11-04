import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AutelLogo } from "../AutelLogo";
import { ArrowRight } from "lucide-react";
import { ProductsBlock as ProductsBlockType, BlockProps } from "@/types/blocks";
import { useProducts } from "@/hooks/useProducts";

interface ProductsBlockProps extends BlockProps<ProductsBlockType> {
  // Props específicas do ProductsBlock se necessário
}

const ProductsBlock = ({ block, isEditing = false }: ProductsBlockProps) => {
  const { content } = block;
  const { productFamilies, isLoading } = useProducts();

  // Filtrar produtos se necessário
  const displayProducts = content.show_all_products 
    ? productFamilies 
    : productFamilies.filter(family => 
        content.selected_products?.includes(family.id)
      );

  if (isLoading) {
    return (
      <section className="py-12 md:py-16 bg-gray-light/30">
        <div className="container-custom">
          <div className="text-center">
            <p className="text-gray-dark">Carregando produtos...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16 bg-gray-light/30">
      <div className="container-custom">
        {/* Section Header */}
        {(content.title || content.subtitle) && (
          <div className="text-center mb-6">
            {content.title && (
              <div className="mb-4">
                <AutelLogo 
                  className="h-10 md:h-12 w-auto" 
                  textFallback={content.title}
                />
              </div>
            )}
            {content.subtitle && (
              <p className="text-lg md:text-xl text-gray-dark max-w-3xl mx-auto">
                {content.subtitle}
              </p>
            )}
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {displayProducts.map((product, index) => (
            <Card
              key={product.id}
              className="group hover:shadow-xl transition-all duration-300 overflow-hidden animate-fade-in bg-white border-2"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Link to={`/produtos/${product.slug}`} className="block">
                {/* Product Image */}
                <div className="aspect-video bg-gray-100 overflow-hidden">
                  {product.fallback_image ? (
                    <img
                      src={product.fallback_image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
                      <div className="text-6xl text-blue-300">📦</div>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <h3 className="text-xl font-heading font-bold text-navy-deep mb-2 group-hover:text-action transition-colors">
                    {product.name}
                  </h3>
                  
                  <p className="text-gray-dark text-sm mb-4 line-clamp-3">
                    {product.short_description || product.description}
                  </p>

                  {/* Key Features */}
                  {product.key_features && product.key_features.length > 0 && (
                    <ul className="space-y-1 mb-4">
                      {product.key_features.slice(0, 3).map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start text-xs text-gray-dark">
                          <svg className="w-3 h-3 mr-2 flex-shrink-0 text-blue-medium mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* CTA Button */}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full group-hover:bg-action group-hover:text-action-foreground transition-colors"
                  >
                    Ver Detalhes
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </Link>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        {content.show_all_products && displayProducts.length > 3 && (
          <div className="text-center">
            <Button asChild size="lg" variant="outline">
              <Link to="/produtos" className="flex items-center">
                Ver Todos os Produtos
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        )}
      </div>

      {/* Editing indicator */}
      {isEditing && (
        <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium z-40">
          Products Block
        </div>
      )}
    </section>
  );
};

export default ProductsBlock;

