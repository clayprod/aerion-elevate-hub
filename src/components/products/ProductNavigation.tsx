import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Info, 
  Star, 
  Camera, 
  Play, 
  Settings, 
  Target, 
  Download,
  Menu,
  X
} from 'lucide-react';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface ProductNavigationProps {
  sections: NavigationItem[];
}

export const ProductNavigation: React.FC<ProductNavigationProps> = ({ sections }) => {
  const [activeSection, setActiveSection] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setIsOpen(false);
  };

  const defaultSections: NavigationItem[] = [
    { id: 'product-info', label: 'Informações', icon: <Info className="w-4 h-4" /> },
    { id: 'key-features', label: 'Características', icon: <Star className="w-4 h-4" /> },
    { id: 'photo-gallery', label: 'Fotos', icon: <Camera className="w-4 h-4" /> },
    { id: 'video-gallery', label: 'Vídeos', icon: <Play className="w-4 h-4" /> },
    { id: 'technical-data', label: 'Especificações', icon: <Settings className="w-4 h-4" /> },
    { id: 'applications', label: 'Aplicações', icon: <Target className="w-4 h-4" /> },
    { id: 'downloads', label: 'Downloads', icon: <Download className="w-4 h-4" /> },
  ];

  const navigationSections = sections.length > 0 ? sections : defaultSections;

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden lg:block fixed left-0 top-1/2 transform -translate-y-1/2 z-40 ml-4">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-2">
          <nav className="flex flex-col space-y-1">
            {navigationSections.map((section) => (
              <Button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                variant={activeSection === section.id ? "default" : "ghost"}
                size="sm"
                className={`w-12 h-12 p-0 justify-center transition-all duration-200 ${
                  activeSection === section.id
                    ? 'bg-blue-medium text-white shadow-md'
                    : 'text-gray-600 hover:text-blue-medium hover:bg-blue-50'
                }`}
                title={section.label}
              >
                {section.icon}
              </Button>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40">
        <div className="bg-white rounded-full shadow-lg border border-gray-200 p-2">
          <Button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-full w-12 h-12 p-0 bg-blue-medium text-white hover:bg-blue-dark"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setIsOpen(false)}>
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-xl border border-gray-200 p-4 min-w-[280px]">
            <h3 className="text-lg font-semibold text-navy-deep mb-4 text-center">
              Navegação
            </h3>
            <nav className="space-y-2">
              {navigationSections.map((section) => (
                <Button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  variant={activeSection === section.id ? "default" : "ghost"}
                  className={`w-full justify-start gap-3 ${
                    activeSection === section.id
                      ? 'bg-blue-medium text-white'
                      : 'text-gray-600 hover:text-blue-medium hover:bg-blue-50'
                  }`}
                >
                  {section.icon}
                  {section.label}
                </Button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Progress Indicator */}
      <div className="hidden lg:block fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div 
          className="h-full bg-blue-medium transition-all duration-300 ease-out"
          style={{
            width: `${Math.min(100, (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100)}%`
          }}
        />
      </div>
    </>
  );
};