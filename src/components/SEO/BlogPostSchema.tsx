import { useEffect } from 'react';

interface BlogPostSchemaProps {
  title: string;
  description: string;
  author: string;
  publishedDate: string;
  modifiedDate?: string;
  image?: string;
  url: string;
  organizationName?: string;
  organizationUrl?: string;
}

export const BlogPostSchema: React.FC<BlogPostSchemaProps> = ({
  title,
  description,
  author,
  publishedDate,
  modifiedDate,
  image,
  url,
  organizationName = 'Aerion Technologies',
  organizationUrl = 'https://aerion.com.br',
}) => {
  useEffect(() => {
    // Criar o objeto de dados estruturados para Article
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      description: description,
      image: image || `${organizationUrl}/images/logos/logo-aerion.png`,
      datePublished: publishedDate,
      dateModified: modifiedDate || publishedDate,
      author: {
        '@type': 'Person',
        name: author,
      },
      publisher: {
        '@type': 'Organization',
        name: organizationName,
        url: organizationUrl,
        logo: {
          '@type': 'ImageObject',
          url: `${organizationUrl}/images/logos/logo-aerion.png`,
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': url,
      },
      url: url,
    };

    // Criar o elemento script
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'blog-post-schema';
    script.text = JSON.stringify(structuredData, null, 2);

    // Remover script anterior se existir
    const existingScript = document.getElementById('blog-post-schema');
    if (existingScript) {
      existingScript.remove();
    }

    // Adicionar o script ao head
    document.head.appendChild(script);

    // Cleanup: remover o script quando o componente desmontar
    return () => {
      const scriptToRemove = document.getElementById('blog-post-schema');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [title, description, author, publishedDate, modifiedDate, image, url, organizationName, organizationUrl]);

  return null;
};

