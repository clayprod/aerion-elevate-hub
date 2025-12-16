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
  const [showForm, setShowForm] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [familyToDelete, setFamilyToDelete] = useState<ProductFamily | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

    // Verificar se slug já existe (apenas para criação)
    if (!editingFamily) {
      const { data: existing } = await supabase
        .from("product_families")
        .select("id")
        .eq("slug", formData.slug)
        .maybeSingle();

      if (existing) {
        toast({
          title: "Erro de validação",
          description: "Já existe uma família de produtos com este slug. Por favor, escolha outro.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
    }

    const familyData = {
      name: formData.name,
      slug: formData.slug,
      description: formData.description,
      short_description: formData.short_description || null,
      image_url: formData.image_url || null,
      active: formData.active,
    };

    try {
      if (editingFamily) {
        const { error } = await supabase
          .from("product_families")
          .update(familyData)
          .eq("id", editingFamily.id);

        if (error) {
          throw error;
        }
        toast({
          title: "Sucesso!",
          description: `Família de produtos "${formData.name}" atualizada com sucesso.`,
        });
      } else {
        const maxOrder = Math.max(...families.map((f) => f.order_index), -1);
        const { error } = await supabase.from("product_families").insert({
          ...familyData,
          order_index: maxOrder + 1,
        });

        if (error) {
          throw error;
        }
        toast({
          title: "Sucesso!",
          description: `Família de produtos "${formData.name}" criada com sucesso.`,
        });
      }
      resetForm();
      fetchFamilies();
    } catch (error: any) {
      console.error("Error saving product family:", error);
      toast({
        title: "Erro ao salvar família de produtos",
        description: error.message || "Não foi possível salvar a família de produtos. Verifique os dados e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (family: ProductFamily) => {
    setFamilyToDelete(family);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!familyToDelete) return;

    const { error } = await supabase.from("product_families").delete().eq("id", familyToDelete.id);

    if (error) {
      toast({
        title: "Erro ao excluir família de produtos",
        description: error.message || "Não foi possível excluir a família de produtos. Tente novamente.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Sucesso!",
        description: `Família de produtos "${familyToDelete.name}" excluída com sucesso.`,
      });
      fetchFamilies();
    }

    setDeleteDialogOpen(false);
    setFamilyToDelete(null);
  };

  const handleEdit = (family: ProductFamily) => {
    setEditingFamily(family);
    setShowForm(true);
    setFormData({
      name: family.name,
      slug: family.slug,
      description: family.description,
      short_description: family.short_description || "",
      image_url: family.image_url || "",
      active: family.active,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddNew = () => {
    resetForm();
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setEditingFamily(null);
    setShowForm(false);
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
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-heading font-bold text-navy-deep">
            Gerenciamento de Famílias de Produtos
          </h1>
          {!showForm && (
            <Button
              onClick={handleAddNew}
              className="bg-action hover:bg-action/90 text-action-foreground"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Nova Família
            </Button>
          )}
        </div>

        {/* Form */}
        {showForm && (
          <Card className="p-8 mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-heading font-bold text-navy-deep">
                {editingFamily ? (
                  <span>
                    Editando: <span className="text-blue-medium">{editingFamily.name}</span>
                  </span>
                ) : (
                  "Nova Família de Produtos"
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
              <Button
                type="submit"
                className="bg-action hover:bg-action/90 text-action-foreground"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Salvando..."
                  : editingFamily
                  ? "Atualizar Família"
                  : "Criar Família"}
              </Button>
              <Button type="button" variant="outline" onClick={resetForm} disabled={isSubmitting}>
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
        )}

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
                        onClick={() => handleDeleteClick(family)}
                        aria-label={`Excluir família ${family.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir a família de produtos <strong>"{familyToDelete?.name}"</strong>?
                <br />
                <br />
                Esta ação não pode ser desfeita e a família será removida permanentemente.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setFamilyToDelete(null)}>
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
      </div>
    </AdminLayout>
  );
};

export default AdminProductFamilies;
