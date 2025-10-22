import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface MenuItem {
  id: string;
  label: string;
}

interface ProductStickyMenuProps {
  items: MenuItem[];
}

export const ProductStickyMenu: React.FC<ProductStickyMenuProps> = ({ items }) => {
  const [activeSection, setActiveSection] = useState<string>('');
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      // Check if we've scrolled past the ProductHeader section completely
      const productHeader = document.querySelector('section');
      if (productHeader) {
        const productHeaderBottom = productHeader.offsetTop + productHeader.offsetHeight;
        const scrollPosition = window.scrollY;
        
        // Only show menu when we've scrolled completely past the product header
        setIsVisible(scrollPosition > productHeaderBottom + 50);
      }

      // Update active section - more precise detection
      const scrollPosition = window.scrollY + 200; // Increased offset for better detection

      for (const item of items) {
        const element = document.getElementById(item.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          // Check if the section is in view with some tolerance
          if (scrollPosition >= offsetTop - 100 && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener('scroll', handleScroll);
  }, [items]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 180; // Ajustado para a nova posição do menu (top-24 = 96px + padding)
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      // Set active section immediately when clicked
      setActiveSection(sectionId);

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="sticky top-24 z-30 bg-gray-light/50 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <nav className="flex items-center justify-center py-2">
          {/* Desktop: Centered container */}
          <div className="hidden md:flex items-center bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {items.map((item, index) => (
              <React.Fragment key={item.id}>
                <button
                  onClick={() => scrollToSection(item.id)}
                  className={`px-5 py-2 text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    activeSection === item.id
                      ? 'bg-navy-deep text-white'
                      : 'text-gray-600 hover:text-navy-deep hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </button>
                {index < items.length - 1 && (
                  <div className="w-px h-5 bg-gray-200"></div>
                )}
              </React.Fragment>
            ))}
          </div>
          
          {/* Mobile: Scrollable horizontal menu */}
          <div className="md:hidden w-full">
            <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto scrollbar-hide">
              <style jsx>{`
                .scrollbar-hide {
                  -ms-overflow-style: none;
                  scrollbar-width: none;
                }
                .scrollbar-hide::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              {items.map((item, index) => (
                <React.Fragment key={item.id}>
                  <button
                    onClick={() => scrollToSection(item.id)}
                    className={`px-4 py-2 text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                      activeSection === item.id
                        ? 'bg-navy-deep text-white'
                        : 'text-gray-600 hover:text-navy-deep hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                  </button>
                  {index < items.length - 1 && (
                    <div className="w-px h-5 bg-gray-200 flex-shrink-0"></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};
