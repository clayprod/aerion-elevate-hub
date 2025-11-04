// Tipos para o sistema de produtos do CMS
// Baseado na estrutura atual de products.ts para manter compatibilidade

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  description?: string;
  website?: string;
  active: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface ProductFamily {
  id: string;
  brand_id: string;
  name: string;
  slug: string;
  description: string;
  short_description?: string;
  youtube_video_id?: string;
  brochure_url?: string;
  fallback_image?: string;
  key_features: string[];
  technical_data?: {
    cadastral?: Record<string, string>;
    commercial?: Record<string, string>;
    logistics?: {
      dimensions: string;
      weight: string;
      cubagem?: string;
      packaging?: string;
    };
  };
  components: string[];
  accessories_included: string[];
  applications?: Array<{
    title: string;
    description: string;
    image: string;
    link?: string;
  }>;
  active: boolean;
  featured: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
  // Relacionamentos
  brand?: Brand;
  variants?: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  family_id: string;
  name: string;
  slug: string;
  description: string;
  image_path?: string;
  specs: Record<string, Record<string, string>>;
  images?: {
    product: string[];
    lifestyle: string[];
    details: string[];
  };
  videos?: Array<{
    title: string;
    description: string;
    youtubeId: string;
    thumbnail?: string;
  }>;
  photo_gallery?: {
    product: string[];
    lifestyle: string[];
    details: string[];
  };
  active: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
  // Relacionamentos
  family?: ProductFamily;
}

