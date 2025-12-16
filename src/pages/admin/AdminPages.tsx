import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { STORAGE_BUCKET } from "@/integrations/supabase/storage";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Trash2, Edit, Plus, Save, Eye, ArrowLeft, Upload, X, Loader2, Copy } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import AdminLayout from "@/components/admin/AdminLayout";
import RichTextEditor from "@/components/RichTextEditor";
import SanitizedHTML from "@/components/SanitizedHTML";
import { generateSlug, isValidDynamicPath } from "@/lib/pageUtils";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CustomPage {
  id: string;
  title: string;
  slug: string;
  path: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  gallery_images?: string[];
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
  published: boolean;
  template: string;
  order_index: number;
  version: number;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

const AdminPages = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [pages, setPages] = useState<CustomPage[]>([]);
  const [editingPage, setEditingPage] = useState<CustomPage | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pageToDelete, setPageToDelete] = useState<CustomPage | null>(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPublished, setFilterPublished] = useState<"all" | "published" | "draft">("all");
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    path: "",
    content: "",
    excerpt: "",
    featured_image: "",
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    published: false,
    template: "default",
  });

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/auth");
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchPages();
    }
  }, [isAdmin]);

  const fetchPages = async () => {
    try {
      const { data, error } = await supabase
        .from("custom_pages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching pages:", error);
        toast({
          title: "Erro ao carregar páginas",
          description: error.message || "Não foi possível carregar as páginas. Verifique as políticas RLS no Supabase.",
          variant: "destructive",
        });
        setPages([]);
      } else {
        setPages(data || []);
      }
    } catch (err) {
      console.error("Unexpected error fetching pages:", err);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao carregar as páginas.",
        variant: "destructive",
      });
      setPages([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validações
    if (!formData.title.trim()) {
      toast({
        title: "Erro",
        description: "O título é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.path.trim()) {
      toast({
        title: "Erro",
        description: "O caminho (path) é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    if (!isValidDynamicPath(formData.path)) {
      toast({
        title: "Erro",
        description: "O caminho (path) é inválido ou conflita com uma rota existente.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.content.trim()) {
      toast({
        title: "Erro",
        description: "O conteúdo é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    const keywords = formData.meta_keywords
      ? formData.meta_keywords.split(",").map((k) => k.trim()).filter(Boolean)
      : [];

    if (editingPage) {
      const { error } = await supabase
        .from("custom_pages")
        .update({
          ...formData,
          slug: formData.slug || generateSlug(formData.title),
          meta_keywords: keywords,
          published_at: formData.published && !editingPage.published_at
            ? new Date().toISOString()
            : editingPage.published_at,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingPage.id);

      if (error) {
        toast({
          title: "Erro",
          description: error.message || "Não foi possível atualizar a página.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Sucesso!",
          description: "Página atualizada com sucesso.",
        });
        resetForm();
        fetchPages();
      }
    } else {
      const { error } = await supabase.from("custom_pages").insert({
        ...formData,
        slug: formData.slug || generateSlug(formData.title),
        meta_keywords: keywords,
        published_at: formData.published ? new Date().toISOString() : null,
        created_by: user?.id,
      });

      if (error) {
        toast({
          title: "Erro",
          description: error.message || "Não foi possível criar a página.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Sucesso!",
          description: "Página criada com sucesso.",
        });
        resetForm();
        fetchPages();
      }
    }
  };

  const handleEdit = (page: CustomPage) => {
    setEditingPage(page);
    setFormData({
      title: page.title,
      slug: page.slug,
      path: page.path,
      content: page.content,
      excerpt: page.excerpt || "",
      featured_image: page.featured_image || "",
      meta_title: page.meta_title || "",
      meta_description: page.meta_description || "",
      meta_keywords: page.meta_keywords?.join(", ") || "",
      published: page.published,
      template: page.template || "default",
    });
    setImagePreview(page.featured_image || null);
    setFormKey((prev) => prev + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async () => {
    if (!pageToDelete) return;

    const { error } = await supabase
      .from("custom_pages")
      .delete()
      .eq("id", pageToDelete.id);

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir a página.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Sucesso!",
        description: "Página excluída com sucesso.",
      });
      fetchPages();
    }

    setDeleteDialogOpen(false);
    setPageToDelete(null);
  };

  const handleDuplicate = async (page: CustomPage) => {
    const { error } = await supabase.from("custom_pages").insert({
      title: `${page.title} (Cópia)`,
      slug: `${page.slug}-copia-${Date.now()}`,
      path: `${page.path}-copia-${Date.now()}`,
      content: page.content,
      excerpt: page.excerpt,
      featured_image: page.featured_image,
      gallery_images: page.gallery_images,
      meta_title: page.meta_title,
      meta_description: page.meta_description,
      meta_keywords: page.meta_keywords,
      published: false,
      template: page.template,
      created_by: user?.id,
    });

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível duplicar a página.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Sucesso!",
        description: "Página duplicada com sucesso.",
      });
      fetchPages();
    }
  };

  const resetForm = () => {
    setEditingPage(null);
    setFormData({
      title: "",
      slug: "",
      path: "",
      content: "",
      excerpt: "",
      featured_image: "",
      meta_title: "",
      meta_description: "",
      meta_keywords: "",
      published: false,
      template: "default",
    });
    setImagePreview(null);
    setFormKey((prev) => prev + 1);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Erro",
        description: "Por favor, selecione uma imagem válida.",
        variant: "destructive",
      });
      return;
    }

    // Validar tamanho (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erro",
        description: "A imagem deve ter no máximo 5MB.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const fileName = `pages/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(fileName);

      setFormData({ ...formData, featured_image: publicUrl });
      setImagePreview(publicUrl);

      toast({
        title: "Sucesso!",
        description: "Imagem enviada com sucesso.",
      });
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível fazer upload da imagem.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleImageRemove = async () => {
    if (!formData.featured_image) return;

    const url = formData.featured_image;
    if (url.includes("supabase.co/storage")) {
      try {
        const urlParts = url.split(`/${STORAGE_BUCKET}/`);
        if (urlParts.length > 1) {
          const filePath = urlParts[1];
          await supabase.storage.from(STORAGE_BUCKET).remove([filePath]);
        }
      } catch (error) {
        console.error("Error removing image:", error);
      }
    }

    setFormData({ ...formData, featured_image: "" });
    setImagePreview(null);
  };

  const filteredPages = pages.filter((page) => {
    const matchesSearch =
      page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.slug.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterPublished === "all" ||
      (filterPublished === "published" && page.published) ||
      (filterPublished === "draft" && !page.published);

    return matchesSearch && matchesFilter;
  });

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-4xl font-heading font-bold text-navy-deep mb-2">
                  Gerenciar Páginas
                </h1>
                <p className="text-gray-dark text-lg">
                  Crie e gerencie páginas dinâmicas do site
                </p>
              </div>
              <Button variant="outline" onClick={() => navigate("/admin")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar ao Dashboard
              </Button>
            </div>
          </div>

          {/* Form */}
          <Card className="p-8 mb-12">
            <h2 className="text-2xl font-heading font-bold text-navy-deep mb-6">
              {editingPage ? "Editar Página" : "Nova Página"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6" key={formKey}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-heading font-semibold text-navy-deep mb-2">
                    Título *
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        title: e.target.value,
                        slug: formData.slug || generateSlug(e.target.value),
                      });
                    }}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-heading font-semibold text-navy-deep mb-2">
                    Slug *
                  </label>
                  <Input
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-heading font-semibold text-navy-deep mb-2">
                  Caminho (Path) *
                  <span className="text-xs text-gray-500 ml-2">
                    Ex: /sobre-nos, /servicos/consultoria, ou /sobre (para sobrescrever página estática)
                  </span>
                </label>
                <Input
                  value={formData.path}
                  onChange={(e) => setFormData({ ...formData, path: e.target.value })}
                  placeholder="/minha-pagina ou /sobre"
                  required
                />
                {formData.path && !isValidDynamicPath(formData.path) && (
                  <p className="text-sm text-red-600 mt-1">
                    Caminho inválido ou conflita com uma rota protegida (admin, auth, blog).
                  </p>
                )}
                {formData.path && isValidDynamicPath(formData.path) && (
                  <p className="text-sm text-green-600 mt-1">
                    ✓ Você pode sobrescrever páginas estáticas existentes criando uma página customizada com o mesmo path.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-heading font-semibold text-navy-deep mb-2">
                  Resumo (Excerpt)
                </label>
                <Textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={3}
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.excerpt.length}/500 caracteres
                </p>
              </div>

              <div>
                <label className="block text-sm font-heading font-semibold text-navy-deep mb-2">
                  Conteúdo *
                </label>
                <RichTextEditor
                  value={formData.content}
                  onChange={(value) => setFormData({ ...formData, content: value })}
                  height="400px"
                />
              </div>

              <div>
                <label className="block text-sm font-heading font-semibold text-navy-deep mb-2">
                  Imagem Destacada
                </label>
                {imagePreview ? (
                  <div className="relative inline-block">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-64 h-64 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={handleImageRemove}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <label className="cursor-pointer">
                      <span className="text-blue-medium">Clique para fazer upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                    {uploading && <Loader2 className="animate-spin mx-auto mt-2" />}
                  </div>
                )}
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-heading font-semibold text-navy-deep mb-4">
                  SEO e Metadados
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-heading font-semibold text-navy-deep mb-2">
                      Meta Title
                      <span className="text-xs text-gray-500 ml-2">(máx 70 caracteres)</span>
                    </label>
                    <Input
                      value={formData.meta_title}
                      onChange={(e) =>
                        setFormData({ ...formData, meta_title: e.target.value })
                      }
                      maxLength={70}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.meta_title.length}/70 caracteres
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-heading font-semibold text-navy-deep mb-2">
                      Meta Description
                      <span className="text-xs text-gray-500 ml-2">(máx 160 caracteres)</span>
                    </label>
                    <Textarea
                      value={formData.meta_description}
                      onChange={(e) =>
                        setFormData({ ...formData, meta_description: e.target.value })
                      }
                      rows={2}
                      maxLength={160}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.meta_description.length}/160 caracteres
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-heading font-semibold text-navy-deep mb-2">
                    Meta Keywords
                    <span className="text-xs text-gray-500 ml-2">
                      (separados por vírgula)
                    </span>
                  </label>
                  <Input
                    value={formData.meta_keywords}
                    onChange={(e) =>
                      setFormData({ ...formData, meta_keywords: e.target.value })
                    }
                    placeholder="tecnologia, drones, autel"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, published: checked })
                  }
                />
                <label htmlFor="published" className="text-sm font-medium">
                  Publicar página
                </label>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={uploading}>
                  <Save className="mr-2 h-4 w-4" />
                  {editingPage ? "Atualizar" : "Criar"} Página
                </Button>
                {editingPage && (
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancelar
                  </Button>
                )}
              </div>
            </form>
          </Card>

          {/* List */}
          <Card className="p-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <Input
                placeholder="Buscar páginas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <div className="flex gap-2">
                <Button
                  variant={filterPublished === "all" ? "default" : "outline"}
                  onClick={() => setFilterPublished("all")}
                >
                  Todas
                </Button>
                <Button
                  variant={filterPublished === "published" ? "default" : "outline"}
                  onClick={() => setFilterPublished("published")}
                >
                  Publicadas
                </Button>
                <Button
                  variant={filterPublished === "draft" ? "default" : "outline"}
                  onClick={() => setFilterPublished("draft")}
                >
                  Rascunhos
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {filteredPages.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  {searchTerm || filterPublished !== "all"
                    ? "Nenhuma página encontrada."
                    : "Nenhuma página criada ainda."}
                </p>
              ) : (
                filteredPages.map((page) => (
                  <div
                    key={page.id}
                    className="border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-heading font-bold text-navy-deep">
                          {page.title}
                        </h3>
                        {page.published ? (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                            Publicada
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                            Rascunho
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="font-semibold">Path:</span> {page.path}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Slug:</span> {page.slug}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setPreviewDialogOpen(true);
                          setEditingPage(page);
                        }}
                        title="Visualizar"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDuplicate(page)}
                        title="Duplicar"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(page)}
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => {
                          setPageToDelete(page);
                          setDeleteDialogOpen(true);
                        }}
                        title="Excluir"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a página "{pageToDelete?.title}"? Esta ação não pode
              ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPage?.title}</DialogTitle>
            <DialogDescription>
              Preview da página - {editingPage?.path}
            </DialogDescription>
          </DialogHeader>
          {editingPage && (
            <div className="prose max-w-none">
              <SanitizedHTML html={editingPage.content} />
            </div>
          )}
        </DialogContent>
      </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminPages;

