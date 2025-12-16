import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";

interface Solution {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  description: string;
  image_url: string | null;
  order_index: number | null;
}

const SolutionsSection = () => {
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSolutions();
  }, []);

  const fetchSolutions = async () => {
    try {
      const { data, error } = await supabase
        .from("solutions")
        .select("*")
        .eq("active", true)
        .eq("featured", true)
        .order("order_index", { ascending: true })
        .limit(4);

      if (error) throw error;

      setSolutions(data || []);
    } catch (error) {
      console.error("Error fetching solutions:", error);
      setSolutions([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-12 md:py-16 bg-white">
        <div className="container-custom">
          <div className="text-center py-12">
            <p className="text-gray-500">Carregando soluções...</p>
          </div>
        </div>
      </section>
    );
  }

  if (solutions.length === 0) {
    return null;
  }
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-navy-deep mb-4">
            Soluções para Cada Segmento
          </h2>
          <p className="text-lg md:text-xl text-gray-dark max-w-3xl mx-auto">
            Descubra como nossa tecnologia pode transformar suas operações em diferentes setores e aplicações
          </p>
        </div>

        {/* Solutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {solutions.map((solution, index) => (
            <Card
              key={solution.id}
              className="group hover:shadow-xl transition-all duration-300 overflow-hidden animate-fade-in flex flex-col h-full"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Link to={`/solucoes/${solution.slug}`} className="block flex flex-col h-full">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={solution.image_url || "/images/placeholder-solution.png"}
                    alt={solution.name}
                    width={600}
                    height={256}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    style={{ aspectRatio: '600 / 256' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white text-lg font-semibold mb-2">
                      {solution.name}
                    </h3>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <p className="text-gray-dark leading-relaxed mb-4 flex-grow">
                    {solution.short_description || solution.description}
                  </p>
                  <div className="inline-flex items-center font-heading font-semibold text-blue-medium group-hover:translate-x-2 transition-transform">
                    Saiba mais
                    <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SolutionsSection;
