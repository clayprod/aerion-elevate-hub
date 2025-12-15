import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import HeroSection from "./HeroSection";
import ProductsSection from "./ProductsSection";
import SolutionsSection from "./SolutionsSection";
import WhyAerionSection from "./WhyAerionSection";
import ContactSection from "./ContactSection";
import DynamicHeroSection from "./DynamicHeroSection";
import DynamicWhyAerionSection from "./DynamicWhyAerionSection";
import DynamicContactSection from "./DynamicContactSection";

interface PageBlock {
  id: string;
  page_slug: string;
  block_type: string;
  block_data: any;
  order_index: number;
  active: boolean;
}

interface BlockRendererProps {
  pageSlug?: string;
}

const BlockRenderer = ({ pageSlug = "home" }: BlockRendererProps) => {
  const { data: blocks, isLoading } = useQuery({
    queryKey: ["page-blocks", pageSlug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("page_blocks")
        .select("*")
        .eq("page_slug", pageSlug)
        .eq("active", true)
        .order("order_index", { ascending: true });

      if (error) throw error;
      return data as PageBlock[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-medium border-r-transparent"></div>
          <p className="mt-4 text-gray-dark">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não houver blocos no banco, usar componentes padrão
  if (!blocks || blocks.length === 0) {
    return (
      <>
        <HeroSection />
        <ProductsSection />
        <SolutionsSection />
        <WhyAerionSection />
        <ContactSection />
      </>
    );
  }

  return (
    <>
      {blocks.map((block) => {
        switch (block.block_type) {
          case "hero":
            return (
              <DynamicHeroSection
                key={block.id}
                data={block.block_data}
              />
            );
          case "products":
            return <ProductsSection key={block.id} />;
          case "solutions":
            return <SolutionsSection key={block.id} />;
          case "why_aerion":
            return (
              <DynamicWhyAerionSection
                key={block.id}
                data={block.block_data}
              />
            );
          case "contact":
            return (
              <DynamicContactSection
                key={block.id}
                data={block.block_data}
              />
            );
          default:
            return null;
        }
      })}
    </>
  );
};

export default BlockRenderer;

