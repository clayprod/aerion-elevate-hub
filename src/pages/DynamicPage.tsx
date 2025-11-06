import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEOHead } from "@/components/SEO/SEOHead";
import NotFound from "./NotFound";

const DynamicPage = () => {
  const { slug } = useParams();

  // Por enquanto, retorna NotFound para qualquer slug dinâmico
  // Isso pode ser expandido no futuro para buscar páginas do banco de dados
  return <NotFound />;
};

export default DynamicPage;
