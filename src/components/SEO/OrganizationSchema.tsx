import { useEffect } from 'react';

interface OrganizationSchemaProps {
  name?: string;
  url?: string;
  logo?: string;
  description?: string;
  contactPoint?: {
    telephone?: string;
    contactType?: string;
    areaServed?: string;
  };
  sameAs?: string[];
}

export const OrganizationSchema: React.FC<OrganizationSchemaProps> = ({
  name = 'Aerion Technologies',
  url = 'https://aerion.com.br',
  logo = 'https://aerion.com.br/images/logos/logo-aerion.png',
  description = 'Distribuidor oficial Autel no Brasil. Tecnologia de ponta em drones profissionais para Construção, Industrial, Segurança e Resgate.',
  contactPoint,
  sameAs = [],
}) => {
  useEffect(() => {
    // Criar o objeto de dados estruturados para Organization
    const structuredData: any = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name,
      url,
      description,
      logo: {
        '@type': 'ImageObject',
        url: logo,
        // Dimensões recomendadas pelo Google: mínimo 112x112px, idealmente maior
        // O Google vai buscar essas informações automaticamente, mas podemos especificar
      },
    };

    // Adicionar contactPoint se fornecido
    if (contactPoint) {
      structuredData.contactPoint = {
        '@type': 'ContactPoint',
        telephone: contactPoint.telephone,
        contactType: contactPoint.contactType || 'Customer Service',
        areaServed: contactPoint.areaServed || 'BR',
      };
    }

    // Adicionar redes sociais se fornecidas
    if (sameAs.length > 0) {
      structuredData.sameAs = sameAs;
    }

    // Criar o elemento script
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'organization-schema';
    script.text = JSON.stringify(structuredData, null, 2);

    // Remover script anterior se existir
    const existingScript = document.getElementById('organization-schema');
    if (existingScript) {
      existingScript.remove();
    }

    // Adicionar o script ao head
    document.head.appendChild(script);

    // Cleanup: remover o script quando o componente desmontar
    return () => {
      const scriptToRemove = document.getElementById('organization-schema');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [name, url, logo, description, contactPoint, sameAs]);

  return null;
};

