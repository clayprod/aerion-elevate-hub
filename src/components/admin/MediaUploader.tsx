import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, Loader2, Image as ImageIcon, Video, File } from "lucide-react";
import { Card } from "@/components/ui/card";

interface MediaUploaderProps {
  onUploadComplete: (url: string) => void;
  accept?: string;
  folder?: string;
  maxSize?: number; // in MB
  currentUrl?: string;
  onRemove?: () => void;
  label?: string;
}

const MediaUploader = ({
  onUploadComplete,
  accept = "image/*,video/*",
  folder = "general",
  maxSize = 20,
  currentUrl,
  onRemove,
  label = "Upload de Mídia",
}: MediaUploaderProps) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [urlMode, setUrlMode] = useState(false);
  const [urlValue, setUrlValue] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      toast({
        title: "Erro",
        description: `Arquivo muito grande. Tamanho máximo: ${maxSize}MB.`,
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Generate unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("public-images")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("public-images").getPublicUrl(fileName);

      // Save to media_library
      const { error: mediaError } = await supabase.from("media_library").insert({
        file_url: publicUrl,
        file_type: file.type.startsWith("image/") ? "image" : file.type.startsWith("video/") ? "video" : "other",
        title: file.name,
        folder: folder,
        file_size: file.size,
        mime_type: file.type,
      });

      if (mediaError) {
        console.error("Error saving to media library:", mediaError);
        // Don't fail the upload if media library insert fails
      }

      setUploadProgress(100);
      onUploadComplete(publicUrl);

      toast({
        title: "Sucesso!",
        description: "Arquivo enviado com sucesso.",
      });
    } catch (error: any) {
      console.error("Error uploading file:", error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível fazer upload do arquivo.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleUrlSubmit = () => {
    if (urlValue.trim()) {
      onUploadComplete(urlValue.trim());
      setUrlMode(false);
      setUrlValue("");
    }
  };

  const getFileIcon = (url: string) => {
    if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      return <ImageIcon className="h-8 w-8 text-blue-600" />;
    } else if (url.match(/\.(mp4|webm|ogg)$/i)) {
      return <Video className="h-8 w-8 text-purple-600" />;
    }
    return <File className="h-8 w-8 text-gray-600" />;
  };

  if (currentUrl) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getFileIcon(currentUrl)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{currentUrl}</p>
                <p className="text-xs text-gray-500">URL da mídia</p>
              </div>
            </div>
            {onRemove && (
              <Button variant="ghost" size="icon" onClick={onRemove}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      
      {!urlMode ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50"
          } ${uploading ? "opacity-50 pointer-events-none" : "cursor-pointer hover:bg-gray-100"}`}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
          
          {uploading ? (
            <div className="space-y-2">
              <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto" />
              <p className="text-sm text-gray-600">Enviando... {uploadProgress}%</p>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="h-12 w-12 text-gray-400 mx-auto" />
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Clique para fazer upload ou arraste e solte
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {accept.includes("image") && accept.includes("video")
                    ? "Imagens ou vídeos"
                    : accept.includes("image")
                    ? "Imagens"
                    : "Vídeos"}{" "}
                  (máx. {maxSize}MB)
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <Input
            type="url"
            placeholder="https://..."
            value={urlValue}
            onChange={(e) => setUrlValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleUrlSubmit()}
          />
          <div className="flex gap-2">
            <Button onClick={handleUrlSubmit} size="sm">
              Usar URL
            </Button>
            <Button onClick={() => setUrlMode(false)} variant="outline" size="sm">
              Cancelar
            </Button>
          </div>
        </div>
      )}

      <div className="flex justify-center">
        <Button
          variant="link"
          size="sm"
          onClick={() => setUrlMode(!urlMode)}
          className="text-xs"
        >
          {urlMode ? "Ou fazer upload de arquivo" : "Ou usar URL"}
        </Button>
      </div>
    </div>
  );
};

export default MediaUploader;

