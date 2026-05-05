import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Digite seu conteúdo aqui...",
  height = "300px"
}) => {
  const [ReactQuill, setReactQuill] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const quillRef = useRef<any>(null);
  const selectedVideoRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    const loadQuill = async () => {
      try {
        const quillModule = await import('react-quill');
        await import('react-quill/dist/quill.snow.css');
        setReactQuill(() => quillModule.default);
        setIsLoading(false);
      } catch (error) {
        console.error('Erro ao carregar React Quill:', error);
        setIsLoading(false);
      }
    };

    loadQuill();
  }, []);

  const toEmbedVideoUrl = useCallback((rawUrl: string) => {
    try {
      const url = new URL(rawUrl.trim());
      const host = url.hostname.replace('www.', '');

      if (host === 'youtube.com' || host === 'm.youtube.com') {
        const videoId = url.searchParams.get('v');
        if (videoId) return `https://www.youtube.com/embed/${videoId}`;
      }

      if (host === 'youtu.be') {
        const videoId = url.pathname.replace('/', '');
        if (videoId) return `https://www.youtube.com/embed/${videoId}`;
      }

      if (host === 'vimeo.com') {
        const videoId = url.pathname.split('/').filter(Boolean)[0];
        if (videoId) return `https://player.vimeo.com/video/${videoId}`;
      }

      return rawUrl;
    } catch {
      return rawUrl;
    }
  }, []);

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'align': [] }],
        ['blockquote', 'code-block'],
        ['link', 'image', 'video'],
        ['clean'],
      ],
    },
    clipboard: {
      matchVisual: false,
    },
  }), [toEmbedVideoUrl]);

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'bullet',
    'align',
    'blockquote', 'code-block',
    'link', 'image', 'video',
    'width', 'height',
  ];

  const normalizeVideoIframes = useCallback(() => {
    const editor = quillRef.current?.getEditor?.();
    if (!editor) return;

    const root = editor.root as HTMLElement;
    const iframes = root.querySelectorAll('iframe.ql-video');

    iframes.forEach((iframe) => {
      const src = iframe.getAttribute('src') || '';
      const embedSrc = toEmbedVideoUrl(src);
      if (src && embedSrc !== src) {
        iframe.setAttribute('src', embedSrc);
      }

      iframe.setAttribute('scrolling', 'no');
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('allowfullscreen', 'true');
      iframe.style.display = 'block';
      iframe.style.maxWidth = '100%';
      iframe.style.aspectRatio = '16 / 9';
      iframe.style.height = 'auto';
      iframe.style.overflow = 'hidden';
      iframe.style.border = '0';
    });
  }, [toEmbedVideoUrl]);

  useEffect(() => {
    const editor = quillRef.current?.getEditor?.();
    if (!editor) return;

    const root = editor.root as HTMLElement;

    const handleClick = (event: Event) => {
      const target = event.target as HTMLElement;
      if (target?.tagName === 'IFRAME' && target.classList.contains('ql-video')) {
        selectedVideoRef.current = target as HTMLIFrameElement;
      }
    };

    normalizeVideoIframes();
    root.addEventListener('click', handleClick);
    editor.on('text-change', normalizeVideoIframes);

    return () => {
      root.removeEventListener('click', handleClick);
      editor.off('text-change', normalizeVideoIframes);
    };
  }, [ReactQuill, normalizeVideoIframes]);

  const applyVideoWidth = (width: string) => {
    const iframe = selectedVideoRef.current;
    if (!iframe) return;

    if (width === 'auto') {
      iframe.style.width = '100%';
      iframe.removeAttribute('width');
      return;
    }

    iframe.setAttribute('width', width);
    iframe.style.width = width;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 border border-gray-300 rounded-md bg-gray-50">
        <p className="text-gray-500">Carregando editor...</p>
      </div>
    );
  }

  if (!ReactQuill) {
    // Fallback para textarea simples se React Quill não carregar
    return (
      <div className="mb-8">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full border border-gray-300 rounded-md p-3 bg-white focus:border-blue-medium focus:outline-none"
          style={{ minHeight: height }}
          rows={12}
        />
        <p className="text-sm text-gray-500 mt-2">
          Editor simples ativo. Use HTML para formatação: &lt;b&gt;negrito&lt;/b&gt;, &lt;i&gt;itálico&lt;/i&gt;, &lt;p&gt;parágrafo&lt;/p&gt;
        </p>
      </div>
    );
  }

  return (
    <div className="rich-text-editor mb-8 overflow-hidden prose prose-lg max-w-none">
      <div className="mb-3 flex flex-wrap items-center gap-2 text-sm">
        <span className="text-gray-500">Tamanho do video:</span>
        <button type="button" onClick={() => applyVideoWidth('50%')} className="rounded border border-gray-300 px-2 py-1 hover:bg-gray-50">50%</button>
        <button type="button" onClick={() => applyVideoWidth('75%')} className="rounded border border-gray-300 px-2 py-1 hover:bg-gray-50">75%</button>
        <button type="button" onClick={() => applyVideoWidth('100%')} className="rounded border border-gray-300 px-2 py-1 hover:bg-gray-50">100%</button>
        <button type="button" onClick={() => applyVideoWidth('auto')} className="rounded border border-gray-300 px-2 py-1 hover:bg-gray-50">Auto</button>
      </div>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{ height: height }}
        className="bg-white border border-gray-300 rounded-md"
      />
      <style>{`
        .rich-text-editor .ql-editor {
          min-height: ${height};
          font-family: 'Open Sans', sans-serif;
          font-size: 1.125rem; /* text-lg - 18px */
          line-height: 1.75; /* leading-relaxed */
          color: #374151; /* text-gray-700 */
          padding: 1.5rem;
          white-space: pre-wrap; /* whitespace-pre-wrap - preserva quebras de linha */
        }
        
        /* Tipografia base - correspondendo ao prose prose-lg */
        .rich-text-editor .ql-editor p {
          margin-top: 1.25em;
          margin-bottom: 1.25em;
          font-size: 1.125rem;
          line-height: 1.75;
          color: #374151;
        }
        
        /* Títulos - usando Montserrat como na publicação */
        .rich-text-editor .ql-editor h1 {
          font-family: 'Montserrat', sans-serif;
          font-size: 2.25rem; /* text-4xl */
          font-weight: 700;
          line-height: 1.2;
          color: hsl(var(--navy-deep));
          margin-top: 0;
          margin-bottom: 1rem;
        }
        
        .rich-text-editor .ql-editor h2 {
          font-family: 'Montserrat', sans-serif;
          font-size: 1.875rem; /* text-3xl */
          font-weight: 600;
          line-height: 1.2;
          color: hsl(var(--navy-deep));
          margin-top: 2em;
          margin-bottom: 1em;
        }
        
        .rich-text-editor .ql-editor h3 {
          font-family: 'Montserrat', sans-serif;
          font-size: 1.5rem; /* text-2xl */
          font-weight: 600;
          line-height: 1.3;
          color: hsl(var(--blue-medium));
          margin-top: 1.5em;
          margin-bottom: 0.75em;
        }
        
        .rich-text-editor .ql-editor h4 {
          font-family: 'Montserrat', sans-serif;
          font-size: 1.25rem; /* text-xl */
          font-weight: 600;
          line-height: 1.4;
          color: hsl(var(--navy-deep));
          margin-top: 1.25em;
          margin-bottom: 0.5em;
        }
        
        .rich-text-editor .ql-editor h5,
        .rich-text-editor .ql-editor h6 {
          font-family: 'Montserrat', sans-serif;
          font-size: 1.125rem;
          font-weight: 600;
          line-height: 1.5;
          color: hsl(var(--navy-deep));
          margin-top: 1em;
          margin-bottom: 0.5em;
        }
        
        /* Listas */
        .rich-text-editor .ql-editor ul,
        .rich-text-editor .ql-editor ol {
          margin-top: 1.25em;
          margin-bottom: 1.25em;
          padding-left: 1.625em;
        }
        
        .rich-text-editor .ql-editor li {
          margin-top: 0.5em;
          margin-bottom: 0.5em;
          padding-left: 0.375em;
        }
        
        .rich-text-editor .ql-editor ul > li {
          list-style-type: disc;
        }
        
        .rich-text-editor .ql-editor ol > li {
          list-style-type: decimal;
        }
        
        /* Links */
        .rich-text-editor .ql-editor a {
          color: hsl(var(--blue-medium));
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        
        .rich-text-editor .ql-editor a:hover {
          color: hsl(var(--blue-dark));
        }
        
        /* Blockquotes */
        .rich-text-editor .ql-editor blockquote {
          border-left: 4px solid hsl(var(--blue-medium));
          padding-left: 1em;
          margin: 1.5em 0;
          font-style: italic;
          color: #4b5563;
        }
        
        /* Code blocks */
        .rich-text-editor .ql-editor pre {
          background-color: #f3f4f6;
          border-radius: 0.375rem;
          padding: 1em;
          margin: 1.25em 0;
          overflow-x: auto;
          font-family: 'Courier New', monospace;
          font-size: 0.875em;
        }
        
        .rich-text-editor .ql-editor code {
          background-color: #f3f4f6;
          padding: 0.125em 0.375em;
          border-radius: 0.25rem;
          font-family: 'Courier New', monospace;
          font-size: 0.875em;
        }
        
        /* Imagens */
        .rich-text-editor .ql-editor img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1.5em 0;
        }

        /* Vídeos (YouTube/Vimeo embeds) */
        .rich-text-editor .ql-editor iframe.ql-video {
          display: block;
          max-width: 100%;
          aspect-ratio: 16 / 9;
          height: auto;
          border: 0;
          border-radius: 0.5rem;
          margin: 1.5em 0;
          overflow: hidden;
        }
        /* Sem atributo width, cai para 100% */
        .rich-text-editor .ql-editor iframe.ql-video:not([width]) {
          width: 100%;
        }
        /* Alinhamento do vídeo (Quill aplica .ql-align-*) */
        .rich-text-editor .ql-editor iframe.ql-video.ql-align-center {
          margin-left: auto;
          margin-right: auto;
        }
        .rich-text-editor .ql-editor iframe.ql-video.ql-align-right {
          margin-left: auto;
          margin-right: 0;
        }

        /* Tooltip do Quill (link/vídeo) — evitar overflow para fora do editor */
        .rich-text-editor .ql-container {
          position: relative;
        }
        .rich-text-editor .ql-tooltip {
          left: 1rem !important;
          right: auto;
          transform: none !important;
          z-index: 50;
          max-width: calc(100% - 2rem);
          white-space: normal;
        }
        .rich-text-editor .ql-tooltip input[type="text"] {
          width: 100%;
          min-width: 240px;
          max-width: 360px;
        }
        
        /* Espaçamento geral */
        .rich-text-editor .ql-editor > *:first-child {
          margin-top: 0;
        }
        
        .rich-text-editor .ql-editor > *:last-child {
          margin-bottom: 0;
        }
        
        /* Toolbar */
        .rich-text-editor .ql-toolbar {
          border-top: 1px solid #d1d5db;
          border-left: 1px solid #d1d5db;
          border-right: 1px solid #d1d5db;
          border-top-left-radius: 0.375rem;
          border-top-right-radius: 0.375rem;
          background-color: #f9fafb;
        }
        
        /* Container */
        .rich-text-editor .ql-container {
          border-bottom: 1px solid #d1d5db;
          border-left: 1px solid #d1d5db;
          border-right: 1px solid #d1d5db;
          border-bottom-left-radius: 0.375rem;
          border-bottom-right-radius: 0.375rem;
          font-family: 'Open Sans', sans-serif;
        }
        
        /* Placeholder */
        .rich-text-editor .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
          font-size: 1.125rem;
        }
        
        /* Garantir que o conteúdo editável tenha a mesma largura máxima da publicação */
        .rich-text-editor .ql-editor {
          max-width: 100%;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
