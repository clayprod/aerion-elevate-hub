import React, { useState, useEffect } from 'react';

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
      // Check if we've scrolled past the product description section
      const productDescription = document.getElementById('product-description');
      if (productDescription) {
        const productDescriptionBottom = productDescription.offsetTop + productDescription.offsetHeight;
        const scrollPosition = window.scrollY;
        
        setIsVisible(scrollPosition > productDescriptionBottom - 100);
      }

      // Update active section
      const scrollPosition = window.scrollY + 150;

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
      const headerOffset = 120;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

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
    <div className="sticky top-0 z-40 bg-gray-light/50 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <nav className="flex items-center justify-center py-3">
          <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {items.map((item, index) => (
              <React.Fragment key={item.id}>
                <button
                  onClick={() => scrollToSection(item.id)}
                  className={`px-6 py-3 text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    activeSection === item.id
                      ? 'bg-navy-deep text-white'
                      : 'text-gray-600 hover:text-navy-deep hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </button>
                {index < items.length - 1 && (
                  <div className="w-px h-6 bg-gray-200"></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
};
