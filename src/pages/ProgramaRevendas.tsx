import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEOHead } from "@/components/SEO/SEOHead";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ProgramaRevendas = () => {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="Programa de Revendas | Aerion Technologies"
        description="Torne-se um revendedor oficial Autel no Brasil. Parcerias estratégicas com suporte técnico e comercial especializado."
        keywords="programa revendas, revendedor autel, parcerias comerciais"
        canonical="https://aerion.com.br/programa-revendas"
      />
      <Header />
      
      <main className="pt-28 pb-20">
        <section className="bg-gradient-primary py-20 text-white">
          <div className="container-custom text-center">
            <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Programa de Revendas
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Em breve
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ProgramaRevendas;
