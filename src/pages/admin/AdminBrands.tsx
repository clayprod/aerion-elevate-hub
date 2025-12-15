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

interface Brand {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  website: string | null;
  active: boolean;
  order_index: number;
}

const AdminBrands = () => {
  const { toast } = useToast();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    logo_url: "",
    website: "",
    active: true,
  });

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    const { data, error } = await supabase
      .from("brands")
      .select("*")
      .order("order_index", { ascending: true });

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar as marcas.",
        variant: "destructive",
      });
    } else {
      setBrands(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const brandData = {
      name: formData.name,
      slug: formData.slug,
      description: formData.description || null,
      logo_url: formData.logo_url || null,
      website: formData.website || null,
      active: formData.active,
    };

    if (editingBrand) {
      const { error } = await supabase
        .from("brands")
        .update(brandData)
        .eq("id", editingBrand.id);

      if (error) {
        toast({
          title: "Erro",
          description: "Não foi possível atualizar a marca.",
          variant: "destructive",
        });
      } else {
        toast({ title: "Sucesso!", description: "Marca atualizada." });
        resetForm();
        fetchBrands();
      }
    } else {
      const maxOrder = Math.max(...brands.map((b) => b.order_index), -1);
      const { error } = await supabase.from("brands").insert({
        ...brandData,
        order_index: maxOrder + 1,
      });

      if (error) {
        toast({
          title: "Erro",
          description: "Não foi possível criar a marca.",
          variant: "destructive",
        });
      } else {
        toast({ title: "Sucesso!", description: "Marca criada." });
        resetForm();
        fetchBrands();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta marca?")) return;

    const { error } = await supabase.from("brands").delete().eq("id", id);

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir a marca.",
        variant: "destructive",
      });
    } else {
      toast({ title: "Sucesso!", description: "Marca excluída." });
      fetchBrands();
    }
  };

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      slug: brand.slug,
      description: brand.description || "",
      logo_url: brand.logo_url || "",
      website: brand.website || "",
      active: brand.active,
    });
  };

  const resetForm = () => {
    setEditingBrand(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      logo_url: "",
      website: "",
      active: true,
    });
  };

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: editingBrand ? prev.slug : generateSlug(name),
    }));
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-heading font-bold mb-4">
          Gerenciamento de Marcas
        </h1>

        <Card className="p-6 mb-8">
          <h2 className="text-xl font-heading font-semibold mb-4">
            {editingBrand ? "Editar Marca" : "Nova Marca"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nome *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
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
              <label className="block text-sm font-medium mb-1">
                Descrição
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Logo da Marca
              </label>
              <MediaUploader
                currentUrl={formData.logo_url}
                onUploadComplete={(url) =>
                  setFormData({ ...formData, logo_url: url })
                }
                accept="image/*"
                maxSizeMB={5}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Website
              </label>
              <Input
                type="url"
                value={formData.website}
                onChange={(e) =>
                  setFormData({ ...formData, website: e.target.value })
                }
                placeholder="https://exemplo.com"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.active}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, active: checked })
                }
              />
              <label className="text-sm font-medium">Ativa</label>
            </div>

            <div className="flex gap-2">
              <Button type="submit">
                {editingBrand ? "Atualizar Marca" : "Criar Marca"}
              </Button>
              {editingBrand && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </Card>

        <div>
          <h2 className="text-2xl font-heading font-semibold mb-4">
            Marcas Cadastradas ({brands.length})
          </h2>
          {brands.length === 0 ? (
            <p className="text-gray-500">Nenhuma marca cadastrada ainda.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {brands.map((brand) => (
                <Card key={brand.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      {brand.logo_url && (
                        <img
                          src={brand.logo_url}
                          alt={brand.name}
                          className="h-12 mb-2 object-contain"
                        />
                      )}
                      <h3 className="text-xl font-heading font-bold">
                        {brand.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Slug: {brand.slug}
                      </p>
                      {brand.description && (
                        <p className="text-sm text-gray-700 mt-2">
                          {brand.description}
                        </p>
                      )}
                      {brand.website && (
                        <a
                          href={brand.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-medium hover:underline mt-2 block"
                        >
                          {brand.website}
                        </a>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(brand)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(brand.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    {brand.active ? (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        ✓ Ativa
                      </span>
                    ) : (
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                        Inativa
                      </span>
                    )}
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

export default AdminBrands;
