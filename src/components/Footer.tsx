import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Instagram, MessageCircle } from "lucide-react";
import logo from "@/assets/logo-aerion.png";
import CookieManager from "./CookieManager";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy-deep text-white">
      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Logo and Tagline */}
          <div className="col-span-1 md:col-span-1">
            <img
              src={logo}
              alt="Aerion Technologies"
              className="h-12 md:h-14 w-auto mb-4 brightness-0 invert"
            />
            <p className="text-gray-medium text-sm leading-relaxed">
              Distribuindo o futuro da tecnologia aérea no Brasil
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-4">Links Rápidos</h4>
            <nav className="flex flex-col space-y-2">
              <Link
                to="/produtos"
                className="text-gray-medium hover:text-blue-light transition-colors text-sm"
              >
                Produtos
              </Link>
              <Link
                to="/solucoes"
                className="text-gray-medium hover:text-blue-light transition-colors text-sm"
              >
                Soluções
              </Link>
              <Link
                to="/blog"
                className="text-gray-medium hover:text-blue-light transition-colors text-sm"
              >
                Blog
              </Link>
              <Link
                to="/sobre"
                className="text-gray-medium hover:text-blue-light transition-colors text-sm"
              >
                Sobre
              </Link>
              <Link
                to="/contato"
                className="text-gray-medium hover:text-blue-light transition-colors text-sm"
              >
                Contato
              </Link>
            </nav>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-4">Soluções</h4>
            <nav className="flex flex-col space-y-2">
              <Link
                to="/solucoes/construcao"
                className="text-gray-medium hover:text-blue-light transition-colors text-sm"
              >
                Construção
              </Link>
              <Link
                to="/solucoes/industrial"
                className="text-gray-medium hover:text-blue-light transition-colors text-sm"
              >
                Industrial
              </Link>
              <Link
                to="/solucoes/seguranca"
                className="text-gray-medium hover:text-blue-light transition-colors text-sm"
              >
                Segurança
              </Link>
              <Link
                to="/solucoes/resgate"
                className="text-gray-medium hover:text-blue-light transition-colors text-sm"
              >
                Resgate
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-4">Contato</h4>
            <div className="flex flex-col space-y-3">
              <div className="flex items-center space-x-3 text-gray-medium text-sm">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>+55 11 5102-4229</span>
              </div>
              <a
                href="https://wa.me/5511934668839"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-gray-medium hover:text-blue-light transition-colors text-sm"
              >
                <MessageCircle className="h-4 w-4 flex-shrink-0" />
                <span>+55 11 93466-8839 (WhatsApp)</span>
              </a>
              <a
                href="mailto:comercial@aerion.com.br"
                className="flex items-center space-x-3 text-gray-medium hover:text-blue-light transition-colors text-sm"
              >
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span>comercial@aerion.com.br</span>
              </a>
              <div className="flex items-start space-x-3 text-gray-medium text-sm">
                <MapPin className="h-4 w-4 flex-shrink-0 mt-1" />
                <span>Edifício Itamaracá<br />R. Quintana 887, Cj. 111, 11º Andar<br />Brooklin Novo - SP, 04569-011</span>
              </div>
              <a
                href="https://instagram.com/aerion.technologies"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-gray-medium hover:text-blue-light transition-colors text-sm"
              >
                <Instagram className="h-4 w-4 flex-shrink-0" />
                <span>@aerion.technologies</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
          <div className="border-t border-blue-dark mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-medium text-sm">
              <p>© {currentYear} Aerion Technologies Ltda. Todos os direitos reservados.</p>
              <p className="mt-1">CNPJ: 61.217.015/0001-09</p>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4">
              <CookieManager />
              <div className="flex space-x-6">
                <a
                  href="/auth"
                  className="text-gray-medium hover:text-blue-light transition-colors text-sm"
                >
                  Administrador
                </a>
                <Link
                  to="/politica-privacidade"
                  className="text-gray-medium hover:text-blue-light transition-colors text-sm"
                >
                  Política de Privacidade
                </Link>
                <Link
                  to="/termos-uso"
                  className="text-gray-medium hover:text-blue-light transition-colors text-sm"
                >
                  Termos de Uso
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