export interface Vertical {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description?: string;
  icon?: string;
  image_url?: string;
  benefits: string[];
  use_cases: string[];
  gallery_urls?: string[];
  active: boolean;
  featured: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

// Tipos para formulários de criação/edição
export interface CreateBrandData {
  name: string;
  slug: string;
  logo_url?: string;
  description?: string;
  website?: string;
  active?: boolean;
}

export interface UpdateBrandData extends Partial<CreateBrandData> {
  id: string;
}

export interface CreateProductFamilyData {
  brand_id: string;
  name: string;
  slug: string;
  description: string;
  short_description?: string;
  youtube_video_id?: string;
  brochure_url?: string;
  fallback_image?: string;
  key_features: string[];
  technical_data?: ProductFamily['technical_data'];
  components: string[];
  accessories_included: string[];
  applications?: ProductFamily['applications'];
  active?: boolean;
  featured?: boolean;
}

export interface UpdateProductFamilyData extends Partial<CreateProductFamilyData> {
  id: string;
}

export interface CreateProductVariantData {
  family_id: string;
  name: string;
  slug: string;
  description: string;
  image_path?: string;
  specs: Record<string, Record<string, string>>;
  images?: ProductVariant['images'];
  videos?: ProductVariant['videos'];
  photo_gallery?: ProductVariant['photo_gallery'];
  active?: boolean;
}

export interface UpdateProductVariantData extends Partial<CreateProductVariantData> {
  id: string;
}

export interface CreateVerticalData {
  name: string;
  slug: string;
  description: string;
  short_description?: string;
  icon?: string;
  image_url?: string;
  benefits: string[];
  use_cases: string[];
  gallery_urls?: string[];
  active?: boolean;
  featured?: boolean;
}

export interface UpdateVerticalData extends Partial<CreateVerticalData> {
  id: string;
}

// Tipos para queries e filtros
export interface ProductFilters {
  brand_id?: string;
  active?: boolean;
  featured?: boolean;
  search?: string;
}

export interface VerticalFilters {
  active?: boolean;
  featured?: boolean;
  search?: string;
}

// Tipos para estatísticas do dashboard
export interface ProductStats {
  total_families: number;
  total_variants: number;
  active_families: number;
  active_variants: number;
  featured_families: number;
}

export interface VerticalStats {
  total_verticals: number;
  active_verticals: number;
  featured_verticals: number;
}

export interface BrandStats {
  total_brands: number;
  active_brands: number;
}

// Tipos para upload de mídia
export interface MediaUpload {
  file: File;
  folder?: string;
  alt_text?: string;
  title?: string;
}

export interface MediaFile {
  id: string;
  file_url: string;
  file_type: 'image' | 'video' | 'document' | 'other';
  title?: string;
  alt_text?: string;
  folder: string;
  file_size?: number;
  mime_type?: string;
  uploaded_by?: string;
  created_at: string;
  updated_at: string;
}

// Tipos para especificações técnicas (JSONB)
export interface TechnicalSpecs {
  [category: string]: {
    [spec: string]: string;
  };
}

// Exemplo de especificações baseado no código atual
export const EXAMPLE_SPECS: TechnicalSpecs = {
  "CATEGORIA E PORTABILIDADE": {
    "Design": "Dobrável compacto",
    "Peso (com bateria e gimbal)": "866 g",
    "Dimensões dobrado": "210×123×95 mm",
    "Dimensões desdobrado": "433×516×95 mm",
    "Distância diagonal": "368 mm",
    "Classificação IP": "Não especificado"
  },
  "DESEMPENHO DE VOO": {
    "Autonomia máxima": "40 min",
    "Velocidade máxima": "19 m/s",
    "Resistência ao vento": "12 m/s",
    "Altitude máxima": "7.000 m",
    "Distância de transmissão": "12 km",
    "Peso máximo decolagem": "806 g"
  },
  "CÂMERA TÉRMICA": {
    "Possui câmera térmica": "Sim",
    "Resolução térmica": "640×512",
    "Termógrafo": "Microbolômetro VOX",
    "Zoom digital térmico": "20x",
    "Distância focal térmica": "9.1 mm",
    "Faixa de temperatura": "-20°C a 150°C / 0°C a 350°C",
    "Precisão temperatura": "±3°C ou ±3%"
  }
};

// Tipos para validação
export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Funções de validação
export const validateBrand = (data: CreateBrandData): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!data.name || data.name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Nome é obrigatório' });
  }

  if (!data.slug || data.slug.trim().length === 0) {
    errors.push({ field: 'slug', message: 'Slug é obrigatório' });
  } else if (!/^[a-z0-9-]+$/.test(data.slug)) {
    errors.push({ field: 'slug', message: 'Slug deve conter apenas letras minúsculas, números e hífens' });
  }

  if (data.website && !isValidUrl(data.website)) {
    errors.push({ field: 'website', message: 'URL do site inválida' });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateProductFamily = (data: CreateProductFamilyData): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!data.brand_id || data.brand_id.trim().length === 0) {
    errors.push({ field: 'brand_id', message: 'Marca é obrigatória' });
  }

  if (!data.name || data.name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Nome é obrigatório' });
  }

  if (!data.slug || data.slug.trim().length === 0) {
    errors.push({ field: 'slug', message: 'Slug é obrigatório' });
  } else if (!/^[a-z0-9-]+$/.test(data.slug)) {
    errors.push({ field: 'slug', message: 'Slug deve conter apenas letras minúsculas, números e hífens' });
  }

  if (!data.description || data.description.trim().length === 0) {
    errors.push({ field: 'description', message: 'Descrição é obrigatória' });
  }

  if (!data.key_features || data.key_features.length === 0) {
    errors.push({ field: 'key_features', message: 'Pelo menos uma característica principal é obrigatória' });
  }

  if (data.youtube_video_id && !isValidYouTubeId(data.youtube_video_id)) {
    errors.push({ field: 'youtube_video_id', message: 'ID do YouTube inválido' });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateProductVariant = (data: CreateProductVariantData): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!data.family_id || data.family_id.trim().length === 0) {
    errors.push({ field: 'family_id', message: 'Família de produto é obrigatória' });
  }

  if (!data.name || data.name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Nome é obrigatório' });
  }

  if (!data.slug || data.slug.trim().length === 0) {
    errors.push({ field: 'slug', message: 'Slug é obrigatório' });
  } else if (!/^[a-z0-9-]+$/.test(data.slug)) {
    errors.push({ field: 'slug', message: 'Slug deve conter apenas letras minúsculas, números e hífens' });
  }

  if (!data.description || data.description.trim().length === 0) {
    errors.push({ field: 'description', message: 'Descrição é obrigatória' });
  }

  if (!data.specs || Object.keys(data.specs).length === 0) {
    errors.push({ field: 'specs', message: 'Especificações técnicas são obrigatórias' });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateVertical = (data: CreateVerticalData): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!data.name || data.name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Nome é obrigatório' });
  }

  if (!data.slug || data.slug.trim().length === 0) {
    errors.push({ field: 'slug', message: 'Slug é obrigatório' });
  } else if (!/^[a-z0-9-]+$/.test(data.slug)) {
    errors.push({ field: 'slug', message: 'Slug deve conter apenas letras minúsculas, números e hífens' });
  }

  if (!data.description || data.description.trim().length === 0) {
    errors.push({ field: 'description', message: 'Descrição é obrigatória' });
  }

  if (!data.benefits || data.benefits.length === 0) {
    errors.push({ field: 'benefits', message: 'Pelo menos um benefício é obrigatório' });
  }

  if (!data.use_cases || data.use_cases.length === 0) {
    errors.push({ field: 'use_cases', message: 'Pelo menos um caso de uso é obrigatório' });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Funções utilitárias
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function isValidYouTubeId(id: string): boolean {
  // YouTube ID deve ter 11 caracteres alfanuméricos
  return /^[a-zA-Z0-9_-]{11}$/.test(id);
}

// Função para gerar slug a partir do nome
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/-+/g, '-') // Remove hífens duplicados
    .trim();
}

// Função para formatar tamanho de arquivo
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Função para obter extensão do arquivo
export function getFileExtension(filename: string): string {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
}

// Função para verificar se é imagem
export function isImageFile(filename: string): boolean {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
  const extension = getFileExtension(filename).toLowerCase();
  return imageExtensions.includes(extension);
}

// Função para verificar se é vídeo
export function isVideoFile(filename: string): boolean {
  const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'];
  const extension = getFileExtension(filename).toLowerCase();
  return videoExtensions.includes(extension);
}

