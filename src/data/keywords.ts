/**
 * Configuração centralizada de keywords SEO
 * 
 * Keywords foram analisadas e categorizadas a partir do CSV de keywords do aerion.com.br
 * e keywords de alto volume de outros sites competidores (lojadji.com.br, flypro.com.br, etc.)
 * Inclui keywords específicas da DJI e modelos (dji mini, mavic, etc.) de alto volume
 * Máximo de 10-15 keywords por página para evitar poluição
 * 
 * Total: 122 keywords relevantes identificadas (12 do aerion.com.br + 110 de outros sites)
 */

export interface KeywordsConfig {
  [route: string]: string[];
}

/**
 * Keywords organizadas por rota/página
 */
export const keywordsConfig: KeywordsConfig = {
  // Home - Keywords gerais de alto volume (50k+ buscas/mês)
  '/': [
    'drones profissionais',
    'drone profissional',
    'drone com câmera',
    'drone dji mini 3',
    'dji mini 3 pro',
    'drone dji mini 2',
    'dji mini 4 pro',
    'Autel',
    'tecnologia aérea',
    'drone topografia',
    'inspeção industrial',
    'segurança pública',
    'drone resgate',
    'loja de drones',
    'distribuidor autel brasil',
  ],

  // Produtos - Listagem geral
  '/produtos': [
    'drones Autel',
    'drone profissional',
    'drones profissionais',
    'drone com câmera',
    'drone dji mini 3',
    'dji mini 3 pro',
    'drone dji mini 2',
    'dji mini 4 pro',
    'drone com câmera profissional',
    'EVO Lite Enterprise',
    'EVO Max V2',
    'Autel Alpha',
    'drones enterprise',
    'tecnologia aérea',
    'drones Brasil',
  ],

  // EVO Lite Enterprise
  '/produtos/evo-lite-enterprise': [
    'evo lite enterprise',
    'drone térmico',
    'drone profissional',
    'drone com câmera',
    'drone dji mini 3',
    'dji mini 3 pro',
    'drone dji mini 2',
    'drone topografia',
    'drone compacto',
    'inspeção térmica',
    'autel evo lite',
    'drone com câmera térmica',
    'drone 6k',
    'drone profissional compacto',
    'drone enterprise',
  ],

  // EVO Max V2
  '/produtos/evo-max-v2': [
    'evo max v2',
    'evo max 4t',
    'evo max 4n',
    'drone RTK',
    'drone profissional',
    'drone dji mini 3',
    'dji mini 3 pro',
    'mavic pro dji',
    'drone com RTK',
    'topografia drone',
    'mapeamento drone',
    'autel evo max',
    'drone SLAM',
    'drone precisão',
    'drone georreferenciamento',
  ],

  // Autel Alpha
  '/produtos/autel-alpha': [
    'autel alpha',
    'drone BVLOS',
    'drone profissional',
    'drone dji mini 3',
    'dji mini 3 pro',
    'mavic pro dji',
    'inspeção industrial',
    'drone térmico',
    'inspeção linhas transmissão',
    'autel alpha brasil',
    'drone industrial',
    'drone longa distância',
    'drone alcance',
    'drone zoom óptico',
    'drone radar',
  ],

  // Autel Mapper
  '/produtos/autel-mapper': [
    'autel mapper',
    'drones para mapeamento',
    'mapeamento com drones',
    'mapeamento com drone',
    'drones mapeamento',
    'drone para mapeamento',
    'drone de mapeamento',
    'drone mapeamento',
    'mapeamento drone',
    'software mapeamento',
    'reconstrução 3d',
    'mapeamento aéreo',
    'software drone',
    'autel mapper brasil',
    'georreferenciamento drone',
  ],

  // Soluções - Listagem geral
  '/solucoes': [
    'soluções drones',
    'drones profissionais',
    'drone profissional',
    'drone dji mini 3',
    'dji mini 3 pro',
    'drone dji mini 2',
    'mavic pro dji',
    'drones construção',
    'drones topografia',
    'topografia com drones',
    'inspeção industrial drones',
    'inspeção com drone',
    'segurança pública drones',
    'drones de segurança',
    'resgate drones',
  ],

  // Construção e Topografia
  '/solucoes/construcao': [
    'drones construção',
    'drones topografia',
    'topografia com drones',
    'topografia com drone',
    'drone para topografia',
    'levantamento topográfico drones',
    'modelagem BIM',
    'mapeamento urbano',
    'medição volumes',
    'drones obras',
    'topografia aérea',
    'drones para georreferenciamento',
    'drones georreferenciamento',
  ],

  // Inspeção Industrial
  '/solucoes/industrial': [
    'drones inspeção industrial',
    'inspeção térmica drones',
    'drones energia',
    'drones óleo e gás',
    'drones mineração',
    'inspeção painéis solares',
    'detecção hotspots',
    'drones BVLOS',
    'inspeção com drone',
    'drone inspeção industrial',
    'inspeção industrial com drone',
  ],

  // Segurança Pública
  '/solucoes/seguranca': [
    'drones segurança pública',
    'drones defesa civil',
    'vigilância drones',
    'patrulhamento drones',
    'drones trânsito',
    'drones fiscalização',
    'monitoramento eventos',
    'drones polícia',
    'drones de segurança',
    'drones segurança',
    'drones na segurança pública',
  ],

  // Resgate e Emergências
  '/solucoes/resgate': [
    'drones resgate',
    'drones emergências',
    'busca resgate drones',
    'drones incêndios',
    'drones salvamento',
    'localização vítimas drones',
    'drones desastres',
    'drones bombeiros',
    'drone de resgate',
    'drone resgate',
  ],

  // Sobre
  '/sobre': [
    'aerion technologies',
    'sobre aerion',
    'distribuidor autel brasil',
    'drones profissionais brasil',
    'suporte técnico drones',
    'drones brasil',
    'drones do brasil',
    'drones no brasil',
    'fornecedor de drones no brasil',
    'empresas de drones no brasil',
    'fabricante de drones no brasil',
  ],

  // Contato
  '/contato': [
    'contato aerion',
    'loja de drones',
    'loja de drone',
    'suporte drones',
    'programa revendas',
    'distribuidor autel contato',
    'drones a venda',
    'venda de drones',
    'drones para venda',
    'preço de drone',
    'drone valor',
    'suporte drone',
    'assistência técnica drone',
  ],

  // Blog
  '/blog': [
    'blog drones',
    'tecnologia aérea',
    'drones profissionais',
    'drone profissional',
    'drone dji mini 3',
    'dji mini 3 pro',
    'drone dji mini 2',
    'dji mini 4 pro',
    'mavic pro dji',
    'Autel',
    'inspeção industrial',
    'topografia',
    'segurança pública',
    'resgate',
    'blog aerion',
  ],
};

