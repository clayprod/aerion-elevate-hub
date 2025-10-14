import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Trash2, Edit, Plus } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      cover_image: "",
      category: "",
      tags: "",
      published: post.published,
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

      <main className="pt-28 pb-20">
        <div className="container-custom max-w-6xl">
          <h1 className="text-4xl font-heading font-bold text-navy-deep mb-8">
            Administração do Blog
          </h1>

          {/* Form */}
          <Card className="p-8 mb-12">
            <h2 className="text-2xl font-heading font-bold text-navy-deep mb-6">
              {editingPost ? "Editar Post" : "Novo Post"}
            </h2>

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
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-heading font-semibold text-navy-deep mb-2">
                  Conteúdo *
                </label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={12}
                  required
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
                  />
                </div>

                <div>
                  <label className="block text-sm font-heading font-semibold text-navy-deep mb-2">
                    Categoria
                  </label>
                  <Input
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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

              <div className="flex gap-4">
                <Button type="submit" className="bg-action hover:bg-action/90">
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
          <div>
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
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(post.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminBlog;
