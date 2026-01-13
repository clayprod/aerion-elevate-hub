import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import MobileFloatingCTA from "@/components/MobileFloatingCTA";
import { SEOHead } from "@/components/SEO/SEOHead";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <SEOHead
        title="Página não encontrada (404) | Aerion Technologies"
        description="A página que você está procurando não foi encontrada. Retorne à página inicial ou explore nossos produtos e soluções em drones profissionais."
        canonical="https://aerion.com.br"
        ogType="website"
      />
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-gray-600">Oops! Page not found</p>
        <a href="/" className="text-blue-500 underline hover:text-blue-700">
          Return to Home
        </a>
      </div>
      <MobileFloatingCTA />
    </div>
  );
};

export default NotFound;
