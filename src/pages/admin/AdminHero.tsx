import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Trash2, Edit, Plus, ArrowUp, ArrowDown } from "lucide-react";
import MediaUploader from "@/components/admin/MediaUploader";

interface HeroMedia {
  id: string;
  media_type: string;
  media_url: string;
  title: string | null;
  description: string | null;
  order_index: number;
  active: boolean;
}

interface HeroContent {
  title: string;
  subtitle: string;
  cta_text: string;
  cta_link: string;
}

const AdminHero = () => {
  const { toast } = useToast();
  const [heroContent, setHeroContent] = useState<HeroContent>({
    title: "",
    subtitle: "",
    cta_text: "",
    cta_link: "",
  });
  const [heroMedia, setHeroMedia] = useState<HeroMedia[]>([]);
  const [editingMedia, setEditingMedia] = useState<HeroMedia | null>(null);
  const [mediaForm, setMediaForm] = useState({
    media_type: "image",
    media_url: "",
    title: "",
    description: "",
    active: true,
  });

  useEffect(() => {
    fetchHeroContent();
    fetchHeroMedia();
  }, []);

  const fetchHeroContent = async () => {
    const { data, error } = await supabase
      .from("site_content")
      .select("content")
      .eq("section", "hero")
      .single();

    if (!error && data) {
      setHeroContent(data.content as HeroContent);
    }
  };

  const fetchHeroMedia = async () => {
    const { data, error } = await supabase
      .from("hero_media")
      .select("*")
      .order("order_index", { ascending: true });

    if (!error && data) {
      setHeroMedia(data);
    }
  };

  const handleSaveContent = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase
      .from("site_content")
      .upsert({
        section: "hero",
        content: heroContent,
      }, {
        onConflict: "section",
      });

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar o conteúdo.",
        variant: "destructive",
      });
    } else {
      toast({ title: "Sucesso!", description: "Conteúdo atualizado." });
    }
  };

  const handleSaveMedia = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingMedia) {
      const { error } = await supabase
        .from("hero_media")
        .update(mediaForm)
        .eq("id", editingMedia.id);

      if (error) {
        toast({
          title: "Erro",
          description: "Não foi possível atualizar a mídia.",
          variant: "destructive",
        });
      } else {
        toast({ title: "Sucesso!", description: "Mídia atualizada." });
        resetMediaForm();
        fetchHeroMedia();
      }
    } else {
      const maxOrder = Math.max(...heroMedia.map((m) => m.order_index), 0);
      const { error } = await supabase.from("hero_media").insert({
        ...mediaForm,
        order_index: maxOrder + 1,
      });

      if (error) {
        toast({
          title: "Erro",
          description: "Não foi possível adicionar a mídia.",
          variant: "destructive",
        });
      } else {
        toast({ title: "Sucesso!", description: "Mídia adicionada." });
        resetMediaForm();
        fetchHeroMedia();
      }
    }
  };

  const handleDeleteMedia = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta mídia?")) return;

    const { error } = await supabase.from("hero_media").delete().eq("id", id);

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir a mídia.",
        variant: "destructive",
      });
    } else {
      toast({ title: "Sucesso!", description: "Mídia excluída." });
      fetchHeroMedia();
    }
  };

  const handleReorderMedia = async (id: string, direction: "up" | "down") => {
    const currentIndex = heroMedia.findIndex((m) => m.id === id);
    if (currentIndex === -1) return;

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= heroMedia.length) return;

    const updates = [
      { id: heroMedia[currentIndex].id, order_index: targetIndex },
      { id: heroMedia[targetIndex].id, order_index: currentIndex },
    ];

    for (const update of updates) {
      await supabase.from("hero_media").update({ order_index: update.order_index }).eq("id", update.id);
    }

    fetchHeroMedia();
  };

  const resetMediaForm = () => {
    setEditingMedia(null);
    setMediaForm({
      media_type: "image",
      media_url: "",
      title: "",
      description: "",
      active: true,
    });
  };

  const handleEditMedia = (media: HeroMedia) => {
    setEditingMedia(media);
    setMediaForm({
      media_type: media.media_type,
      media_url: media.media_url,
      title: media.title || "",
      description: media.description || "",
      active: media.active,
    });
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-heading font-bold text-navy-deep mb-8">
            Gerenciar Hero Section
          </h1>

          {/* Hero Content Form */}
          <Card className="p-8 mb-12">
            <h2 className="text-2xl font-heading font-bold text-navy-deep mb-6">
              Conteúdo do Hero
            </h2>

            <form onSubmit={handleSaveContent} className="space-y-6">
              <div>
                <label className="block text-sm font-heading font-semibold text-navy-deep mb-2">
                  Título Principal *
                </label>
                <Input
                  value={heroContent.title}
                  onChange={(e) => setHeroContent({ ...heroContent, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-heading font-semibold text-navy-deep mb-2">
                  Subtítulo *
                </label>
                <Textarea
                  value={heroContent.subtitle}
                  onChange={(e) => setHeroContent({ ...heroContent, subtitle: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-heading font-semibold text-navy-deep mb-2">
                    Texto do CTA *
                  </label>
                  <Input
                    value={heroContent.cta_text}
                    onChange={(e) => setHeroContent({ ...heroContent, cta_text: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-heading font-semibold text-navy-deep mb-2">
                    Link do CTA *
                  </label>
                  <Input
                    value={heroContent.cta_link}
                    onChange={(e) => setHeroContent({ ...heroContent, cta_link: e.target.value })}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="bg-action hover:bg-action/90 text-action-foreground">
                Salvar Conteúdo
              </Button>
            </form>
          </Card>

          {/* Hero Media Form */}
          <Card className="p-8 mb-12">
            <h2 className="text-2xl font-heading font-bold text-navy-deep mb-6">
              {editingMedia ? "Editar Mídia" : "Adicionar Mídia"}
            </h2>

            <form onSubmit={handleSaveMedia} className="space-y-6">
              <div>
                <label className="block text-sm font-heading font-semibold text-navy-deep mb-2">
                  Tipo de Mídia *
                </label>
                <select
                  value={mediaForm.media_type}
                  onChange={(e) => setMediaForm({ ...mediaForm, media_type: e.target.value })}
                  className="w-full border rounded-md p-2"
                  required
                >
                  <option value="image">Imagem</option>
                  <option value="video">Vídeo</option>
                </select>
              </div>

              <div>
                <MediaUploader
                  onUploadComplete={(url) => setMediaForm({ ...mediaForm, media_url: url })}
                  currentUrl={mediaForm.media_url}
                  onRemove={() => setMediaForm({ ...mediaForm, media_url: "" })}
                  folder="hero"
                  label="Mídia (Upload ou URL)"
                  accept={mediaForm.media_type === "video" ? "video/*" : "image/*"}
                />
              </div>

              <div>
                <label className="block text-sm font-heading font-semibold text-navy-deep mb-2">
                  Título
                </label>
                <Input
                  value={mediaForm.title}
                  onChange={(e) => setMediaForm({ ...mediaForm, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-heading font-semibold text-navy-deep mb-2">
                  Descrição
                </label>
                <Textarea
                  value={mediaForm.description}
                  onChange={(e) => setMediaForm({ ...mediaForm, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={mediaForm.active}
                  onCheckedChange={(checked) => setMediaForm({ ...mediaForm, active: checked })}
                />
                <label className="text-sm font-heading font-semibold text-navy-deep">Ativa</label>
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="bg-action hover:bg-action/90 text-action-foreground">
                  {editingMedia ? "Atualizar Mídia" : "Adicionar Mídia"}
                </Button>
                {editingMedia && (
                  <Button type="button" variant="outline" onClick={resetMediaForm}>
                    Cancelar
                  </Button>
                )}
              </div>
            </form>
          </Card>

          {/* Media List */}
          <div>
            <h2 className="text-2xl font-heading font-bold text-navy-deep mb-6">
              Mídias do Hero ({heroMedia.length})
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {heroMedia.map((media, index) => (
                <Card key={media.id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="bg-gray-100 px-2 py-1 rounded text-sm font-semibold">
                          {media.media_type}
                        </span>
                        {media.active ? (
                          <span className="text-green-600 text-sm font-semibold">✓ Ativa</span>
                        ) : (
                          <span className="text-gray-400 text-sm">✗ Inativa</span>
                        )}
                      </div>
                      <h3 className="text-lg font-heading font-bold text-navy-deep mb-1">
                        {media.title || "Sem título"}
                      </h3>
                      <p className="text-gray-dark text-sm mb-2">{media.description}</p>
                      <p className="text-gray-medium text-xs break-all">{media.media_url}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReorderMedia(media.id, "up")}
                        disabled={index === 0}
                      >
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReorderMedia(media.id, "down")}
                        disabled={index === heroMedia.length - 1}
                      >
                        <ArrowDown className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEditMedia(media)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteMedia(media.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminHero;

