import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Trash2, Edit, Plus, X } from "lucide-react";
import { generateSlug } from "@/lib/pageUtils";
import MediaUploader from "@/components/admin/MediaUploader";
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
  const [showForm, setShowForm] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    setIsSubmitting(true);

    // Validação de slug
    if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      toast({
        title: "Erro de validação",
        description: "O slug deve conter apenas letras minúsculas, números e hífens.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Validação de URL
    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      toast({
        title: "Erro de validação",
        description: "A URL do website deve começar com http:// ou https://",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Verificar se slug já existe (apenas para criação)
    if (!editingBrand) {
      const { data: existing } = await supabase
        .from("brands")
        .select("id")
        .eq("slug", formData.slug)
        .maybeSingle();

      if (existing) {
        toast({
          title: "Erro de validação",
          description: "Já existe uma marca com este slug. Por favor, escolha outro.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
    }

    const brandData = {
      name: formData.name,
      slug: formData.slug,
      description: formData.description || null,
      logo_url: formData.logo_url || null,
      website: formData.website || null,
      active: formData.active,
    };

    try {
      if (editingBrand) {
        const { error } = await supabase
          .from("brands")
          .update(brandData)
          .eq("id", editingBrand.id);

        if (error) {
          throw error;
        }
        toast({
          title: "Sucesso!",
          description: `Marca "${formData.name}" atualizada com sucesso.`,
        });
      } else {
        const maxOrder = Math.max(...brands.map((b) => b.order_index), -1);
        const { error } = await supabase.from("brands").insert({
          ...brandData,
          order_index: maxOrder + 1,
        });

        if (error) {
          throw error;
        }
        toast({
          title: "Sucesso!",
          description: `Marca "${formData.name}" criada com sucesso.`,
        });
      }
      resetForm();
      fetchBrands();
    } catch (error: any) {
      console.error("Error saving brand:", error);
      toast({
        title: "Erro ao salvar marca",
        description: error.message || "Não foi possível salvar a marca. Verifique os dados e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (brand: Brand) => {
    setBrandToDelete(brand);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!brandToDelete) return;

    const { error } = await supabase.from("brands").delete().eq("id", brandToDelete.id);

    if (error) {
      toast({
        title: "Erro ao excluir marca",
        description: error.message || "Não foi possível excluir a marca. Tente novamente.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Sucesso!",
        description: `Marca "${brandToDelete.name}" excluída com sucesso.`,
      });
      fetchBrands();
    }

    setDeleteDialogOpen(false);
    setBrandToDelete(null);
  };

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setShowForm(true);
    setFormData({
      name: brand.name,
      slug: brand.slug,
      description: brand.description || "",
      logo_url: brand.logo_url || "",
      website: brand.website || "",
      active: brand.active,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddNew = () => {
    resetForm();
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setEditingBrand(null);
    setShowForm(false);
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
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-heading font-bold text-navy-deep">
            Gerenciamento de Marcas
          </h1>
          {!showForm && (
            <Button
              onClick={handleAddNew}
              className="bg-action hover:bg-action/90 text-action-foreground"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Nova Marca
            </Button>
          )}
        </div>

        {showForm && (
          <Card className="p-8 mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-heading font-bold text-navy-deep">
                {editingBrand ? (
                  <span>
                    Editando: <span className="text-blue-medium">{editingBrand.name}</span>
                  </span>
                ) : (
                  "Nova Marca"
                )}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={resetForm}
                aria-label="Fechar formulário"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
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

            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting} className="bg-action hover:bg-action/90 text-action-foreground">
                {isSubmitting
                  ? "Salvando..."
                  : editingBrand
                  ? "Atualizar Marca"
                  : "Criar Marca"}
              </Button>
              <Button type="button" variant="outline" onClick={resetForm} disabled={isSubmitting}>
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
        )}

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
                        onClick={() => handleDeleteClick(brand)}
                        aria-label={`Excluir marca ${brand.name}`}
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

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir a marca <strong>"{brandToDelete?.name}"</strong>?
                <br />
                <br />
                Esta ação não pode ser desfeita e a marca será removida permanentemente.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setBrandToDelete(null)}>
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
    </AdminLayout>
  );
};

export default AdminBrands;
