import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { STORAGE_BUCKET } from "@/integrations/supabase/storage";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import MediaUploader from "@/components/admin/MediaUploader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Search, Image as ImageIcon, Video, File, FolderOpen, RefreshCw } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface MediaItem {
  id: string;
  file_url: string;
  file_type: string;
  title: string | null;
  alt_text: string | null;
  folder: string | null;
  file_size: number | null;
  mime_type: string | null;
  created_at: string;
}

const MediaLibrary = () => {
  const { toast } = useToast();
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string>("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<MediaItem | null>(null);

  useEffect(() => {
    fetchMedia();
  }, [selectedFolder]);

  // Função recursiva para listar todos os arquivos do bucket
  const listAllFiles = async (path: string = "", allFiles: any[] = []): Promise<any[]> => {
    try {
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .list(path, {
          limit: 1000,
          offset: 0,
          sortBy: { column: "created_at", order: "desc" },
        });

      if (error) {
        console.warn(`Error listing files in ${path}:`, error);
        return allFiles;
      }

      if (!data || data.length === 0) return allFiles;

      for (const item of data) {
        const fullPath = path ? `${path}/${item.name}` : item.name;
        
        // Verificar se é uma pasta: pastas geralmente não têm metadata ou têm metadata vazio
        // Arquivos têm id ou metadata com size
        const isFolder = !item.id && (!item.metadata || !item.metadata.size);
        
        if (isFolder) {
          // É uma pasta, fazer recursão
          await listAllFiles(fullPath, allFiles);
        } else {
          // É um arquivo, adicionar com o caminho completo
          allFiles.push({
            ...item,
            fullPath: fullPath,
          });
        }
      }
    } catch (error) {
      console.error(`Error in listAllFiles for path ${path}:`, error);
    }

    return allFiles;
  };

  // Função auxiliar para extrair o caminho do arquivo da URL
  const extractFilePathFromUrl = (url: string): string | null => {
    if (!url) return null;
    
    try {
      // Decodificar URL para lidar com caracteres especiais
      const decodedUrl = decodeURIComponent(url);
      
      // Tentar diferentes formatos de URL do Supabase
      let path: string | null = null;
      
      // Formato: https://...supabase.co/storage/v1/object/public/{bucket}/path/to/file
      const fullPathPattern = `/storage/v1/object/public/${STORAGE_BUCKET}/`;
      if (decodedUrl.includes(fullPathPattern)) {
        const parts = decodedUrl.split(fullPathPattern);
        if (parts.length > 1) {
          path = parts[1].split("?")[0].split("#")[0]; // Remove query params e hash
        }
      } 
      // Formato alternativo: .../{bucket}/path/to/file
      else if (decodedUrl.includes(`/${STORAGE_BUCKET}/`)) {
        const parts = decodedUrl.split(`/${STORAGE_BUCKET}/`);
        if (parts.length > 1) {
          path = parts[1].split("?")[0].split("#")[0]; // Remove query params e hash
        }
      }
      
      // Normalizar o caminho (remover espaços extras, etc)
      return path ? path.trim() : null;
    } catch (error) {
      console.warn("Error extracting file path from URL:", url, error);
      return null;
    }
  };

  const fetchMedia = async () => {
    setLoading(true);
    try {
      console.log(`🔄 Iniciando sincronização com bucket '${STORAGE_BUCKET}'...`);
      
      // Tentar acessar o bucket diretamente primeiro (mais eficiente)
      // Se falhar, então verificar se existe
      try {
        const { data: testData, error: testError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .list("", { limit: 1 });
        
        // Se o erro for de bucket não encontrado, então verificar a lista
        if (testError && (testError.message?.includes("not found") || testError.message?.includes("does not exist") || testError.message?.includes("Bucket not found"))) {
          // Verificar se o bucket existe na lista
          const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
          if (bucketsError) {
            console.warn("Erro ao listar buckets:", bucketsError);
            // Continuar mesmo assim, pode ser um problema de permissão
          } else {
            const bucketExists = buckets?.some(b => b.name === STORAGE_BUCKET);
            if (!bucketExists) {
              toast({
                title: "Bucket não encontrado",
                description: `O bucket '${STORAGE_BUCKET}' não existe. Por favor, crie o bucket no Supabase Storage antes de usar a biblioteca de mídia.`,
                variant: "destructive",
              });
              setLoading(false);
              return;
            }
          }
        } else if (testError) {
          // Outro tipo de erro, mas não necessariamente bucket não existe
          console.warn("Erro ao acessar bucket (mas pode existir):", testError);
        }
      } catch (err) {
        // Erro na tentativa de acesso, mas continuar
        console.warn("Erro ao testar acesso ao bucket:", err);
      }
      
      // Buscar todos os arquivos do bucket recursivamente
      const bucketFiles = await listAllFiles();
      console.log(`📦 Arquivos encontrados no bucket: ${bucketFiles.length}`);

      // Buscar registros da tabela media_library
      let query = supabase.from("media_library").select("*").order("created_at", { ascending: false });

      if (selectedFolder !== "all") {
        query = query.eq("folder", selectedFolder);
      }

      const { data: dbItems, error: dbError } = await query;

      if (dbError) throw dbError;
      console.log(`📊 Registros na tabela: ${dbItems?.length || 0}`);

      // Sincronizar: adicionar arquivos do bucket que não estão na tabela
      if (bucketFiles && bucketFiles.length > 0) {
        // Criar um mapa de caminhos existentes na tabela (normalizados)
        const existingPaths = new Set<string>();
        (dbItems || []).forEach((item) => {
          const path = extractFilePathFromUrl(item.file_url);
          if (path) {
            existingPaths.add(path);
          }
        });

        // Encontrar arquivos do bucket que não estão na tabela
        const filesToSync = bucketFiles.filter((file) => {
          const normalizedPath = file.fullPath?.trim();
          return normalizedPath && !existingPaths.has(normalizedPath);
        });

        console.log(`➕ Arquivos para sincronizar: ${filesToSync.length}`);

        // Inserir arquivos faltantes na tabela
        if (filesToSync.length > 0) {
          const itemsToInsert = filesToSync.map((file) => {
            const filePath = file.fullPath;
            const publicUrl = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filePath).data.publicUrl;
            const fileExt = filePath.split(".").pop()?.toLowerCase() || "";
            const isImage = ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp", "ico"].includes(fileExt);
            const isVideo = ["mp4", "webm", "ogg", "mov", "avi", "mkv"].includes(fileExt);
            const pathParts = filePath.split("/");
            const folder = pathParts.length > 1 ? pathParts[0] : "general";

            return {
              file_url: publicUrl,
              file_type: isImage ? "image" : isVideo ? "video" : "other",
              title: file.name || filePath.split("/").pop() || "Arquivo sem nome",
              folder: folder,
              file_size: file.metadata?.size || file.size || null,
              mime_type: file.metadata?.mimetype || file.metadata?.contentType || null,
            };
          });

          // Inserir em lotes para evitar problemas com muitos arquivos
          const batchSize = 50;
          for (let i = 0; i < itemsToInsert.length; i += batchSize) {
            const batch = itemsToInsert.slice(i, i + batchSize);
            const { error: insertError } = await supabase
              .from("media_library")
              .insert(batch);

            if (insertError) {
              console.warn(`Error syncing batch ${i / batchSize + 1}:`, insertError);
              // Tentar inserir um por um se o lote falhar
              for (const item of batch) {
                const { error: singleError } = await supabase
                  .from("media_library")
                  .insert(item);
                if (singleError) {
                  console.warn("Error inserting single item:", item.title, singleError);
                }
              }
            }
          }
        }

        // Remover da tabela arquivos que não existem mais no bucket
        if (dbItems && dbItems.length > 0) {
          const bucketFilePaths = new Set(bucketFiles.map((f) => f.fullPath?.trim()).filter(Boolean));
          const itemsToRemove = dbItems.filter((item) => {
            const filePath = extractFilePathFromUrl(item.file_url);
            return filePath && !bucketFilePaths.has(filePath);
          });

          console.log(`➖ Arquivos para remover: ${itemsToRemove.length}`);

          if (itemsToRemove.length > 0) {
            const idsToRemove = itemsToRemove.map((item) => item.id);
            const { error: deleteError } = await supabase
              .from("media_library")
              .delete()
              .in("id", idsToRemove);
            
            if (deleteError) {
              console.warn("Error removing orphaned items:", deleteError);
            }
          }
        }
      } else {
        // Se o bucket estiver vazio, remover todos os registros da tabela
        if (dbItems && dbItems.length > 0) {
          console.log("⚠️ Bucket vazio, removendo todos os registros da tabela");
          const idsToRemove = dbItems.map((item) => item.id);
          await supabase.from("media_library").delete().in("id", idsToRemove);
        }
      }

      // Buscar novamente após sincronização
      const { data: finalData, error: finalError } = await supabase
        .from("media_library")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (finalError) throw finalError;

      // Aplicar filtro de pasta se necessário
      if (selectedFolder !== "all") {
        const filteredData = finalData?.filter((item) => item.folder === selectedFolder) || [];
        setMediaItems(filteredData);
        console.log(`✅ Sincronização concluída. Itens exibidos: ${filteredData.length}`);
      } else {
        setMediaItems(finalData || []);
        console.log(`✅ Sincronização concluída. Total de itens: ${finalData?.length || 0}`);
      }
    } catch (error: any) {
      console.error("Error fetching media:", error);
      const errorMessage = error.message || "";
      let userMessage = "Não foi possível carregar a biblioteca de mídia.";
      
      if (errorMessage.includes("Bucket not found") || errorMessage.includes("does not exist")) {
        userMessage = `O bucket '${STORAGE_BUCKET}' não foi encontrado. Por favor, crie o bucket no Supabase Storage (Settings > Storage > New bucket) e marque-o como público.`;
      } else if (errorMessage.includes("permission") || errorMessage.includes("policy")) {
        userMessage = `Erro de permissão ao acessar o bucket '${STORAGE_BUCKET}'. Verifique as políticas RLS no Supabase.`;
      } else if (errorMessage) {
        userMessage = errorMessage;
      }
      
      toast({
        title: "Erro",
        description: userMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUploadComplete = (url: string) => {
    fetchMedia();
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;

    // Validação: confirmar que há um item para deletar
    if (!itemToDelete.id) {
      toast({
        title: "Erro",
        description: "Item inválido para exclusão.",
        variant: "destructive",
      });
      return;
    }

    try {
      const url = itemToDelete.file_url;
      const filePath = extractFilePathFromUrl(url);

      // Deletar do storage primeiro
      if (filePath) {
        const { error: storageError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .remove([filePath]);

        if (storageError) {
          console.warn("Error deleting from storage:", storageError);
          // Continuar mesmo se falhar no storage (pode já ter sido deletado)
        }
      }

      // Deletar da database
      const { error: dbError } = await supabase
        .from("media_library")
        .delete()
        .eq("id", itemToDelete.id);

      if (dbError) throw dbError;

      toast({
        title: "Sucesso!",
        description: "Mídia excluída com sucesso.",
      });

      fetchMedia();
    } catch (error: any) {
      console.error("Error deleting media:", error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível excluir a mídia.",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const handleSync = async () => {
    setLoading(true);
    const syncToast = toast({
      title: "Sincronizando...",
      description: "Sincronizando arquivos do bucket com a biblioteca. Isso pode levar alguns instantes.",
    });
    try {
      await fetchMedia();
      toast({
        title: "Sucesso!",
        description: "Biblioteca sincronizada com o bucket.",
      });
    } catch (error: any) {
      console.error("Error syncing:", error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível sincronizar a biblioteca.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredMedia = mediaItems.filter((item) => {
    const matchesSearch =
      !searchTerm ||
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.file_url.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const folders = Array.from(new Set(mediaItems.map((item) => item.folder || "general")));

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "N/A";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold text-navy-deep mb-2">
            Biblioteca de Mídia
          </h1>
          <p className="text-gray-dark text-lg">
            Gerencie todos os arquivos de mídia do site
          </p>
        </div>

        {/* Upload Section */}
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-heading font-bold text-navy-deep mb-4">
            Fazer Upload de Nova Mídia
          </h2>
          <MediaUploader
            onUploadComplete={handleUploadComplete}
            folder="general"
            maxSize={50}
            label="Arraste e solte arquivos aqui ou clique para selecionar"
          />
        </Card>

        {/* Filters and Actions */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar mídia..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          {folders.length > 0 && (
            <select
              value={selectedFolder}
              onChange={(e) => setSelectedFolder(e.target.value)}
              className="px-4 py-2 border rounded-md bg-white"
            >
              <option value="all">Todas as pastas</option>
              {folders.map((folder) => (
                <option key={folder} value={folder}>
                  {folder}
                </option>
              ))}
            </select>
          )}
          <Button
            variant="outline"
            onClick={handleSync}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Sincronizando..." : "Sincronizar com Bucket"}
          </Button>
        </div>

        {/* Media Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Carregando...</p>
          </div>
        ) : filteredMedia.length === 0 ? (
          <Card className="p-12 text-center">
            <FolderOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Nenhuma mídia encontrada</p>
            <p className="text-gray-400 text-sm mt-2">
              {searchTerm || selectedFolder !== "all"
                ? "Tente ajustar os filtros"
                : "Faça upload de sua primeira mídia"}
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredMedia.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square relative overflow-hidden bg-gray-100">
                  {item.file_type === "image" ? (
                    <img
                      src={item.file_url}
                      alt={item.alt_text || item.title || "Mídia"}
                      className="w-full h-full object-cover"
                    />
                  ) : item.file_type === "video" ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <Video className="h-16 w-16 text-gray-400" />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <File className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        setItemToDelete(item);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-gray-900 truncate mb-1">
                    {item.title || "Sem título"}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{formatFileSize(item.file_size)}</span>
                    {item.folder && (
                      <span className="px-2 py-0.5 bg-gray-100 rounded">{item.folder}</span>
                    )}
                  </div>
                  <div className="mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs"
                      onClick={() => {
                        navigator.clipboard.writeText(item.file_url);
                        toast({
                          title: "Copiado!",
                          description: "URL copiada para a área de transferência.",
                        });
                      }}
                    >
                      Copiar URL
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir esta mídia? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
};

export default MediaLibrary;

