import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Trash2, Edit, Plus, Save, Eye, ArrowLeft } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RichTextEditor from "@/components/RichTextEditor";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  published: boolean;
  created_at: string;
}

const AdminBlog = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
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
    console.log("Editing post:", post);
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      cover_image: post.cover_image || "",
      category: post.category || "",
      tags: post.tags ? post.tags.join(", ") : "",
      published: post.published,
    });
    console.log("Form data set:", {
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      cover_image: post.cover_image || "",
      category: post.category || "",
      tags: post.tags ? post.tags.join(", ") : "",
    });
  };

  const resetForm = () => {
    setEditingPost(null);
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

  return (
    <div className="min-h-screen">
      <Header />

      <main className="pt-28 pb-20 bg-gray-50 min-h-screen">
        <div className="container-custom max-w-7xl">
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

            <form onSubmit={handleSubmit} className="space-y-6">
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
                        slug: e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, ""),
                      });
                    }}
                    className="border-gray-300 focus:border-aerion-blue bg-white"
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
                    className="border-gray-300 focus:border-aerion-blue bg-white"
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
                  className="border-gray-300 focus:border-aerion-blue bg-white"
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
                    URL da Imagem de Capa
                  </label>
                  <Input
                    value={formData.cover_image}
                    onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                    placeholder="https://..."
                    className="border-gray-300 focus:border-aerion-blue bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-heading font-semibold text-navy-deep mb-2">
                    Categoria
                  </label>
                  <Input
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="border-gray-300 focus:border-aerion-blue bg-white"
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
                  className="border-gray-300 focus:border-aerion-blue bg-white"
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
                  className="bg-aerion-blue hover:bg-aerion-blue/90 text-white flex items-center gap-2"
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
      </main>

      <Footer />
    </div>
  );
};

export default AdminBlog;
