/**
 * Script para migrar dados de produtos do código para o banco de dados
 * Execute este script uma vez para popular o banco com os dados existentes
 */

import { supabase } from '@/integrations/supabase/client';
import { productFamilies } from '@/data/products';

export async function migrateProductDataToDatabase() {
  console.log('Iniciando migração de dados de produtos...');

  for (const family of productFamilies) {
    try {
      // Verificar se a família já existe
      const { data: existingFamily } = await supabase
        .from('product_families')
        .select('id')
        .eq('slug', family.slug)
        .single();

      const familyData = {
        name: family.name,
        slug: family.slug,
        description: family.description,
        short_description: family.description.substring(0, 200), // Primeiros 200 caracteres
        image_url: family.fallbackImage,
        youtube_video_id: family.youtubeVideoId || null,
        fallback_image: family.fallbackImage,
        brochure: family.brochure,
        key_features: family.keyFeatures,
        technical_data: family.technicalData,
        components: family.components,
        accessories_included: family.accessoriesIncluded,
        videos: family.videos,
        photo_gallery: family.photoGallery,
        gallery: family.gallery,
        lifestyle_images: family.lifestyleImages,
        accessories: family.accessories,
        applications: family.applications,
        product_codes: family.productCodes,
        active: true,
        order_index: 0,
      };

      let familyId: string;

      if (existingFamily) {
        // Atualizar família existente
        const { data, error } = await supabase
          .from('product_families')
          .update(familyData)
          .eq('id', existingFamily.id)
          .select('id')
          .single();

        if (error) throw error;
        familyId = data.id;
        console.log(`✓ Família atualizada: ${family.name}`);
      } else {
        // Criar nova família
        const { data, error } = await supabase
          .from('product_families')
          .insert(familyData)
          .select('id')
          .single();

        if (error) throw error;
        familyId = data.id;
        console.log(`✓ Família criada: ${family.name}`);
      }

      // Migrar variantes
      for (let index = 0; index < family.variants.length; index++) {
        const variant = family.variants[index];
        
        // Verificar se a variante já existe
        const { data: existingVariant } = await supabase
          .from('product_variants')
          .select('id')
          .eq('slug', `${family.slug}-${variant.id}`)
          .single();

        const variantData = {
          name: variant.name,
          slug: `${family.slug}-${variant.id}`,
          description: variant.description,
          short_description: variant.description.substring(0, 200),
          family_id: familyId,
          specifications: variant.specs,
          image_path: variant.imagePath,
          specs: variant.specs,
          image_url: `${variant.imagePath}/1.png`, // Primeira imagem como padrão
          gallery_urls: [], // Será preenchido com imagens numeradas se necessário
          active: true,
          order_index: index,
        };

        if (existingVariant) {
          const { error } = await supabase
            .from('product_variants')
            .update(variantData)
            .eq('id', existingVariant.id);

          if (error) throw error;
          console.log(`  ✓ Variante atualizada: ${variant.name}`);
        } else {
          const { error } = await supabase
            .from('product_variants')
            .insert(variantData);

          if (error) throw error;
          console.log(`  ✓ Variante criada: ${variant.name}`);
        }
      }
    } catch (error) {
      console.error(`✗ Erro ao migrar família ${family.name}:`, error);
    }
  }

  console.log('Migração concluída!');
}

// Função auxiliar para executar a migração manualmente
export async function runMigration() {
  try {
    await migrateProductDataToDatabase();
  } catch (error) {
    console.error('Erro na migração:', error);
  }
}