/**
 * Obtém keywords para uma rota específica
 * @param route - Rota da página (ex: '/', '/produtos', '/solucoes/construcao')
 * @param fallback - Keywords de fallback caso a rota não seja encontrada
 * @returns Array de keywords separadas por vírgula
 */
export function getKeywordsForRoute(route: string, fallback?: string[]): string {
  const keywords = keywordsConfig[route] || fallback || [];
  
  // Limitar a 15 keywords máximo
  const limitedKeywords = keywords.slice(0, 15);
  
  // Retornar como string separada por vírgula
  return limitedKeywords.join(', ');
}

/**
 * Obtém keywords para uma solução específica
 * @param slug - Slug da solução (ex: 'construcao', 'industrial', 'seguranca', 'resgate')
 * @returns Array de keywords
 */
export function getKeywordsForSolution(slug: string): string {
  const solutionRoute = `/solucoes/${slug}`;
  return getKeywordsForRoute(solutionRoute, keywordsConfig['/solucoes']);
}

/**
 * Obtém keywords para um produto específico
 * @param slug - Slug do produto (ex: 'evo-lite-enterprise', 'evo-max-v2', 'autel-alpha', 'autel-mapper')
 * @returns Array de keywords
 */
export function getKeywordsForProduct(slug: string): string {
  const productRoute = `/produtos/${slug}`;
  return getKeywordsForRoute(productRoute, keywordsConfig['/produtos']);
}


