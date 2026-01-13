import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEOHead } from "@/components/SEO/SEOHead";
import MobileFloatingCTA from "@/components/MobileFloatingCTA";
import BlockRenderer from "@/components/home/BlockRenderer";
import { getKeywordsForRoute } from "@/data/keywords";

const Index = () => {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="Aerion Technologies | Drones Autel Profissionais no Brasil"
        description="Distribuidor oficial Autel no Brasil. Tecnologia de ponta em drones profissionais para Construção, Industrial, Segurança e Resgate com custo-benefício superior e suporte local."
        keywords={getKeywordsForRoute('/')}
        canonical="https://aerion.com.br"
      />
      <Header />
      
      <main>
        <BlockRenderer pageSlug="home" />
      </main>

      <Footer />
      <MobileFloatingCTA />
    </div>
  );
};

export default Index;
