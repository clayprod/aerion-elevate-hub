import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut } from "lucide-react";
import logo from "@/assets/logo-aerion.png";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);
  const location = useLocation();
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { 
      name: "Produtos", 
      path: "/produtos",
      dropdown: [
        { name: "EVO Lite Enterprise", path: "/produtos/evo-lite-enterprise", category: "Drones" },
        { name: "EVO Max V2", path: "/produtos/evo-max-v2", category: "Drones" },
        { name: "Autel Alpha", path: "/produtos/autel-alpha", category: "Drones" },
        { name: "Autel Mapper", path: "/produtos/autel-mapper", category: "Softwares" },
      ]
    },
    { 
      name: "Soluções", 
      path: "/solucoes",
      dropdown: [
        { name: "Segurança Pública", path: "/solucoes/seguranca" },
        { name: "Inspeção Industrial", path: "/solucoes/industrial" },
        { name: "Construção Civil", path: "/solucoes/construcao" },
        { name: "Resgate e Emergências", path: "/solucoes/resgate" },
      ]
    },
    { name: "Sobre", path: "/sobre" },
    { name: "Blog", path: "/blog" },
    { name: "Contato", path: "/contato" },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md" : "bg-white/95 backdrop-blur-sm"
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src={logo}
              alt="Aerion Technologies"
              width={200}
              height={56}
              className="h-12 md:h-14 w-auto"
              fetchPriority="high"
              loading="eager"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <div key={link.path} className="relative group">
                <Link
                  to={link.path}
                  className={`font-heading font-semibold text-sm transition-colors relative ${
                    location.pathname === link.path
                      ? "text-blue-medium"
                      : "text-gray-dark hover:text-blue-medium"
                  }`}
                >
                  {link.name}
                  <span
                    className={`absolute bottom-0 left-0 w-full h-0.5 bg-blue-medium transform origin-left transition-transform duration-300 ${
                      location.pathname === link.path
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
                
                {/* Dropdown Menu */}
                {link.dropdown && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-2">
                      {(() => {
                        const drones = link.dropdown.filter(item => item.category === "Drones");
                        const softwares = link.dropdown.filter(item => item.category === "Softwares");
                        
                        return (
                          <>
                            {drones.length > 0 && (
                              <>
                                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                  Drones
                                </div>
                                {drones.map((dropdownLink) => (
                                  <Link
                                    key={dropdownLink.path}
                                    to={dropdownLink.path}
                                    className="block px-4 py-2 text-sm text-gray-dark hover:text-blue-medium hover:bg-blue-medium/5 transition-colors"
                                  >
                                    {dropdownLink.name}
                                  </Link>
                                ))}
                              </>
                            )}
                            {softwares.length > 0 && (
                              <>
                                {drones.length > 0 && <div className="border-t border-gray-200 my-1" />}
                                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                  Softwares
                                </div>
                                {softwares.map((dropdownLink) => (
                                  <Link
                                    key={dropdownLink.path}
                                    to={dropdownLink.path}
                                    className="block px-4 py-2 text-sm text-gray-dark hover:text-blue-medium hover:bg-blue-medium/5 transition-colors"
                                  >
                                    {dropdownLink.name}
                                  </Link>
                                ))}
                              </>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {isAdmin && (
                  <Button asChild variant="outline">
                    <Link to="/admin/blog">Admin</Link>
                  </Button>
                )}
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sair</span>
                </Button>
              </>
            ) : (
              <Button
                asChild
                className="bg-action hover:bg-action/90 text-action-foreground font-heading font-semibold"
              >
                <Link to="/contato">Quero ser um Revendedor</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-dark hover:text-blue-medium transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-6 animate-fade-in">
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <div key={link.path}>
                  {link.dropdown ? (
                    <div>
                      <button
                        onClick={() => setOpenMobileDropdown(
                          openMobileDropdown === link.path ? null : link.path
                        )}
                        className={`font-heading font-semibold text-base py-2 w-full text-left flex items-center justify-between ${
                          location.pathname === link.path
                            ? "text-blue-medium"
                            : "text-gray-dark"
                        }`}
                      >
                        {link.name}
                        <svg
                          className={`w-4 h-4 transition-transform ${
                            openMobileDropdown === link.path ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {openMobileDropdown === link.path && (
                        <div className="pl-4 space-y-1 mt-2">
                          {(() => {
                            const drones = link.dropdown.filter(item => item.category === "Drones");
                            const softwares = link.dropdown.filter(item => item.category === "Softwares");
                            
                            return (
                              <>
                                {drones.length > 0 && (
                                  <>
                                    <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                      Drones
                                    </div>
                                    {drones.map((dropdownLink) => (
                                      <Link
                                        key={dropdownLink.path}
                                        to={dropdownLink.path}
                                        onClick={() => {
                                          setIsMobileMenuOpen(false);
                                          setOpenMobileDropdown(null);
                                        }}
                                        className="block py-2 text-sm text-gray-dark hover:text-blue-medium"
                                      >
                                        {dropdownLink.name}
                                      </Link>
                                    ))}
                                  </>
                                )}
                                {softwares.length > 0 && (
                                  <>
                                    {drones.length > 0 && <div className="border-t border-gray-200 my-1" />}
                                    <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                      Softwares
                                    </div>
                                    {softwares.map((dropdownLink) => (
                                      <Link
                                        key={dropdownLink.path}
                                        to={dropdownLink.path}
                                        onClick={() => {
                                          setIsMobileMenuOpen(false);
                                          setOpenMobileDropdown(null);
                                        }}
                                        className="block py-2 text-sm text-gray-dark hover:text-blue-medium"
                                      >
                                        {dropdownLink.name}
                                      </Link>
                                    ))}
                                  </>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`font-heading font-semibold text-base py-2 block ${
                        location.pathname === link.path
                          ? "text-blue-medium"
                          : "text-gray-dark"
                      }`}
                    >
                      {link.name}
                    </Link>
                  )}
                </div>
              ))}
              <Button
                asChild
                className="bg-action hover:bg-action/90 text-white font-heading font-semibold w-full mt-4"
              >
                <Link to="/contato" onClick={() => setIsMobileMenuOpen(false)}>
                  Quero ser um Revendedor
                </Link>
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
