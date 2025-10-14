import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/home/HeroSection";
import SolutionsSection from "@/components/home/SolutionsSection";
import ProductsSection from "@/components/home/ProductsSection";
import WhyAerionSection from "@/components/home/WhyAerionSection";
import ContactSection from "@/components/home/ContactSection";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <SolutionsSection />
        <ProductsSection />
        <WhyAerionSection />
        
        {/* Blog CTA Section */}
        <section className="py-16 bg-gray-light/30">
          <div className="container-custom text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-navy-deep mb-4">
              Fique por Dentro das Novidades
            </h2>
            <p className="text-lg text-gray-dark mb-8 max-w-2xl mx-auto">
              Insights, cases de sucesso e as últimas tendências em tecnologia aérea
            </p>
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link to="/blog">Ver Blog</Link>
            </Button>
          </div>
        </section>
        
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
