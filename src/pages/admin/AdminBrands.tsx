import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEOHead } from "@/components/SEO/SEOHead";

const AdminBrands = () => {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="Admin - Marcas | Aerion Technologies"
        description="Painel administrativo - Gerenciamento de marcas"
      />
      <Header />
      
      <main className="pt-28 pb-20">
        <div className="container-custom">
          <h1 className="text-3xl font-heading font-bold mb-4">
            Gerenciamento de Marcas
          </h1>
          <p>Em desenvolvimento</p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminBrands;
