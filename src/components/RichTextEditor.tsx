import React, { useMemo, useState, useEffect } from 'react';

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

  useEffect(() => {
    const loadQuill = async () => {
      try {
        // Tentar carregar o React Quill
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

  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      ['clean']
    ],
    clipboard: {
      matchVisual: false,
    }
  }), []);

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'bullet',
    'align',
    'blockquote', 'code-block',
    'link', 'image'
  ];

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
          className="w-full border border-gray-300 rounded-md p-3 bg-white focus:border-aerion-blue focus:outline-none"
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
    <div className="rich-text-editor mb-8 overflow-hidden">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{ height: height }}
        className="bg-white border border-gray-300 rounded-md"
      />
      <style jsx global>{`
        .rich-text-editor .ql-editor {
          min-height: ${height};
          font-family: inherit;
        }
        .rich-text-editor .ql-toolbar {
          border-top: 1px solid #d1d5db;
          border-left: 1px solid #d1d5db;
          border-right: 1px solid #d1d5db;
          border-top-left-radius: 0.375rem;
          border-top-right-radius: 0.375rem;
        }
        .rich-text-editor .ql-container {
          border-bottom: 1px solid #d1d5db;
          border-left: 1px solid #d1d5db;
          border-right: 1px solid #d1d5db;
          border-bottom-left-radius: 0.375rem;
          border-bottom-right-radius: 0.375rem;
        }
        .rich-text-editor .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
