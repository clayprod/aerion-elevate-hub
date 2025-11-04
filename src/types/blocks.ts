// Tipos para o sistema de blocos do CMS
// Baseado nos componentes existentes para manter compatibilidade visual

export type BlockType = 
  | 'hero'
  | 'features'
  | 'text'
  | 'image'
  | 'cta'
  | 'products'
  | 'solutions'
  | 'testimonials'
  | 'stats'
  | 'contact'
  | 'blog-cta';

// Base interface para todos os blocos
export interface BaseBlock {
  id: string;
  type: BlockType;
  order_index: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

// Hero Block - baseado no HeroSection atual
export interface HeroBlock extends BaseBlock {
  type: 'hero';
  content: {
    title: string;
    subtitle: string;
    cta_text: string;
    cta_link: string;
    video_url?: string;
    background_image?: string;
    value_props?: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
  };
}

// Features Block - baseado no WhyAerionSection atual
export interface FeaturesBlock extends BaseBlock {
  type: 'features';
  content: {
    title: string;
    subtitle: string;
    features: Array<{
      icon: string;
      title: string;
      description: string;
      features_list: string[];
    }>;
  };
}

// Text Block - para textos ricos
export interface TextBlock extends BaseBlock {
  type: 'text';
  content: {
    title?: string;
    content: string;
    alignment?: 'left' | 'center' | 'right';
    background_color?: string;
  };
}

// Image Block - para imagens com caption
export interface ImageBlock extends BaseBlock {
  type: 'image';
  content: {
    image_url: string;
    alt_text: string;
    caption?: string;
    alignment?: 'left' | 'center' | 'right';
    size?: 'small' | 'medium' | 'large' | 'full';
  };
}

// CTA Block - para call-to-actions
export interface CTABlock extends BaseBlock {
  type: 'cta';
  content: {
    title: string;
    description?: string;
    button_text: string;
    button_link: string;
    button_variant?: 'primary' | 'secondary' | 'outline';
    background_color?: string;
    text_color?: string;
  };
}

// Products Block - baseado no ProductsSection atual
export interface ProductsBlock extends BaseBlock {
  type: 'products';
  content: {
    title?: string;
    subtitle?: string;
    show_all_products?: boolean;
    selected_products?: string[]; // IDs dos produtos
    layout?: 'grid' | 'carousel';
  };
}

// Solutions Block - baseado no SolutionsSection atual
export interface SolutionsBlock extends BaseBlock {
  type: 'solutions';
  content: {
    title: string;
    subtitle: string;
    show_all_solutions?: boolean;
    selected_solutions?: string[]; // IDs das soluções
    layout?: 'grid' | 'carousel';
  };
}

// Testimonials Block - para depoimentos
export interface TestimonialsBlock extends BaseBlock {
  type: 'testimonials';
  content: {
    title?: string;
    subtitle?: string;
    testimonials: Array<{
      name: string;
      company: string;
      role?: string;
      content: string;
      avatar_url?: string;
      rating?: number;
    }>;
  };
}

// Stats Block - para estatísticas/números
export interface StatsBlock extends BaseBlock {
  type: 'stats';
  content: {
    title?: string;
    subtitle?: string;
    stats: Array<{
      number: string;
      label: string;
      description?: string;
    }>;
  };
}

// Contact Block - baseado no ContactSection atual
export interface ContactBlock extends BaseBlock {
  type: 'contact';
  content: {
    title: string;
    subtitle?: string;
    show_form?: boolean;
    show_info?: boolean;
    background_color?: string;
  };
}

// Blog CTA Block - baseado na seção de blog da home
export interface BlogCTABlock extends BaseBlock {
  type: 'blog-cta';
  content: {
    title: string;
    subtitle: string;
    button_text: string;
    button_link: string;
    background_color?: string;
  };
}

// Union type para todos os blocos
export type Block = 
  | HeroBlock
  | FeaturesBlock
  | TextBlock
  | ImageBlock
  | CTABlock
  | ProductsBlock
  | SolutionsBlock
  | TestimonialsBlock
  | StatsBlock
  | ContactBlock
  | BlogCTABlock;

// Interface para página com blocos
export interface PageWithBlocks {
  page_slug: string;
  blocks: Block[];
}

// Props para componentes de blocos
export interface BlockProps<T extends Block = Block> {
  block: T;
  isEditing?: boolean;
  onUpdate?: (block: T) => void;
  onDelete?: (blockId: string) => void;
  onMove?: (blockId: string, direction: 'up' | 'down') => void;
}

// Configurações de bloco para o editor
export interface BlockConfig {
  type: BlockType;
  name: string;
  description: string;
  icon: string;
  category: 'content' | 'layout' | 'interactive' | 'media';
  defaultContent: any;
  fields: BlockField[];
}

// Campo de configuração do bloco
export interface BlockField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'rich' | 'image' | 'url' | 'select' | 'multiselect' | 'array' | 'object';
  required?: boolean;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

// Configurações padrão para cada tipo de bloco
export const BLOCK_CONFIGS: Record<BlockType, BlockConfig> = {
  hero: {
    type: 'hero',
    name: 'Hero Section',
    description: 'Seção principal com título, subtítulo e CTA',
    icon: 'Image',
    category: 'content',
    defaultContent: {
      title: 'Título Principal',
      subtitle: 'Subtítulo da seção',
      cta_text: 'Saiba Mais',
      cta_link: '/contato',
      value_props: []
    },
    fields: [
      { key: 'title', label: 'Título', type: 'text', required: true },
      { key: 'subtitle', label: 'Subtítulo', type: 'textarea', required: true },
      { key: 'cta_text', label: 'Texto do Botão', type: 'text', required: true },
      { key: 'cta_link', label: 'Link do Botão', type: 'url', required: true },
      { key: 'video_url', label: 'URL do Vídeo', type: 'url' },
      { key: 'background_image', label: 'Imagem de Fundo', type: 'image' }
    ]
  },
  features: {
    type: 'features',
    name: 'Features',
    description: 'Grid de características/diferenciais',
    icon: 'Star',
    category: 'content',
    defaultContent: {
      title: 'Nossos Diferenciais',
      subtitle: 'Por que escolher nossa solução',
      features: []
    },
    fields: [
      { key: 'title', label: 'Título', type: 'text', required: true },
      { key: 'subtitle', label: 'Subtítulo', type: 'textarea', required: true },
      { key: 'features', label: 'Características', type: 'array', required: true }
    ]
  },
  text: {
    type: 'text',
    name: 'Texto',
    description: 'Bloco de texto rico',
    icon: 'Type',
    category: 'content',
    defaultContent: {
      title: '',
      content: 'Digite seu texto aqui...',
      alignment: 'left'
    },
    fields: [
      { key: 'title', label: 'Título (opcional)', type: 'text' },
      { key: 'content', label: 'Conteúdo', type: 'rich', required: true },
      { key: 'alignment', label: 'Alinhamento', type: 'select', options: [
        { value: 'left', label: 'Esquerda' },
        { value: 'center', label: 'Centro' },
        { value: 'right', label: 'Direita' }
      ]}
    ]
  },
  image: {
    type: 'image',
    name: 'Imagem',
    description: 'Imagem com caption',
    icon: 'Image',
    category: 'media',
    defaultContent: {
      image_url: '',
      alt_text: '',
      caption: '',
      alignment: 'center',
      size: 'medium'
    },
    fields: [
      { key: 'image_url', label: 'URL da Imagem', type: 'image', required: true },
      { key: 'alt_text', label: 'Texto Alternativo', type: 'text', required: true },
      { key: 'caption', label: 'Legenda', type: 'text' },
      { key: 'alignment', label: 'Alinhamento', type: 'select', options: [
        { value: 'left', label: 'Esquerda' },
        { value: 'center', label: 'Centro' },
        { value: 'right', label: 'Direita' }
      ]},
      { key: 'size', label: 'Tamanho', type: 'select', options: [
        { value: 'small', label: 'Pequeno' },
        { value: 'medium', label: 'Médio' },
        { value: 'large', label: 'Grande' },
        { value: 'full', label: 'Completo' }
      ]}
    ]
  },
  cta: {
    type: 'cta',
    name: 'Call to Action',
    description: 'Botão de ação principal',
    icon: 'MousePointer',
    category: 'interactive',
    defaultContent: {
      title: 'Pronto para começar?',
      description: 'Entre em contato conosco hoje mesmo',
      button_text: 'Fale Conosco',
      button_link: '/contato',
      button_variant: 'primary'
    },
    fields: [
      { key: 'title', label: 'Título', type: 'text', required: true },
      { key: 'description', label: 'Descrição', type: 'textarea' },
      { key: 'button_text', label: 'Texto do Botão', type: 'text', required: true },
      { key: 'button_link', label: 'Link do Botão', type: 'url', required: true },
      { key: 'button_variant', label: 'Estilo do Botão', type: 'select', options: [
        { value: 'primary', label: 'Primário' },
        { value: 'secondary', label: 'Secundário' },
        { value: 'outline', label: 'Contorno' }
      ]}
    ]
  },
  products: {
    type: 'products',
    name: 'Produtos',
    description: 'Grid de produtos',
    icon: 'Package',
    category: 'content',
    defaultContent: {
      title: 'Nossos Produtos',
      subtitle: 'Conheça nossa linha completa',
      show_all_products: true,
      layout: 'grid'
    },
    fields: [
      { key: 'title', label: 'Título', type: 'text' },
      { key: 'subtitle', label: 'Subtítulo', type: 'textarea' },
      { key: 'show_all_products', label: 'Mostrar todos os produtos', type: 'select', options: [
        { value: 'true', label: 'Sim' },
        { value: 'false', label: 'Não' }
      ]},
      { key: 'layout', label: 'Layout', type: 'select', options: [
        { value: 'grid', label: 'Grid' },
        { value: 'carousel', label: 'Carrossel' }
      ]}
    ]
  },
  solutions: {
    type: 'solutions',
    name: 'Soluções',
    description: 'Grid de soluções/verticais',
    icon: 'Lightbulb',
    category: 'content',
    defaultContent: {
      title: 'Nossas Soluções',
      subtitle: 'Para cada segmento',
      show_all_solutions: true,
      layout: 'grid'
    },
    fields: [
      { key: 'title', label: 'Título', type: 'text', required: true },
      { key: 'subtitle', label: 'Subtítulo', type: 'textarea', required: true },
      { key: 'show_all_solutions', label: 'Mostrar todas as soluções', type: 'select', options: [
        { value: 'true', label: 'Sim' },
        { value: 'false', label: 'Não' }
      ]},
      { key: 'layout', label: 'Layout', type: 'select', options: [
        { value: 'grid', label: 'Grid' },
        { value: 'carousel', label: 'Carrossel' }
      ]}
    ]
  },
  testimonials: {
    type: 'testimonials',
    name: 'Depoimentos',
    description: 'Seção de depoimentos de clientes',
    icon: 'MessageSquare',
    category: 'content',
    defaultContent: {
      title: 'O que nossos clientes dizem',
      subtitle: 'Depoimentos reais',
      testimonials: []
    },
    fields: [
      { key: 'title', label: 'Título', type: 'text' },
      { key: 'subtitle', label: 'Subtítulo', type: 'textarea' },
      { key: 'testimonials', label: 'Depoimentos', type: 'array', required: true }
    ]
  },
  stats: {
    type: 'stats',
    name: 'Estatísticas',
    description: 'Números e estatísticas',
    icon: 'BarChart3',
    category: 'content',
    defaultContent: {
      title: 'Nossos Números',
      subtitle: 'Resultados que falam por si',
      stats: []
    },
    fields: [
      { key: 'title', label: 'Título', type: 'text' },
      { key: 'subtitle', label: 'Subtítulo', type: 'textarea' },
      { key: 'stats', label: 'Estatísticas', type: 'array', required: true }
    ]
  },
  contact: {
    type: 'contact',
    name: 'Contato',
    description: 'Seção de contato',
    icon: 'Phone',
    category: 'interactive',
    defaultContent: {
      title: 'Entre em Contato',
      subtitle: 'Estamos aqui para ajudar',
      show_form: true,
      show_info: true
    },
    fields: [
      { key: 'title', label: 'Título', type: 'text', required: true },
      { key: 'subtitle', label: 'Subtítulo', type: 'textarea' },
      { key: 'show_form', label: 'Mostrar formulário', type: 'select', options: [
        { value: 'true', label: 'Sim' },
        { value: 'false', label: 'Não' }
      ]},
      { key: 'show_info', label: 'Mostrar informações', type: 'select', options: [
        { value: 'true', label: 'Sim' },
        { value: 'false', label: 'Não' }
      ]}
    ]
  },
  'blog-cta': {
    type: 'blog-cta',
    name: 'Blog CTA',
    description: 'Call-to-action para o blog',
    icon: 'BookOpen',
    category: 'interactive',
    defaultContent: {
      title: 'Fique por Dentro das Novidades',
      subtitle: 'Insights e tendências em tecnologia aérea',
      button_text: 'Ver Blog',
      button_link: '/blog'
    },
    fields: [
      { key: 'title', label: 'Título', type: 'text', required: true },
      { key: 'subtitle', label: 'Subtítulo', type: 'textarea', required: true },
      { key: 'button_text', label: 'Texto do Botão', type: 'text', required: true },
      { key: 'button_link', label: 'Link do Botão', type: 'url', required: true }
    ]
  }
};

