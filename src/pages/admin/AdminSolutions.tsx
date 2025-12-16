import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Trash2, Edit, ExternalLink, Plus, X } from "lucide-react";
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

interface Solution {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string | null;
  benefits: string[] | null;
  use_cases: string[] | null;
  image_url: string | null;
  icon: string | null;
  category: string | null;
  active: boolean;
  featured: boolean;
}

const AdminSolutions = () => {
  const { toast } = useToast();
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [editingSolution, setEditingSolution] = useState<Solution | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [solutionToDelete, setSolutionToDelete] = useState<Solution | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    short_description: "",
    benefits: "",
    use_cases: "",
    image_url: "",
    icon: "",
    category: "",
    active: true,
    featured: false,
  });

  useEffect(() => {
    fetchSolutions();
  }, []);

  const fetchSolutions = async () => {
    const { data, error } = await supabase
      .from("solutions")
      .select("*")
      .order("order_index", { ascending: true });

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar as soluções.",
        variant: "destructive",
      });
    } else {
      setSolutions(data || []);
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
    if (!editingSolution) {
      const { data: existing } = await supabase
        .from("solutions")
        .select("id")
        .eq("slug", formData.slug)
        .maybeSingle();

      if (existing) {
        toast({
          title: "Erro de validação",
          description: "Já existe uma solução com este slug. Por favor, escolha outro.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
    }

    const benefits = formData.benefits
      ? formData.benefits.split("\n").filter((b) => b.trim())
      : [];

    const useCases = formData.use_cases
      ? formData.use_cases.split("\n").filter((u) => u.trim())
      : [];

    const solutionData = {
      name: formData.name,
      slug: formData.slug,
      description: formData.description,
      short_description: formData.short_description || null,
      benefits,
      use_cases: useCases,
      image_url: formData.image_url || null,
      icon: formData.icon || null,
      category: formData.category || null,
      active: formData.active,
      featured: formData.featured,
    };

    try {
      if (editingSolution) {
        const { error } = await supabase
          .from("solutions")
          .update(solutionData)
          .eq("id", editingSolution.id);

        if (error) {
          throw error;
        }
        toast({
          title: "Sucesso!",
          description: `Solução "${formData.name}" atualizada com sucesso.`,
        });
      } else {
        const { error } = await supabase.from("solutions").insert(solutionData);

        if (error) {
          throw error;
        }
        toast({
          title: "Sucesso!",
          description: `Solução "${formData.name}" criada com sucesso.`,
        });
      }
      resetForm();
      fetchSolutions();
    } catch (error: any) {
      console.error("Error saving solution:", error);
      toast({
        title: "Erro ao salvar solução",
        description: error.message || "Não foi possível salvar a solução. Verifique os dados e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (solution: Solution) => {
    setSolutionToDelete(solution);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!solutionToDelete) return;

    const { error } = await supabase.from("solutions").delete().eq("id", solutionToDelete.id);

    if (error) {
      toast({
        title: "Erro ao excluir solução",
        description: error.message || "Não foi possível excluir a solução. Tente novamente.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Sucesso!",
        description: `Solução "${solutionToDelete.name}" excluída com sucesso.`,
      });
      fetchSolutions();
    }

    setDeleteDialogOpen(false);
    setSolutionToDelete(null);
  };

  const handleEdit = (solution: Solution) => {
    setEditingSolution(solution);
    setShowForm(true);
    setFormData({
      name: solution.name,
      slug: solution.slug,
      description: solution.description,
      short_description: solution.short_description || "",
      benefits: solution.benefits ? solution.benefits.join("\n") : "",
      use_cases: solution.use_cases ? solution.use_cases.join("\n") : "",
      image_url: solution.image_url || "",
      icon: solution.icon || "",
      category: solution.category || "",
      active: solution.active,
      featured: solution.featured,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddNew = () => {
    resetForm();
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setEditingSolution(null);
    setShowForm(false);
    setFormData({
      name: "",
      slug: "",
      description: "",
      short_description: "",
      benefits: "",
      use_cases: "",
      image_url: "",
      icon: "",
      category: "",
      active: true,
      featured: false,
    });
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-heading font-bold text-navy-deep">
            Gerenciar Soluções
          </h1>
          {!showForm && (
            <Button
              onClick={handleAddNew}
              className="bg-action hover:bg-action/90 text-action-foreground"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Nova Solução
            </Button>
          )}
        </div>

        {/* Form */}
        {showForm && (
          <Card className="p-8 mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-heading font-bold text-navy-deep">
                {editingSolution ? (
                  <span>
                    Editando: <span className="text-blue-medium">{editingSolution.name}</span>
                  </span>
                ) : (
                  "Nova Solução"
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
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-heading font-semibold text-navy-deep mb-2">
                  Descrição Completa *
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={6}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-heading font-semibold text-navy-deep mb-2">
                    Benefícios (um por linha)
                  </label>
                  <Textarea
                    value={formData.benefits}
                    onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                    rows={5}
                    placeholder="Redução de custos&#10;Maior eficiência&#10;Melhor qualidade"
                  />
                </div>

                <div>
                  <label className="block text-sm font-heading font-semibold text-navy-deep mb-2">
                    Casos de Uso (um por linha)
                  </label>
                  <Textarea
                    value={formData.use_cases}
                    onChange={(e) => setFormData({ ...formData, use_cases: e.target.value })}
                    rows={5}
                    placeholder="Inspeção industrial&#10;Monitoramento de áreas&#10;Mapeamento topográfico"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <MediaUploader
                    onUploadComplete={(url) => setFormData({ ...formData, image_url: url })}
                    currentUrl={formData.image_url}
                    onRemove={() => setFormData({ ...formData, image_url: "" })}
                    folder="solutions"
                    label="Imagem da Solução"
                    accept="image/*"
                  />
                </div>

                <div>
                  <label className="block text-sm font-heading font-semibold text-navy-deep mb-2">
                    Ícone (nome do Lucide)
                  </label>
                  <Input
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="Zap, Shield, CheckCircle..."
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

              <div className="flex items-center gap-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.active}
                    onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                  />
                  <label className="text-sm font-heading font-semibold text-navy-deep">Ativa</label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                  />
                  <label className="text-sm font-heading font-semibold text-navy-deep">
                    Destacada
                  </label>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="bg-action hover:bg-action/90 text-action-foreground"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Salvando..."
                    : editingSolution
                    ? "Atualizar Solução"
                    : "Criar Solução"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm} disabled={isSubmitting}>
                  Cancelar
                </Button>
              </div>
            </form>
          </Card>
        )}

          {/* Solutions List */}
          <div>
            <h2 className="text-2xl font-heading font-bold text-navy-deep mb-6">
              Soluções Cadastradas ({solutions.length})
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {solutions.map((solution) => (
                <Card key={solution.id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {solution.category && (
                          <span className="bg-gray-100 px-2 py-1 rounded text-sm font-semibold">
                            {solution.category}
                          </span>
                        )}
                        {solution.featured && (
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm font-semibold">
                            ⭐ Destacada
                          </span>
                        )}
                        {solution.active ? (
                          <span className="text-green-600 text-sm font-semibold">✓ Ativa</span>
                        ) : (
                          <span className="text-gray-400 text-sm">✗ Inativa</span>
                        )}
                      </div>
                      <h3 className="text-xl font-heading font-bold text-navy-deep mb-2">
                        {solution.name}
                      </h3>
                      <p className="text-gray-dark mb-2">{solution.short_description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-medium">
                        <span>Slug: {solution.slug}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => window.open(`/solucoes/${solution.slug}`, '_blank')}
                        title="Ver página pública"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(solution)}
                        aria-label={`Editar solução ${solution.name}`}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteClick(solution)}
                        aria-label={`Excluir solução ${solution.name}`}
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

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir a solução <strong>"{solutionToDelete?.name}"</strong>?
                <br />
                <br />
                Esta ação não pode ser desfeita e a solução será removida permanentemente.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setSolutionToDelete(null)}>
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

export default AdminSolutions;

