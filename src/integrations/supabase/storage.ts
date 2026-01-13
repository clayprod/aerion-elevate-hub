/**
 * Configuração centralizada do Supabase Storage
 * Todas as mídias enviadas via painel admin devem usar este bucket
 */

export const STORAGE_BUCKET = "public-images";

/**
 * Obtém a referência do bucket de mídia pública
 * @param supabase - Cliente do Supabase
 */
export const getStorageBucket = (supabase: any) => {
  return supabase.storage.from(STORAGE_BUCKET);
};

/**
 * Obtém a URL pública de um arquivo no bucket
 * @param supabase - Cliente do Supabase
 * @param filePath - Caminho do arquivo no bucket
 */
export const getPublicUrl = (supabase: any, filePath: string) => {
  return supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filePath);
};






