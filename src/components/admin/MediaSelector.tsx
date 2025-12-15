import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Image as ImageIcon, Video, X, Search, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface MediaItem {
  id: string;
  file_url: string;
  file_type: string;
  title: string | null;
  alt_text: string | null;
  folder: string | null;
  created_at: string;
}

interface MediaSelectorProps {
  onSelect: (url: string) => void;
  currentUrl?: string;
  label?: string;
  accept?: "image" | "video" | "all";
}

const MediaSelector = ({
  onSelect,
  currentUrl,
  label = "Selecionar Mídia",
  accept = "all",
}: MediaSelectorProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string>("all");

  useEffect(() => {
    if (open) {
      fetchMedia();
    }
  }, [open, selectedFolder]);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      let query = supabase.from("media_library").select("*").order("created_at", { ascending: false });

      if (accept === "image") {
        query = query.eq("file_type", "image");
      } else if (accept === "video") {
        query = query.eq("file_type", "video");
      }

      if (selectedFolder !== "all") {
        query = query.eq("folder", selectedFolder);
      }

      const { data, error } = await query;

      if (error) throw error;

      setMediaItems(data || []);
    } catch (error: any) {
      console.error("Error fetching media:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar a biblioteca de mídia.",
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

  const handleSelect = (url: string) => {
    onSelect(url);
    setOpen(false);
  };

  const folders = Array.from(new Set(mediaItems.map((item) => item.folder || "general")));

  return (
    <div className="space-y-2">
      {currentUrl && (
        <div className="flex items-center gap-2 p-2 border rounded-lg">
          <ImageIcon className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-700 flex-1 truncate">{currentUrl}</span>
          <Button variant="ghost" size="icon" onClick={() => onSelect("")}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            {currentUrl ? "Trocar Mídia" : label}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Selecionar Mídia</DialogTitle>
            <DialogDescription>Escolha uma mídia da biblioteca ou faça upload de uma nova</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Search and Filters */}
            <div className="flex gap-2">
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
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="all">Todas as pastas</option>
                  {folders.map((folder) => (
                    <option key={folder} value={folder}>
                      {folder}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Media Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : filteredMedia.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>Nenhuma mídia encontrada</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-[400px] overflow-y-auto">
                {filteredMedia.map((item) => (
                  <Card
                    key={item.id}
                    className="cursor-pointer hover:border-blue-500 transition-colors"
                    onClick={() => handleSelect(item.file_url)}
                  >
                    <div className="aspect-square relative overflow-hidden rounded-t-lg bg-gray-100">
                      {item.file_type === "image" ? (
                        <img
                          src={item.file_url}
                          alt={item.alt_text || item.title || "Mídia"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Video className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="p-2">
                      <p className="text-xs text-gray-600 truncate">{item.title || "Sem título"}</p>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MediaSelector;

