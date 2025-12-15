import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEOHead } from "@/components/SEO/SEOHead";
import MobileFloatingCTA from "@/components/MobileFloatingCTA";
import BlockRenderer from "@/components/home/BlockRenderer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="Aerion Technologies | Drones Autel Profissionais no Brasil"
        description="Distribuidor oficial Autel no Brasil. Tecnologia de ponta em drones profissionais para Construção, Industrial, Segurança e Resgate com custo-benefício superior e suporte local."
        keywords="drones profissionais, Autel, tecnologia aérea, drone topografia, inspeção industrial, segurança pública, drone resgate"
        canonical="https://aerion.com.br"
      />
      <Header />
      
      <main className="pt-20">
        <BlockRenderer pageSlug="home" />
      </main>

      <Footer />
      <MobileFloatingCTA />
    </div>
  );
};

export default Index;
