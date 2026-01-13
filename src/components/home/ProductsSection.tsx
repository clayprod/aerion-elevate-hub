import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AutelLogo } from "@/components/AutelLogo";
import { ArrowRight } from "lucide-react";

interface Product {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  description: string;
  features: string[] | null;
  image_url: string | null;
  order_index: number | null;
}

const ProductsSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("active", true)
        .order("order_index", { ascending: true })
        .limit(3);

      if (error) throw error;

      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-12 md:py-16 bg-gray-light/30">
        <div className="container-custom">
          <div className="text-center py-12">
            <p className="text-gray-500">Carregando produtos...</p>
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }
  return (
    <section className="py-12 md:py-16 bg-gray-light/30">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-6">
          <div className="mb-4">
            <AutelLogo 
              className="h-10 md:h-12 w-auto" 
              textFallback="Conheça os Produtos Autel"
            />
          </div>
          <p className="text-lg md:text-xl text-gray-dark max-w-3xl mx-auto">
            Tecnologia de ponta que transforma operações enterprise em resultados mensuráveis
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {products.map((product, index) => (
            <Card
              key={product.id}
              className="group hover:shadow-xl transition-all duration-300 overflow-hidden animate-fade-in bg-white border-2"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Link to={`/produtos/${product.slug}`} className="block">
                {/* Product Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={product.image_url || "/images/placeholder-product.png"}
                    alt={product.name}
                    width={400}
                    height={192}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    style={{ aspectRatio: '400 / 192' }}
                    onError={(e) => {
                      // Fallback to gradient background if image fails to load
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling!.style.display = 'flex';
                    }}
                  />
                  <div className="w-full h-full hidden items-center justify-center bg-gradient-accent">
                    <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 3L2 12h3v8h14v-8h3L12 3zm0 2.5L18.5 12H17v6h-4v-4h-2v4H7v-6H5.5L12 5.5z"/>
                    </svg>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="mb-4">
                    <h2 className="text-xl font-heading font-bold text-navy-deep mb-2 group-hover:text-blue-medium transition-colors">
                      {product.name}
                    </h2>
                    {product.short_description && (
                      <p className="text-sm font-heading font-semibold text-blue-medium">
                        {product.short_description}
                      </p>
                    )}
                  </div>

                  <p className="text-gray-dark mb-4 leading-relaxed text-sm">
                    {product.description}
                  </p>

                  {product.features && product.features.length > 0 && (
                    <div className="mb-4">
                      <h3 className="font-heading font-bold text-navy-deep mb-2 text-sm">
                        Especificações Principais:
                      </h3>
                      <ul className="space-y-1">
                        {product.features.slice(0, 2).map((spec, idx) => (
                          <li key={idx} className="flex items-start text-gray-dark text-xs">
                            <svg className="w-4 h-4 mr-2 flex-shrink-0 text-blue-medium mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {spec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="inline-flex items-center font-heading font-semibold text-blue-medium group-hover:translate-x-2 transition-transform text-sm">
                    Saber mais
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </div>
              </Link>
            </Card>
          ))}
        </div>

        {/* View All Products CTA */}
        <div className="text-center">
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-2 border-blue-medium text-blue-medium hover:bg-blue-medium hover:text-white font-heading font-semibold"
          >
            <Link to="/produtos">
              Ver Todos os Produtos
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
