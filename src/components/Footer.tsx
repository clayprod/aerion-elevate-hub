import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Instagram, MessageCircle, Linkedin } from "lucide-react";
import logo from "@/assets/logo-aerion.png";
import CookieManager from "./CookieManager";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { settings } = useSiteSettings();

  // Helper function to format WhatsApp number for URL
  const formatWhatsAppUrl = (phone: string) => {
    if (!phone) return "";
    const cleaned = phone.replace(/\D/g, "");
    return `https://wa.me/${cleaned}`;
  };

  return (
    <footer className="bg-navy-deep text-white">
      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Logo and Tagline */}
          <div className="col-span-1 md:col-span-1">
            <img
              src={logo}
              alt="Aerion Technologies"
              width={200}
              height={56}
              className="h-12 md:h-14 w-auto mb-4 brightness-0 invert"
            />
            <p className="text-gray-medium text-sm leading-relaxed">
              Distribuindo o futuro da tecnologia aérea no Brasil
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="font-heading font-bold text-lg mb-4">Links Rápidos</h2>
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
            <h2 className="font-heading font-bold text-lg mb-4">Soluções</h2>
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
            <h2 className="font-heading font-bold text-lg mb-4">Contato</h2>
            <div className="flex flex-col space-y-3">
              {settings.contact_phone && (
                <div className="flex items-center space-x-3 text-gray-medium text-sm">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span>{settings.contact_phone}</span>
                </div>
              )}
              {settings.contact_whatsapp && (
                <a
                  href={formatWhatsAppUrl(settings.contact_whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-gray-medium hover:text-blue-light transition-colors text-sm"
                >
                  <MessageCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{settings.contact_whatsapp} (WhatsApp)</span>
                </a>
              )}
              {settings.contact_email && (
                <a
                  href={`mailto:${settings.contact_email}`}
                  className="flex items-center space-x-3 text-gray-medium hover:text-blue-light transition-colors text-sm"
                >
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <span>{settings.contact_email}</span>
                </a>
              )}
              {(settings.contact_address_line1 || settings.contact_address_line2 || settings.contact_address_line3) && (
                <div className="flex items-start space-x-3 text-gray-medium text-sm">
                  <MapPin className="h-4 w-4 flex-shrink-0 mt-1" />
                  <span>
                    {settings.contact_address_line1 && <>{settings.contact_address_line1}<br /></>}
                    {settings.contact_address_line2 && <>{settings.contact_address_line2}<br /></>}
                    {settings.contact_address_line3 && <>{settings.contact_address_line3}</>}
                    {settings.contact_zipcode && <><br />{settings.contact_zipcode}</>}
                  </span>
                </div>
              )}
              {settings.instagram_url && (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-gray-medium hover:text-blue-light transition-colors text-sm"
                >
                  <Instagram className="h-4 w-4 flex-shrink-0" />
                  <span>{settings.instagram_handle || settings.instagram_url}</span>
                </a>
              )}
              {settings.linkedin_url && (
                <a
                  href={settings.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-gray-medium hover:text-blue-light transition-colors text-sm"
                >
                  <Linkedin className="h-4 w-4 flex-shrink-0" />
                  <span>{settings.linkedin_handle || settings.linkedin_url}</span>
                </a>
              )}
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
