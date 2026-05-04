import { useEffect, useRef, useState } from 'react';
import { getDOMPurify } from '@/lib/dompurify-wrapper';

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
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!containerRef.current || !html || !isClient) return;

    // Importar DOMPurify usando wrapper que funciona no browser
    getDOMPurify().then((DOMPurify) => {
      // Configurar DOMPurify com whitelist de tags e atributos permitidos
      const cleanHTML = DOMPurify.default.sanitize(html, {
        ALLOWED_TAGS: [
          'p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
          'ul', 'ol', 'li', 'a', 'img', 'blockquote', 'code', 'pre', 'span', 'div',
          'table', 'thead', 'tbody', 'tr', 'th', 'td', 'hr', 'iframe'
        ],
        ALLOWED_ATTR: [
          'href', 'title', 'alt', 'src', 'width', 'height', 'class', 'id',
          'target', 'rel', 'colspan', 'rowspan', 'scope',
          'allowfullscreen', 'frameborder', 'allow', 'referrerpolicy', 'loading', 'scrolling'
        ],
        ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|data):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
        ADD_ATTR: ['target'], // Permitir target para links externos
        ADD_TAGS: [],
        KEEP_CONTENT: true,
        RETURN_DOM: false,
        RETURN_DOM_FRAGMENT: false,
        RETURN_TRUSTED_TYPE: false,
        FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input', 'button'],
        FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur'],
      });

      // Inserir HTML sanitizado
      containerRef.current.innerHTML = cleanHTML;

      // Whitelist de iframes: apenas YouTube e Vimeo são permitidos
      const allowedIframeSrc = /^https:\/\/(www\.)?(youtube\.com\/embed\/|youtube-nocookie\.com\/embed\/|player\.vimeo\.com\/video\/)/;
      const iframes = containerRef.current.querySelectorAll('iframe');
      iframes.forEach((iframe) => {
        const src = iframe.getAttribute('src') || '';
        if (!allowedIframeSrc.test(src)) {
          iframe.remove();
          return;
        }
        // Garantir atributos seguros
        iframe.setAttribute('loading', 'lazy');
        iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
        iframe.setAttribute('scrolling', 'no');
        if (!iframe.getAttribute('allow')) {
          iframe.setAttribute('allow', 'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
        }
        iframe.setAttribute('allowfullscreen', '');
      });

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
    }).catch((error) => {
      console.error('Erro ao carregar DOMPurify:', error);
      // Fallback: inserir HTML sem sanitização (não recomendado, mas melhor que quebrar)
      if (containerRef.current) {
        containerRef.current.innerHTML = html;
      }
    });
  }, [html, isClient]);

  return <div ref={containerRef} className={className} />;
};

export default SanitizedHTML;

