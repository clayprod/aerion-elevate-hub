import { useEffect, useRef } from 'react';
import DOMPurify from 'dompurify';

interface SanitizedHTMLProps {
  html: string;
  className?: string;
}

/**
 * Componente que renderiza HTML sanitizado de forma segura
 * Previne ataques XSS removendo scripts, event handlers e outros elementos perigosos
 */
export const SanitizedHTML: React.FC<SanitizedHTMLProps> = ({ html, className }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !html) return;

    // Configurar DOMPurify com whitelist de tags e atributos permitidos
    const cleanHTML = DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [
        'p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li', 'a', 'img', 'blockquote', 'code', 'pre', 'span', 'div',
        'table', 'thead', 'tbody', 'tr', 'th', 'td', 'hr'
      ],
      ALLOWED_ATTR: [
        'href', 'title', 'alt', 'src', 'width', 'height', 'class', 'id',
        'target', 'rel', 'colspan', 'rowspan', 'scope'
      ],
      ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|data):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
      ADD_ATTR: ['target'], // Permitir target para links externos
      ADD_TAGS: [],
      KEEP_CONTENT: true,
      RETURN_DOM: false,
      RETURN_DOM_FRAGMENT: false,
      RETURN_TRUSTED_TYPE: false,
      FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'button'],
      FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur'],
    });

    // Inserir HTML sanitizado
    containerRef.current.innerHTML = cleanHTML;

    // Adicionar rel="noopener noreferrer" a todos os links externos
    const links = containerRef.current.querySelectorAll('a[href^="http"]');
    links.forEach((link) => {
      if (!link.getAttribute('rel')) {
        link.setAttribute('rel', 'noopener noreferrer');
      }
      // Garantir que links externos abram em nova aba
      if (!link.getAttribute('target')) {
        link.setAttribute('target', '_blank');
      }
    });

    // Adicionar loading="lazy" a imagens
    const images = containerRef.current.querySelectorAll('img');
    images.forEach((img) => {
      if (!img.getAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
      }
    });
  }, [html]);

  return <div ref={containerRef} className={className} />;
};

export default SanitizedHTML;

