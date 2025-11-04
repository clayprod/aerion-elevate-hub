import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  Brand, 
  ProductFamily, 
  ProductVariant, 
  CreateBrandData, 
  UpdateBrandData,
  CreateProductFamilyData,
  UpdateProductFamilyData,
  CreateProductVariantData,
  UpdateProductVariantData,
  ProductFilters,
  ProductStats
} from '@/types/products';
import { useToast } from '@/hooks/use-toast';

// Hook para gerenciar marcas
export const useBrands = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchBrands = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) {
        throw error;
      }

      setBrands(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar marcas';
      setError(errorMessage);
      console.error('Erro ao buscar marcas:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createBrand = async (brandData: CreateBrandData) => {
    try {
      const { data, error } = await supabase
        .from('brands')
        .insert(brandData)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setBrands(prev => [...prev, data]);
      toast({
        title: 'Sucesso!',
        description: 'Marca criada com sucesso.',
      });

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar marca';
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  };

  const updateBrand = async (brandData: UpdateBrandData) => {
    try {
      const { data, error } = await supabase
        .from('brands')
        .update({
          ...brandData,
          updated_at: new Date().toISOString()
        })
        .eq('id', brandData.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setBrands(prev => prev.map(brand => 
        brand.id === brandData.id ? data : brand
      ));

      toast({
        title: 'Sucesso!',
        description: 'Marca atualizada com sucesso.',
      });

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar marca';
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  };

  const deleteBrand = async (brandId: string) => {
    try {
      const { error } = await supabase
        .from('brands')
        .delete()
        .eq('id', brandId);

      if (error) {
        throw error;
      }

      setBrands(prev => prev.filter(brand => brand.id !== brandId));
      toast({
        title: 'Sucesso!',
        description: 'Marca removida com sucesso.',
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao remover marca';
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  return {
    brands,
    isLoading,
    error,
    createBrand,
    updateBrand,
    deleteBrand,
    refetch: fetchBrands
  };
};

// Hook para gerenciar famílias de produtos
export const useProductFamilies = (filters?: ProductFilters) => {
  const [productFamilies, setProductFamilies] = useState<ProductFamily[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProductFamilies = async () => {
    try {
      setIsLoading(true);
      setError(null);

      let query = supabase
        .from('product_families')
        .select(`
          *,
          brand:brands(*),
          variants:product_variants(*)
        `)
        .order('order_index', { ascending: true });

      // Aplicar filtros
      if (filters?.brand_id) {
        query = query.eq('brand_id', filters.brand_id);
      }
      if (filters?.active !== undefined) {
        query = query.eq('active', filters.active);
      }
      if (filters?.featured !== undefined) {
        query = query.eq('featured', filters.featured);
      }
      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setProductFamilies(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar famílias de produtos';
      setError(errorMessage);
      console.error('Erro ao buscar famílias de produtos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createProductFamily = async (familyData: CreateProductFamilyData) => {
    try {
      const { data, error } = await supabase
        .from('product_families')
        .insert(familyData)
        .select(`
          *,
          brand:brands(*),
          variants:product_variants(*)
        `)
        .single();

      if (error) {
        throw error;
      }

      setProductFamilies(prev => [...prev, data]);
      toast({
        title: 'Sucesso!',
        description: 'Família de produto criada com sucesso.',
      });

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar família de produto';
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  };

  const updateProductFamily = async (familyData: UpdateProductFamilyData) => {
    try {
      const { data, error } = await supabase
        .from('product_families')
        .update({
          ...familyData,
          updated_at: new Date().toISOString()
        })
        .eq('id', familyData.id)
        .select(`
          *,
          brand:brands(*),
          variants:product_variants(*)
        `)
        .single();

      if (error) {
        throw error;
      }

      setProductFamilies(prev => prev.map(family => 
        family.id === familyData.id ? data : family
      ));

      toast({
        title: 'Sucesso!',
        description: 'Família de produto atualizada com sucesso.',
      });

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar família de produto';
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  };

  const deleteProductFamily = async (familyId: string) => {
    try {
      const { error } = await supabase
        .from('product_families')
        .delete()
        .eq('id', familyId);

      if (error) {
        throw error;
      }

      setProductFamilies(prev => prev.filter(family => family.id !== familyId));
      toast({
        title: 'Sucesso!',
        description: 'Família de produto removida com sucesso.',
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao remover família de produto';
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchProductFamilies();
  }, [filters]);

  return {
    productFamilies,
    isLoading,
    error,
    createProductFamily,
    updateProductFamily,
    deleteProductFamily,
    refetch: fetchProductFamilies
  };
};

// Hook para gerenciar variantes de produtos
export const useProductVariants = (familyId?: string) => {
  const [productVariants, setProductVariants] = useState<ProductVariant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProductVariants = async () => {
    try {
      setIsLoading(true);
      setError(null);

      let query = supabase
        .from('product_variants')
        .select(`
          *,
          family:product_families(*)
        `)
        .order('order_index', { ascending: true });

      if (familyId) {
        query = query.eq('family_id', familyId);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setProductVariants(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar variantes de produtos';
      setError(errorMessage);
      console.error('Erro ao buscar variantes de produtos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createProductVariant = async (variantData: CreateProductVariantData) => {
    try {
      const { data, error } = await supabase
        .from('product_variants')
        .insert(variantData)
        .select(`
          *,
          family:product_families(*)
        `)
        .single();

      if (error) {
        throw error;
      }

      setProductVariants(prev => [...prev, data]);
      toast({
        title: 'Sucesso!',
        description: 'Variante de produto criada com sucesso.',
      });

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar variante de produto';
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  };

  const updateProductVariant = async (variantData: UpdateProductVariantData) => {
    try {
      const { data, error } = await supabase
        .from('product_variants')
        .update({
          ...variantData,
          updated_at: new Date().toISOString()
        })
        .eq('id', variantData.id)
        .select(`
          *,
          family:product_families(*)
        `)
        .single();

      if (error) {
        throw error;
      }

      setProductVariants(prev => prev.map(variant => 
        variant.id === variantData.id ? data : variant
      ));

      toast({
        title: 'Sucesso!',
        description: 'Variante de produto atualizada com sucesso.',
      });

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar variante de produto';
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  };

  const deleteProductVariant = async (variantId: string) => {
    try {
      const { error } = await supabase
        .from('product_variants')
        .delete()
        .eq('id', variantId);

      if (error) {
        throw error;
      }

      setProductVariants(prev => prev.filter(variant => variant.id !== variantId));
      toast({
        title: 'Sucesso!',
        description: 'Variante de produto removida com sucesso.',
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao remover variante de produto';
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchProductVariants();
  }, [familyId]);

  return {
    productVariants,
    isLoading,
    error,
    createProductVariant,
    updateProductVariant,
    deleteProductVariant,
    refetch: fetchProductVariants
  };
};

// Hook combinado para produtos (famílias + variantes)
export const useProducts = (filters?: ProductFilters) => {
  const productFamilies = useProductFamilies(filters);
  const brands = useBrands();

  // Estatísticas dos produtos
  const getProductStats = (): ProductStats => {
    const families = productFamilies.productFamilies;
    return {
      total_families: families.length,
      total_variants: families.reduce((acc, family) => acc + (family.variants?.length || 0), 0),
      active_families: families.filter(f => f.active).length,
      active_variants: families.reduce((acc, family) => 
        acc + (family.variants?.filter(v => v.active).length || 0), 0
      ),
      featured_families: families.filter(f => f.featured).length
    };
  };

  return {
    ...productFamilies,
    brands: brands.brands,
    brandsLoading: brands.isLoading,
    productStats: getProductStats()
  };
};

