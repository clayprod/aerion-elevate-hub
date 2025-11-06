import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEOHead } from "@/components/SEO/SEOHead";

const AdminProductFamilies = () => {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="Admin - Famílias de Produtos | Aerion Technologies"
        description="Painel administrativo - Gerenciamento de famílias de produtos"
      />
      <Header />
      
      <main className="pt-28 pb-20">
        <div className="container-custom">
          <h1 className="text-3xl font-heading font-bold mb-4">
            Gerenciamento de Famílias de Produtos
          </h1>
          <p>Em desenvolvimento</p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminProductFamilies;
