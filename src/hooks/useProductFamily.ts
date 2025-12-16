import { useQuery } from '@tanstack/react-query';
import { getProductFamilyBySlugFromDB } from '@/data/products';
import type { ProductFamily } from '@/data/products';

/**
 * Hook para buscar uma família de produtos do banco de dados
 * Usa React Query para cache e gerenciamento de estado
 */
export function useProductFamily(slug: string) {
  return useQuery<ProductFamily | undefined>({
    queryKey: ['product-family', slug],
    queryFn: () => getProductFamilyBySlugFromDB(slug),
    staleTime: 5 * 60 * 1000, // 5 minutos
    enabled: !!slug,
  });
}

