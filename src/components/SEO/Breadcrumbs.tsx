import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  path: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  const location = useLocation();

  // Gerar breadcrumbs automáticos baseados na rota se não fornecidos
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (items) return items;

    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Home', path: '/' }
    ];

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Mapear segmentos para labels amigáveis
      const labels: Record<string, string> = {
        'produtos': 'Produtos',
        'solucoes': 'Soluções',
        'sobre': 'Sobre',
        'blog': 'Blog',
        'contato': 'Contato',
        'evo-lite-enterprise': 'EVO Lite Enterprise',
        'evo-max-v2': 'EVO Max V2',
        'autel-alpha': 'Autel Alpha',
        'construcao': 'Construção e Topografia',
        'industrial': 'Inspeção Industrial',
        'seguranca': 'Segurança Pública',
        'resgate': 'Resgate e Emergências',
        'politica-privacidade': 'Política de Privacidade',
        'termos-uso': 'Termos de Uso',
      };

      const label = labels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
      breadcrumbs.push({ label, path: currentPath });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Gerar dados estruturados Schema.org BreadcrumbList
  useEffect(() => {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.label,
        item: `https://aerion.com.br${item.path}`,
      })),
    };

    // Remover script anterior se existir
    const existingScript = document.getElementById('breadcrumb-schema');
    if (existingScript) {
      existingScript.remove();
    }

    // Criar e adicionar script de dados estruturados
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'breadcrumb-schema';
    script.text = JSON.stringify(structuredData, null, 2);
    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.getElementById('breadcrumb-schema');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [breadcrumbs]);

  if (breadcrumbs.length <= 1) {
    return null; // Não mostrar breadcrumbs na home
  }

  return (
    <nav aria-label="Breadcrumb" className="container-custom py-4">
      <ol className="flex flex-wrap items-center gap-2 text-sm" itemScope itemType="https://schema.org/BreadcrumbList">
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;
          
          return (
            <li
              key={item.path}
              className="flex items-center"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              {isLast ? (
                <span className="text-gray-dark font-medium" itemProp="name">
                  {item.label}
                </span>
              ) : (
                <>
                  <Link
                    to={item.path}
                    className="text-blue-medium hover:text-blue-dark transition-colors"
                    itemProp="item"
                  >
                    <span itemProp="name">{item.label}</span>
                  </Link>
                  <meta itemProp="position" content={String(index + 1)} />
                  <span className="mx-2 text-gray-medium">/</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};


