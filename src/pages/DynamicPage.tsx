import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BlocksRenderer } from '@/components/blocks/BlockRenderer';
import { Block } from '@/types/blocks';

const DynamicPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<{
    title: string;
    content: string;
    meta_description?: string;
    meta_keywords?: string;
    published: boolean;
  } | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchPageData(slug);
    }
  }, [slug]);

  const fetchPageData = async (pageSlug: string) => {
    try {
      setIsLoading(true);
      setNotFound(false);

      // Primeiro, tentar buscar como página personalizada
      const { data: customPage, error: customPageError } = await supabase
        .from('custom_pages')
        .select('*')
        .eq('slug', pageSlug)
        .eq('published', true)
        .single();

      if (customPage && !customPageError) {
        setPage(customPage);
        setBlocks([]); // Páginas personalizadas usam rich text, não blocos
        return;
      }

      // Se não for página personalizada, tentar buscar blocos da página
      const { data: pageBlocks, error: blocksError } = await supabase
        .from('page_sections')
        .select('*')
        .eq('page_slug', pageSlug)
        .eq('active', true)
        .order('order_index', { ascending: true });

      if (blocksError) {
        console.error('Erro ao buscar blocos da página:', blocksError);
        setNotFound(true);
        return;
      }

      if (pageBlocks && pageBlocks.length > 0) {
        // Converter dados do banco para formato Block
        const formattedBlocks: Block[] = pageBlocks.map(item => ({
          id: item.id,
          type: item.section_type as any,
          order_index: item.order_index,
          active: item.active,
          created_at: item.created_at,
          updated_at: item.updated_at,
          content: item.content
        }));

        setBlocks(formattedBlocks);
        setPage({
          title: `Página ${pageSlug}`,
          content: '',
          published: true
        });
        return;
      }

      // Se não encontrou nem página personalizada nem blocos, página não existe
      setNotFound(true);
    } catch (error) {
      console.error('Erro ao buscar dados da página:', error);
      setNotFound(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-28 pb-20">
          <div className="container-custom">
            <div className="text-center">
              <p className="text-gray-dark">Carregando página...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (notFound || !page) {
    return <Navigate to="/404" replace />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-28 pb-20">
        {/* Se for página personalizada com rich text */}
        {page.content && blocks.length === 0 ? (
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl font-heading font-bold text-navy-deep mb-8">
                {page.title}
              </h1>
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: page.content }}
              />
            </div>
          </div>
        ) : (
          /* Se for página com blocos */
          <BlocksRenderer blocks={blocks} />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default DynamicPage;

