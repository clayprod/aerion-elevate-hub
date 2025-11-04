import React, { useEffect } from 'react';

interface OrganizationSchemaProps {
  name: string;
  url: string;
  logo: string;
  description: string;
  address?: {
    addressLocality: string;
    addressCountry: string;
  };
  contactPoint?: {
    contactType: string;
    telephone: string;
  };
}

interface ProductSchemaProps {
  name: string;
  description: string;
  brand: string;
  sku: string;
  image?: string;
  offers?: {
    availability: string;
    priceCurrency: string;
    seller: string;
  };
}

interface BreadcrumbSchemaProps {
  items: Array<{
    name: string;
    url: string;
  }>;
}

interface FAQSchemaProps {
  questions: Array<{
    question: string;
    answer: string;
  }>;
}

export const OrganizationSchema: React.FC<OrganizationSchemaProps> = ({
  name,
  url,
  logo,
  description,
  address,
  contactPoint,
}) => {
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name,
      url,
      logo: `https://aerion.com.br${logo}`,
      description,
      ...(address && {
        address: {
          "@type": "PostalAddress",
          addressLocality: address.addressLocality,
          addressCountry: address.addressCountry,
        },
      }),
      ...(contactPoint && {
        contactPoint: {
          "@type": "ContactPoint",
          contactType: contactPoint.contactType,
          telephone: contactPoint.telephone,
        },
      }),
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'organization-schema';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      const existingScript = document.getElementById('organization-schema');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [name, url, logo, description, address, contactPoint]);

  return null;
};

export const ProductSchema: React.FC<ProductSchemaProps> = ({
  name,
  description,
  brand,
  sku,
  image,
  offers,
}) => {
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Product",
      name,
      description,
      brand: {
        "@type": "Brand",
        name: brand,
      },
      sku,
      ...(image && {
        image: `https://aerion.com.br${image}`,
      }),
      ...(offers && {
        offers: {
          "@type": "Offer",
          availability: offers.availability,
          priceCurrency: offers.priceCurrency,
          seller: {
            "@type": "Organization",
            name: offers.seller,
          },
        },
      }),
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'product-schema';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      const existingScript = document.getElementById('product-schema');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [name, description, brand, sku, image, offers]);

  return null;
};

export const BreadcrumbSchema: React.FC<BreadcrumbSchemaProps> = ({ items }) => {
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'breadcrumb-schema';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      const existingScript = document.getElementById('breadcrumb-schema');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [items]);

  return null;
};

export const FAQSchema: React.FC<FAQSchemaProps> = ({ questions }) => {
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: questions.map((qa) => ({
        "@type": "Question",
        name: qa.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: qa.answer,
        },
      })),
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'faq-schema';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      const existingScript = document.getElementById('faq-schema');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [questions]);

  return null;
};

