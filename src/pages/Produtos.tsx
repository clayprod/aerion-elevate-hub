import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileFloatingCTA from "@/components/MobileFloatingCTA";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AutelLogo } from "@/components/AutelLogo";
import { ArrowRight } from "lucide-react";

const products = [
  {
    id: "evo-lite-enterprise",
    name: "EVO Lite Enterprise",
    tagline: "Compacto, Portátil, Eficiente",
    description: "Plataforma compacta oferecida em duas configurações dedicadas: 640T (câmera térmica 640×512 + sensor visível 48 MP) ou 6K (sensor 1\" de 20 MP). Garante 40 minutos de voo, transmissão até 12 km (FCC) / 6 km (CE) e detecção tridirecional até 30 m para inspeções ágeis e missões de segurança.",
    keySpecs: [
      "Configurações 640T (térmica + visível) ou 6K (sensor 1\" 20 MP)",
      "Autonomia de 40 min e resistência a ventos de 10.7 m/s",
      "Transmissão até 12 km (FCC) / 6 km (CE)",
      "Detecção tridirecional 0.2-30 m com GNSS GPS/BDS/GLONASS",
    ],
    applications: ["Construção", "Topografia", "Mapeamento"],
    image: "/images/products/evo_lite/640t/1.png"
  },
  {
    id: "evo-max-v2",
    name: "EVO Max V2",
    tagline: "Precisão e Potência em Um Só Drone",
    description: "Sistema de câmeras triplas com navegação Autonomy Engine e SLAM 3D que dispensa georreferenciamento e garante voo seguro em ambientes complexos. A versão 4N combina visão térmica 640×512 + Starlight, enquanto a 4T traz zoom óptico 2.7-10x com híbrido até 160x.",
    keySpecs: [
      "Navegação SLAM + autonomia de voo sem GNSS (Autonomy Engine)",
      "Câmeras triplas: 4N (Visível + Térmica + Starlight) / 4T (Visível + Térmica + Zoom)",
      "Transmissão até 15 km (FCC) / 8 km (SRRC/CE)",
      "Autonomia de 42 min e resistência IP43 com detecção 720°",
    ],
    applications: ["Industrial", "Energia", "Inspeções"],
    image: "/images/products/evo_max/4t/1.png"
  },
  {
    id: "autel-alpha",
    name: "Autel Alpha",
    tagline: "Resistência e Alcance para Operações Críticas",
    description: "Drone industrial IP55 com gimbal DG-L35T quíntuplo (duas térmicas, câmera wide, zoom óptico 35x e laser). Oferece 40 minutos de voo, alcance de até 30 km, navegação Autonomy Engine com sensores 360° + radar 60G/24G e baterias hot swap.",
    keySpecs: [
      "Gimbal DG-L35T: zoom óptico 35x, térmicas 13/45 mm e laser 2000 m",
      "Alcance de voo até 30 km (carbono) e 40 min de autonomia",
      "Navegação Autonomy Engine com sensores visuais 360° + radar 60G/24G",
      "Smart Controller V3 7.9\" 2000 nits e baterias hot swap LiPo 6S",
    ],
    applications: ["Segurança", "Resgate", "Operações Críticas"],
    image: "/images/products/alpha/1.png"
  },
];

const Produtos = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-28 pb-20">
        <div className="container-custom">
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="mb-4">
              <AutelLogo 
                className="h-10 md:h-12 w-auto" 
                textFallback="Produtos Autel para Sua Operação"
              />
            </div>
            <p className="text-lg md:text-xl text-gray-dark max-w-3xl mx-auto">
              Tecnologia de ponta que transforma operações enterprise em resultados mensuráveis
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <Card
                key={product.id}
                className="group hover:shadow-xl transition-all duration-300 overflow-hidden animate-fade-in bg-white border-2"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Link to={`/produtos/${product.id}`} className="block">
                  {/* Product Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        // Fallback to gradient background if image fails to load
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling!.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full hidden items-center justify-center bg-gradient-accent">
                      <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 3L2 12h3v8h14v-8h3L12 3zm0 2.5L18.5 12H17v6h-4v-4h-2v4H7v-6H5.5L12 5.5z"/>
                      </svg>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="mb-4">
                      <h2 className="text-xl font-heading font-bold text-navy-deep mb-2 group-hover:text-blue-medium transition-colors">
                        {product.name}
                      </h2>
                      <p className="text-sm font-heading font-semibold text-blue-medium">
                        {product.tagline}
                      </p>
                    </div>

                    <p className="text-gray-dark mb-4 leading-relaxed text-sm">
                      {product.description}
                    </p>

                    <div className="mb-4">
                      <h3 className="font-heading font-bold text-navy-deep mb-2 text-sm">
                        Especificações Principais:
                      </h3>
                      <ul className="space-y-1">
                        {product.keySpecs.slice(0, 2).map((spec) => (
                          <li key={spec} className="flex items-start text-gray-dark text-xs">
                            <svg className="w-4 h-4 mr-2 flex-shrink-0 text-blue-medium mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {spec}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mb-4">
                      <h3 className="font-heading font-bold text-navy-deep mb-2 text-sm">
                        Aplicações:
                      </h3>
                      <div className="flex flex-wrap gap-1">
                        {product.applications.slice(0, 2).map((app) => (
                          <span
                            key={app}
                            className="px-2 py-1 bg-blue-medium/10 text-blue-medium rounded-full text-xs font-heading font-semibold"
                          >
                            {app}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="inline-flex items-center font-heading font-semibold text-blue-medium group-hover:translate-x-2 transition-transform text-sm">
                      Saber mais
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </div>
                  </div>
                </Link>
              </Card>
            ))}
          </div>

        </div>
      </main>

      <Footer />
      <MobileFloatingCTA />
    </div>
  );
};

export default Produtos;
