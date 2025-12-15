import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Trash2, Edit } from "lucide-react";
import { generateSlug } from "@/lib/pageUtils";
import MediaUploader from "@/components/admin/MediaUploader";

interface ProductFamily {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string | null;
  image_url: string | null;
  active: boolean;
  order_index: number;
}

const AdminProductFamilies = () => {
  const { toast } = useToast();
  const [families, setFamilies] = useState<ProductFamily[]>([]);
  const [editingFamily, setEditingFamily] = useState<ProductFamily | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    short_description: "",
    image_url: "",
    active: true,
  });

  useEffect(() => {
    fetchFamilies();
  }, []);

  const fetchFamilies = async () => {
    const { data, error } = await supabase
      .from("product_families")
      .select("*")
      .order("order_index", { ascending: true });

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar as famílias de produtos.",
        variant: "destructive",
      });
    } else {
      setFamilies(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const familyData = {
      name: formData.name,
      slug: formData.slug,
      description: formData.description,
      short_description: formData.short_description || null,
      image_url: formData.image_url || null,
      active: formData.active,
    };

    if (editingFamily) {
      const { error } = await supabase
        .from("product_families")
        .update(familyData)
        .eq("id", editingFamily.id);

      if (error) {
        toast({
          title: "Erro",
          description: "Não foi possível atualizar a família de produtos.",
          variant: "destructive",
        });
      } else {
        toast({ title: "Sucesso!", description: "Família de produtos atualizada." });
        resetForm();
        fetchFamilies();
      }
    } else {
      const maxOrder = Math.max(...families.map((f) => f.order_index), -1);
      const { error } = await supabase.from("product_families").insert({
        ...familyData,
        order_index: maxOrder + 1,
      });

      if (error) {
        toast({
          title: "Erro",
          description: "Não foi possível criar a família de produtos.",
          variant: "destructive",
        });
      } else {
        toast({ title: "Sucesso!", description: "Família de produtos criada." });
        resetForm();
        fetchFamilies();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta família de produtos?")) return;

    const { error } = await supabase.from("product_families").delete().eq("id", id);

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir a família de produtos.",
        variant: "destructive",
      });
    } else {
      toast({ title: "Sucesso!", description: "Família de produtos excluída." });
      fetchFamilies();
    }
  };

  const handleEdit = (family: ProductFamily) => {
    setEditingFamily(family);
    setFormData({
      name: family.name,
      slug: family.slug,
      description: family.description,
      short_description: family.short_description || "",
      image_url: family.image_url || "",
      active: family.active,
    });
  };

  const resetForm = () => {
    setEditingFamily(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      short_description: "",
      image_url: "",
      active: true,
    });
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-heading font-bold text-navy-deep mb-8">
          Gerenciamento de Famílias de Produtos
        </h1>

        {/* Form */}
        <Card className="p-8 mb-12">
          <h2 className="text-2xl font-heading font-bold text-navy-deep mb-6">
            {editingFamily ? "Editar Família" : "Nova Família de Produtos"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-heading font-semibold text-navy-deep mb-2">
                  Nome *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      name: e.target.value,
                      slug: generateSlug(e.target.value),
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
                Descrição Curta
              </label>
              <Textarea
                value={formData.short_description}
                onChange={(e) =>
                  setFormData({ ...formData, short_description: e.target.value })
                }
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-heading font-semibold text-navy-deep mb-2">
                Descrição Completa *
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={6}
                required
              />
            </div>

            <div>
              <MediaUploader
                onUploadComplete={(url) => setFormData({ ...formData, image_url: url })}
                currentUrl={formData.image_url}
                onRemove={() => setFormData({ ...formData, image_url: "" })}
                folder="product-families"
                label="Imagem da Família"
                accept="image/*"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.active}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, active: checked })
                }
              />
              <label className="text-sm font-heading font-semibold text-navy-deep">
                Ativa
              </label>
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="bg-action hover:bg-action/90 text-action-foreground">
                {editingFamily ? "Atualizar Família" : "Criar Família"}
              </Button>
              {editingFamily && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </Card>

        {/* Families List */}
        <div>
          <h2 className="text-2xl font-heading font-bold text-navy-deep mb-6">
            Famílias Cadastradas ({families.length})
          </h2>
          {families.length === 0 ? (
            <p className="text-gray-500">Nenhuma família cadastrada ainda.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {families.map((family) => (
                <Card key={family.id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {family.active ? (
                          <span className="text-green-600 text-sm font-semibold">✓ Ativa</span>
                        ) : (
                          <span className="text-gray-400 text-sm">✗ Inativa</span>
                        )}
                      </div>
                      {family.image_url && (
                        <img
                          src={family.image_url}
                          alt={family.name}
                          className="h-24 mb-4 object-contain"
                        />
                      )}
                      <h3 className="text-xl font-heading font-bold text-navy-deep mb-2">
                        {family.name}
                      </h3>
                      {family.short_description && (
                        <p className="text-gray-dark mb-2">{family.short_description}</p>
                      )}
                      <p className="text-sm text-gray-medium mb-2">{family.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-medium">
                        <span>Slug: {family.slug}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(family)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(family.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProductFamilies;
