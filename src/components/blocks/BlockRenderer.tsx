import { Block, BlockType } from "@/types/blocks";
import HeroBlock from "./HeroBlock";
import FeaturesBlock from "./FeaturesBlock";
import TextBlock from "./TextBlock";
import ImageBlock from "./ImageBlock";
import CTABlock from "./CTABlock";
import ProductsBlock from "./ProductsBlock";
import SolutionsBlock from "./SolutionsBlock";
import TestimonialsBlock from "./TestimonialsBlock";
import StatsBlock from "./StatsBlock";
import ContactBlock from "./ContactBlock";
import BlogCTABlock from "./BlogCTABlock";

interface BlockRendererProps {
  block: Block;
  isEditing?: boolean;
  onUpdate?: (block: Block) => void;
  onDelete?: (blockId: string) => void;
  onMove?: (blockId: string, direction: 'up' | 'down') => void;
}

const BlockRenderer = ({ 
  block, 
  isEditing = false, 
  onUpdate, 
  onDelete, 
  onMove 
}: BlockRendererProps) => {
  // Props comuns para todos os blocos
  const commonProps = {
    block,
    isEditing,
    onUpdate,
    onDelete,
    onMove
  };

  // Renderizar bloco baseado no tipo
  switch (block.type) {
    case 'hero':
      return <HeroBlock {...commonProps} />;
    
    case 'features':
      return <FeaturesBlock {...commonProps} />;
    
    case 'text':
      return <TextBlock {...commonProps} />;
    
    case 'image':
      return <ImageBlock {...commonProps} />;
    
    case 'cta':
      return <CTABlock {...commonProps} />;
    
    case 'products':
      return <ProductsBlock {...commonProps} />;
    
    case 'solutions':
      return <SolutionsBlock {...commonProps} />;
    
    case 'testimonials':
      return <TestimonialsBlock {...commonProps} />;
    
    case 'stats':
      return <StatsBlock {...commonProps} />;
    
    case 'contact':
      return <ContactBlock {...commonProps} />;
    
    case 'blog-cta':
      return <BlogCTABlock {...commonProps} />;
    
    default:
      // Bloco não reconhecido - renderizar placeholder
      return (
        <section className="py-8 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
          <div className="container-custom">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                Bloco não reconhecido
              </h3>
              <p className="text-yellow-700">
                Tipo de bloco "{block.type}" não foi encontrado.
              </p>
              {isEditing && (
                <div className="mt-4">
                  <button
                    onClick={() => onDelete?.(block.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    Remover Bloco
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      );
  }
};

// Componente para renderizar múltiplos blocos
interface BlocksRendererProps {
  blocks: Block[];
  isEditing?: boolean;
  onUpdate?: (block: Block) => void;
  onDelete?: (blockId: string) => void;
  onMove?: (blockId: string, direction: 'up' | 'down') => void;
}

export const BlocksRenderer = ({ 
  blocks, 
  isEditing = false, 
  onUpdate, 
  onDelete, 
  onMove 
}: BlocksRendererProps) => {
  // Ordenar blocos por order_index
  const sortedBlocks = [...blocks].sort((a, b) => a.order_index - b.order_index);

  return (
    <>
      {sortedBlocks.map((block) => (
        <BlockRenderer
          key={block.id}
          block={block}
          isEditing={isEditing}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onMove={onMove}
        />
      ))}
    </>
  );
};

// Hook para obter informações do bloco
export const useBlockInfo = (blockType: BlockType) => {
  const blockConfigs = {
    hero: {
      name: 'Hero Section',
      description: 'Seção principal com título, subtítulo e CTA',
      icon: 'Image',
      category: 'content'
    },
    features: {
      name: 'Features',
      description: 'Grid de características/diferenciais',
      icon: 'Star',
      category: 'content'
    },
    text: {
      name: 'Texto',
      description: 'Bloco de texto rico',
      icon: 'Type',
      category: 'content'
    },
    image: {
      name: 'Imagem',
      description: 'Imagem com caption',
      icon: 'Image',
      category: 'media'
    },
    cta: {
      name: 'Call to Action',
      description: 'Botão de ação principal',
      icon: 'MousePointer',
      category: 'interactive'
    },
    products: {
      name: 'Produtos',
      description: 'Grid de produtos',
      icon: 'Package',
      category: 'content'
    },
    solutions: {
      name: 'Soluções',
      description: 'Grid de soluções/verticais',
      icon: 'Lightbulb',
      category: 'content'
    },
    testimonials: {
      name: 'Depoimentos',
      description: 'Seção de depoimentos de clientes',
      icon: 'MessageSquare',
      category: 'content'
    },
    stats: {
      name: 'Estatísticas',
      description: 'Números e estatísticas',
      icon: 'BarChart3',
      category: 'content'
    },
    contact: {
      name: 'Contato',
      description: 'Seção de contato',
      icon: 'Phone',
      category: 'interactive'
    },
    'blog-cta': {
      name: 'Blog CTA',
      description: 'Call-to-action para o blog',
      icon: 'BookOpen',
      category: 'interactive'
    }
  };

  return blockConfigs[blockType] || {
    name: 'Bloco Desconhecido',
    description: 'Tipo de bloco não reconhecido',
    icon: 'HelpCircle',
    category: 'other'
  };
};

// Função utilitária para criar um novo bloco
export const createNewBlock = (type: BlockType, orderIndex: number): Block => {
  const baseBlock = {
    id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    order_index: orderIndex,
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  // Conteúdo padrão baseado no tipo
  const defaultContent = {
    hero: {
      title: 'Título Principal',
      subtitle: 'Subtítulo da seção',
      cta_text: 'Saiba Mais',
      cta_link: '/contato',
      value_props: []
    },
    features: {
      title: 'Nossos Diferenciais',
      subtitle: 'Por que escolher nossa solução',
      features: []
    },
    text: {
      title: '',
      content: 'Digite seu texto aqui...',
      alignment: 'left'
    },
    image: {
      image_url: '',
      alt_text: '',
      caption: '',
      alignment: 'center',
      size: 'medium'
    },
    cta: {
      title: 'Pronto para começar?',
      description: 'Entre em contato conosco hoje mesmo',
      button_text: 'Fale Conosco',
      button_link: '/contato',
      button_variant: 'primary'
    },
    products: {
      title: 'Nossos Produtos',
      subtitle: 'Conheça nossa linha completa',
      show_all_products: true,
      layout: 'grid'
    },
    solutions: {
      title: 'Nossas Soluções',
      subtitle: 'Para cada segmento',
      show_all_solutions: true,
      layout: 'grid'
    },
    testimonials: {
      title: 'O que nossos clientes dizem',
      subtitle: 'Depoimentos reais',
      testimonials: []
    },
    stats: {
      title: 'Nossos Números',
      subtitle: 'Resultados que falam por si',
      stats: []
    },
    contact: {
      title: 'Entre em Contato',
      subtitle: 'Estamos aqui para ajudar',
      show_form: true,
      show_info: true
    },
    'blog-cta': {
      title: 'Fique por Dentro das Novidades',
      subtitle: 'Insights e tendências em tecnologia aérea',
      button_text: 'Ver Blog',
      button_link: '/blog'
    }
  };

  return {
    ...baseBlock,
    content: defaultContent[type] || {}
  } as Block;
};

export default BlockRenderer;

