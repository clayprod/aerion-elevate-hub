/**
 * Tipos auxiliares para páginas customizadas
 */

export interface CustomPage {
  id: string;
  title: string;
  slug: string;
  path: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  gallery_images?: string[];
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
  published: boolean;
  template: string;
  order_index: number;
  version: number;
  created_at: string;
  updated_at: string;
  published_at?: string;
  created_by?: string;
}

export interface CustomPageFormData {
  title: string;
  slug: string;
  path: string;
  content: string;
  excerpt: string;
  featured_image: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  published: boolean;
  template: string;
}








