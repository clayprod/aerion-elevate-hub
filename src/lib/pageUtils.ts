/**
 * Normaliza caracteres acentuados para suas versões sem acento
 * Usa Unicode NFD (Normalization Form Decomposed) para separar letras de diacríticos
 * Exemplos:
 *   "são paulo" → "sao paulo"
 *   "ação" → "acao"
 *   "coração" → "coracao"
 *   "José" → "Jose"
 */
function normalizeAccents(text: string): string {
  return text
    .normalize('NFD') // Decompõe caracteres acentuados (á → a + ´)
    .replace(/[\u0300-\u036f]/g, ''); // Remove diacríticos (acentos, cedilhas, etc.)
}

/**
 * Gera slug válido a partir de um título
 * Converte acentos corretamente, remove caracteres especiais, substitui espaços por hífens
 * Exemplos:
 *   "São Paulo - Ação!" → "sao-paulo-acao"
 *   "José & Maria" → "jose-maria"
 *   "Coração   de   Pedra" → "coracao-de-pedra"
 *   "Drone Évo Max" → "drone-evo-max"
 */
export function generateSlug(title: string): string {
  if (!title) return '';
  
  return normalizeAccents(title)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Espaços → hífens
    .replace(/[^\w\-]+/g, '')     // Remove caracteres não alfanuméricos (exceto hífens)
    .replace(/--+/g, '-')         // Múltiplos hífens → um único hífen
    .replace(/^-+|-+$/g, '');     // Remove hífens do início/fim
}

// Lista de rotas estáticas que podem ser sobrescritas via CMS
// Nota: Blog não está aqui pois tem sistema próprio de gerenciamento
export const OVERRIDABLE_STATIC_ROUTES = [
  '/',
  '/produtos',
  '/produtos/evo-lite-enterprise',
  '/produtos/evo-max-v2',
  '/produtos/autel-alpha',
  '/produtos/autel-mapper',
  '/solucoes',
  '/solucoes/construcao',
  '/solucoes/industrial',
  '/solucoes/seguranca',
  '/solucoes/resgate',
  '/sobre',
  '/contato',
  '/politica-privacidade',
  '/termos-uso',
];

// Lista de rotas protegidas que NÃO podem ser criadas como páginas customizadas
export const PROTECTED_ROUTES = [
  '/admin',
  '/admin/blog',
  '/admin/hero',
  '/admin/products',
  '/admin/solutions',
  '/admin/settings',
  '/admin/pages',
  '/auth',
  '/blog', // Blog tem sistema próprio
];

// Lista completa de rotas estáticas (para validação)
export const STATIC_ROUTES = [
  ...OVERRIDABLE_STATIC_ROUTES,
  ...PROTECTED_ROUTES,
];

/**
 * Valida se um path dinâmico é válido
 * Permite criar páginas customizadas que sobrescrevem rotas estáticas (exceto protegidas)
 */
export function isValidDynamicPath(path: string): boolean {
  if (!path || typeof path !== 'string') return false;
  
  // Deve começar com /
  if (!path.startsWith('/')) return false;
  
  // Não pode ser rota protegida (admin, auth, blog)
  if (PROTECTED_ROUTES.includes(path) || PROTECTED_ROUTES.some(route => path.startsWith(route + '/'))) {
    return false;
  }
  
  // Não pode começar com rotas protegidas
  if (path.startsWith('/admin') || path.startsWith('/auth') || path.startsWith('/api')) {
    return false;
  }
  
  // Não pode ser rota de blog individual (tem sistema próprio)
  if (path.startsWith('/blog/')) {
    return false;
  }
  
  // Deve seguir o padrão: apenas letras minúsculas, números, hífens e barras
  const pathRegex = /^\/[a-z0-9\-/]+$/;
  if (!pathRegex.test(path)) return false;
  
  // Não pode ter mais de 255 caracteres
  if (path.length > 255) return false;
  
  return true;
}

/**
 * Valida se um slug é válido
 */
export function isValidSlug(slug: string): boolean {
  if (!slug || typeof slug !== 'string') return false;
  
  // Deve seguir o padrão: apenas letras minúsculas, números e hífens
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
}

