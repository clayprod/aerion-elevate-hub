import { useEffect } from 'react';

interface ProductSchemaProps {
  name: string;
  description: string;
  brand: string;
  sku: string;
  image: string;
  offers: {
    availability: string;
    priceCurrency: string;
    seller: string;
  };
}

export const ProductSchema: React.FC<ProductSchemaProps> = ({
  name,
  description,
  brand,
  sku,
  image,
  offers,
}) => {
  useEffect(() => {
    // Criar o objeto de dados estruturados
    const structuredData = {
      '@context': 'https://schema.org/',
      '@type': 'Product',
      name,
      description,
      brand: {
        '@type': 'Brand',
        name: brand,
      },
      sku,
      image,
      offers: {
        '@type': 'Offer',
        availability: offers.availability,
        priceCurrency: offers.priceCurrency,
        seller: {
          '@type': 'Organization',
          name: offers.seller,
        },
      },
    };

    // Criar o elemento script
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'product-schema';
    script.text = JSON.stringify(structuredData, null, 2);

    // Remover script anterior se existir
    const existingScript = document.getElementById('product-schema');
    if (existingScript) {
      existingScript.remove();
    }

    // Adicionar o script ao head
    document.head.appendChild(script);

    // Cleanup: remover o script quando o componente desmontar
    return () => {
      const scriptToRemove = document.getElementById('product-schema');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [name, description, brand, sku, image, offers]);

  return null;
};
