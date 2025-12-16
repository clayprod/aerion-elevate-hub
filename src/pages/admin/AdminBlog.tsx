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
import { Trash2, Edit, Plus, Save, Eye, ArrowLeft, Upload, X, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import AdminLayout from "@/components/admin/AdminLayout";
import RichTextEditor from "@/components/RichTextEditor";
import { generateSlug } from "@/lib/pageUtils";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image?: string;
  category?: string;
  tags?: string[];
  published: boolean;
  published_at?: string;
  created_at: string;
}

const AdminBlog = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formKey, setFormKey] = useState(0); // Chave para forçar re-renderização
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    cover_image: "",
    category: "",
    tags: "",
    published: false,
  });

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/auth");
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchPosts();
    }
  }, [isAdmin]);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os posts.",
        variant: "destructive",
      });
    } else {
      setPosts(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const tags = formData.tags ? formData.tags.split(",").map((t) => t.trim()) : [];

    if (editingPost) {
      const { error } = await supabase
        .from("blog_posts")
        .update({
          ...formData,
          tags,
          published_at: formData.published ? new Date().toISOString() : null,
        })
        .eq("id", editingPost.id);

      if (error) {
        toast({
          title: "Erro",
          description: "Não foi possível atualizar o post.",
          variant: "destructive",
        });
      } else {
        toast({ title: "Sucesso!", description: "Post atualizado." });
        resetForm();
        fetchPosts();
      }
    } else {
      const { error } = await supabase.from("blog_posts").insert({
        ...formData,
        tags,
        author_id: user!.id,
        published_at: formData.published ? new Date().toISOString() : null,
      });

      if (error) {
        toast({
          title: "Erro",
          description: "Não foi possível criar o post.",
          variant: "destructive",
        });
      } else {
        toast({ title: "Sucesso!", description: "Post criado." });
        resetForm();
        fetchPosts();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este post?")) return;

    const { error } = await supabase.from("blog_posts").delete().eq("id", id);

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o post.",
        variant: "destructive",
      });
    } else {
      toast({ title: "Sucesso!", description: "Post excluído." });
      fetchPosts();
    }
  };

  const handleEdit = (post: BlogPost) => {
    console.log("Post data:", post);
    setEditingPost(post);
    
    // Forçar uma atualização completa do estado
    const newFormData = {
      title: post.title || "",
      slug: post.slug || "",
      excerpt: post.excerpt || "",
      content: post.content || "",
      cover_image: post.cover_image || "",
      category: post.category || "",
      tags: post.tags ? post.tags.join(", ") : "",
      published: post.published || false,
    };
    
    console.log("Setting form data:", newFormData);
    
    // Atualizar preview da imagem se existir
    setImagePreview(newFormData.cover_image || null);
    
    // Atualizar o estado e forçar re-renderização
    setFormData(newFormData);
    setFormKey(prev => prev + 1); // Forçar re-renderização do formulário
    console.log("Form data updated and key incremented:", newFormData);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validação de tipo de arquivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Erro",
        description: "Tipo de arquivo inválido. Use JPG, PNG, GIF ou WebP.",
        variant: "destructive",
      });
      return;
    }

    // Validação de tamanho (20MB máximo)
    const maxSize = 20 * 1024 * 1024; // 20MB
    if (file.size > maxSize) {
      toast({
        title: "Erro",
        description: "Arquivo muito grande. Tamanho máximo: 20MB.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      // Gerar nome único para o arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `blog/cover-images/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;

      // Upload para Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // Obter URL pública da imagem
      const { data: { publicUrl } } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(fileName);

      // Atualizar campo cover_image com a URL
      setFormData({ ...formData, cover_image: publicUrl });
      setImagePreview(publicUrl);

      toast({
        title: "Sucesso!",
        description: "Imagem enviada com sucesso.",
      });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível fazer upload da imagem.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      // Limpar input de arquivo
      event.target.value = '';
    }
  };

  const handleImageRemove = async () => {
    if (!formData.cover_image) return;

    // Se a imagem está no Supabase Storage, tentar remover
    const url = formData.cover_image;
    if (url.includes('supabase.co/storage')) {
      try {
        // Extrair o caminho do arquivo da URL
        const urlParts = url.split(`/${STORAGE_BUCKET}/`);
        if (urlParts.length > 1) {
          const filePath = urlParts[1];
          const { error } = await supabase.storage
            .from(STORAGE_BUCKET)
            .remove([filePath]);

          if (error) {
            console.error('Error removing image:', error);
          }
        }
      } catch (error) {
        console.error('Error removing image:', error);
      }
    }

    // Limpar campos
    setFormData({ ...formData, cover_image: '' });
    setImagePreview(null);
  };

  const resetForm = () => {
    setEditingPost(null);
    setFormKey(prev => prev + 1); // Forçar re-renderização
    setImagePreview(null);
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      cover_image: "",
      category: "",
      tags: "",
      published: false,
    });
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  if (!isAdmin) {
    return null;
  }

  // Debug: Log do estado atual do formData
  console.log("Current formData:", formData);
  console.log("Editing post:", editingPost);

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-heading font-bold text-navy-deep mb-2">
                Administração do Blog
              </h1>
              <p className="text-gray-600">Gerencie posts, conteúdo e publicações do blog</p>
            </div>
            <Button
              onClick={resetForm}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Novo Post
            </Button>
          </div>

          {/* Form */}
          <Card className="p-8 mb-8 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-heading font-bold text-navy-deep">
                {editingPost ? "Editar Post" : "Novo Post"}
              </h2>
              {editingPost && (
                <Button
                  onClick={resetForm}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Cancelar Edição
                </Button>
              )}
            </div>

            <form key={formKey} onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-heading font-semibold text-navy-deep mb-2">
                    Título *
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => {
                      console.log("Title input changed:", e.target.value);
                      setFormData({
                        ...formData,
                        title: e.target.value,
                        slug: generateSlug(e.target.value),
                      });
                    }}
                    className="border-gray-300 focus:border-blue-medium bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-heading font-semibold text-navy-deep mb-2">
                    Slug *
                  </label>
                  <Input
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="border-gray-300 focus:border-blue-medium bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-heading font-semibold text-navy-deep mb-2">
                  Resumo *
                </label>
                <Textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={3}
                  className="border-gray-300 focus:border-blue-medium bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-heading font-semibold text-navy-deep mb-2">
                  Conteúdo *
                </label>
                <RichTextEditor
                  value={formData.content}
                  onChange={(value) => setFormData({ ...formData, content: value })}
                  placeholder="Digite o conteúdo do post aqui..."
                  height="400px"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-heading font-semibold text-navy-deep mb-2">
                    Imagem de Capa
                  </label>
                  
                  {/* Preview da imagem */}
                  {(imagePreview || formData.cover_image) && (
                    <div className="relative mb-4">
                      <img
                        src={imagePreview || formData.cover_image}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg border border-gray-300"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={handleImageRemove}
                        className="absolute top-2 right-2"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}

                  {/* Upload de arquivo */}
                  <div className="mb-4">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {uploading ? (
                          <>
                            <Loader2 className="w-8 h-8 mb-2 text-blue-medium animate-spin" />
                            <p className="text-sm text-gray-600">Enviando...</p>
                          </>
                        ) : (
                          <>
                            <Upload className="w-8 h-8 mb-2 text-gray-500" />
                            <p className="mb-2 text-sm text-gray-600">
                              <span className="font-semibold">Clique para fazer upload</span> ou arraste e solte
                            </p>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF ou WebP (máx. 20MB)</p>
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                        onChange={handleImageUpload}
                        disabled={uploading}
                      />
                    </label>
                  </div>

                  {/* Campo de URL como alternativa */}
                  <div>
                    <label className="block text-xs font-heading font-semibold text-gray-600 mb-2">
                      Ou cole uma URL de imagem:
                    </label>
                    <Input
                      value={formData.cover_image}
                      onChange={(e) => {
                        setFormData({ ...formData, cover_image: e.target.value });
                        setImagePreview(e.target.value || null);
                      }}
                      placeholder="https://..."
                      className="border-gray-300 focus:border-blue-medium bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-heading font-semibold text-navy-deep mb-2">
                    Categoria
                  </label>
                  <Input
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="border-gray-300 focus:border-blue-medium bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-heading font-semibold text-navy-deep mb-2">
                  Tags (separadas por vírgula)
                </label>
                <Input
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="tecnologia, drones, industrial"
                  className="border-gray-300 focus:border-blue-medium bg-white"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.published}
                  onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                />
                <label className="text-sm font-heading font-semibold text-navy-deep">
                  Publicar
                </label>
              </div>

              <div className="flex gap-4 pt-4 border-t border-gray-200">
                <Button 
                  type="submit" 
                  className="bg-blue-medium hover:bg-blue-dark text-white flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {editingPost ? "Atualizar Post" : "Criar Post"}
                </Button>
                {editingPost && (
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancelar
                  </Button>
                )}
              </div>
            </form>
          </Card>

          {/* Posts List */}
          <Card className="p-6">
            <h2 className="text-2xl font-heading font-bold text-navy-deep mb-6">Posts Existentes</h2>
            <div className="grid grid-cols-1 gap-4">
              {posts.map((post) => (
                <Card key={post.id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-heading font-bold text-navy-deep mb-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-dark mb-2">{post.excerpt}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-medium">
                        <span>{post.published ? "✓ Publicado" : "✗ Rascunho"}</span>
                        <span>Slug: {post.slug}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(post)}
                        className="flex items-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                        className="flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        Ver
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(post.id)}
                        className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:border-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                        Excluir
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </div>
    </AdminLayout>
  );
};

export default AdminBlog;
