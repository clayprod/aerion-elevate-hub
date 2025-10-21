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

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;

      for (const item of items) {
        const element = document.getElementById(item.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
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
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <nav className="flex items-center justify-center py-4">
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            {items.map((item) => (
              <Button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                variant="ghost"
                className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  activeSection === item.id
                    ? 'bg-white text-navy-deep shadow-sm'
                    : 'text-gray-600 hover:text-navy-deep hover:bg-white/50'
                }`}
              >
                {item.label}
              </Button>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
};
