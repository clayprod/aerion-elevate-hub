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
import { ArrayEditor } from "@/components/admin/ArrayEditor";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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

interface HeroSection {
  badge_text?: string;
  badge_icon?: string;
  title?: string;
  description?: string;
  cta_primary_text?: string;
  cta_secondary_text?: string;
  hero_image_url?: string;
  gradient_colors?: string[];
}

interface Benefit {
  icon?: string;
  title?: string;
  description?: string;
}

interface Drone {
  name?: string;
  variant?: string;
  image?: string;
  features?: string[];
  applications?: string[];
  bestFor?: string;
}

interface Application {
  title?: string;
  description?: string;
  image?: string;
  features?: string[];
  results?: string[];
}

interface UseCase {
  title?: string;
  description?: string;
  icon?: string;
  image?: string;
  benefits?: string[];
  results?: string[];
  alignTop?: boolean;
}

interface ThemeColors {
  primary?: string;
  secondary?: string;
  badge_bg?: string;
  badge_text?: string;
}

interface Solution {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string | null;
  benefits: string[] | Benefit[] | null;
  use_cases: string[] | UseCase[] | null;
  image_url: string | null;
  icon: string | null;
  category: string | null;
  active: boolean;
  featured: boolean;
  hero_section: HeroSection | null;
  drones: Drone[] | null;
  applications: Application[] | null;
  theme_colors: ThemeColors | null;
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
    hero_section: null as HeroSection | null,
    benefits_rich: [] as Benefit[],
    drones: [] as Drone[],
    applications: [] as Application[],
    use_cases_rich: [] as UseCase[],
    theme_colors: null as ThemeColors | null,
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

    const solutionData: any = {
      name: formData.name,
      slug: formData.slug,
      description: formData.description,
      short_description: formData.short_description || null,
      image_url: formData.image_url || null,
      icon: formData.icon || null,
      category: formData.category || null,
      active: formData.active,
      featured: formData.featured,
      hero_section: formData.hero_section || null,
      // Use rich benefits if available, otherwise fallback to simple string array
      benefits: formData.benefits_rich.length > 0 ? formData.benefits_rich : (benefits.length > 0 ? benefits : null),
      drones: formData.drones.length > 0 ? formData.drones : null,
      applications: formData.applications.length > 0 ? formData.applications : null,
      // Use rich use cases if available, otherwise fallback to simple string array
      use_cases: formData.use_cases_rich.length > 0 ? formData.use_cases_rich : (useCases.length > 0 ? useCases : null),
      theme_colors: formData.theme_colors || null,
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
      benefits: Array.isArray(solution.benefits) && typeof solution.benefits[0] === 'string' 
        ? (solution.benefits as string[]).join("\n") 
        : "",
      use_cases: Array.isArray(solution.use_cases) && typeof solution.use_cases[0] === 'string'
        ? (solution.use_cases as string[]).join("\n")
        : "",
      image_url: solution.image_url || "",
      icon: solution.icon || "",
      category: solution.category || "",
      active: solution.active,
      featured: solution.featured,
      hero_section: solution.hero_section || null,
      benefits_rich: Array.isArray(solution.benefits) && solution.benefits.length > 0 && typeof solution.benefits[0] !== 'string' ? solution.benefits as Benefit[] : [],
      drones: solution.drones || [],
      applications: solution.applications || [],
      use_cases_rich: Array.isArray(solution.use_cases) && solution.use_cases.length > 0 && typeof solution.use_cases[0] !== 'string' ? solution.use_cases as UseCase[] : [],
      theme_colors: solution.theme_colors || null,
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
      hero_section: null,
      benefits_rich: [],
      drones: [],
      applications: [],
      use_cases_rich: [],
      theme_colors: null,
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

              {/* Rich Content Sections */}
              <Accordion type="multiple" className="w-full">
                {/* Hero Section */}
                <AccordionItem value="hero">
                  <AccordionTrigger>Seção Hero</AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2">Badge Text</label>
                        <Input
                          value={formData.hero_section?.badge_text || ""}
                          onChange={(e) => setFormData({
                            ...formData,
                            hero_section: { ...formData.hero_section, badge_text: e.target.value } as HeroSection
                          })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Badge Icon (Lucide)</label>
                        <Input
                          value={formData.hero_section?.badge_icon || ""}
                          onChange={(e) => setFormData({
                            ...formData,
                            hero_section: { ...formData.hero_section, badge_icon: e.target.value } as HeroSection
                          })}
                          placeholder="Building, Factory, Shield..."
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Título Hero</label>
                      <Input
                        value={formData.hero_section?.title || ""}
                        onChange={(e) => setFormData({
                          ...formData,
                          hero_section: { ...formData.hero_section, title: e.target.value } as HeroSection
                        })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Descrição Hero</label>
                      <Textarea
                        value={formData.hero_section?.description || ""}
                        onChange={(e) => setFormData({
                          ...formData,
                          hero_section: { ...formData.hero_section, description: e.target.value } as HeroSection
                        })}
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2">CTA Primário</label>
                        <Input
                          value={formData.hero_section?.cta_primary_text || ""}
                          onChange={(e) => setFormData({
                            ...formData,
                            hero_section: { ...formData.hero_section, cta_primary_text: e.target.value } as HeroSection
                          })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">CTA Secundário</label>
                        <Input
                          value={formData.hero_section?.cta_secondary_text || ""}
                          onChange={(e) => setFormData({
                            ...formData,
                            hero_section: { ...formData.hero_section, cta_secondary_text: e.target.value } as HeroSection
                          })}
                        />
                      </div>
                    </div>
                    <div>
                      <MediaUploader
                        onUploadComplete={(url) => setFormData({
                          ...formData,
                          hero_section: { ...formData.hero_section, hero_image_url: url } as HeroSection
                        })}
                        currentUrl={formData.hero_section?.hero_image_url || ""}
                        onRemove={() => setFormData({
                          ...formData,
                          hero_section: { ...formData.hero_section, hero_image_url: "" } as HeroSection
                        })}
                        folder="solutions"
                        label="Imagem Hero"
                        accept="image/*"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2">Gradiente From (ex: from-blue-50)</label>
                        <Input
                          value={formData.hero_section?.gradient_colors?.[0] || ""}
                          onChange={(e) => setFormData({
                            ...formData,
                            hero_section: {
                              ...formData.hero_section,
                              gradient_colors: [e.target.value, formData.hero_section?.gradient_colors?.[1] || "to-white"]
                            } as HeroSection
                          })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Gradiente To (ex: to-white)</label>
                        <Input
                          value={formData.hero_section?.gradient_colors?.[1] || ""}
                          onChange={(e) => setFormData({
                            ...formData,
                            hero_section: {
                              ...formData.hero_section,
                              gradient_colors: [formData.hero_section?.gradient_colors?.[0] || "from-blue-50", e.target.value]
                            } as HeroSection
                          })}
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Benefits Rich */}
                <AccordionItem value="benefits">
                  <AccordionTrigger>Benefícios (Rico)</AccordionTrigger>
                  <AccordionContent>
                    <ArrayEditor
                      items={formData.benefits_rich}
                      onChange={(items) => setFormData({ ...formData, benefits_rich: items })}
                      onAdd={() => ({ icon: "", title: "", description: "" })}
                      addButtonText="Adicionar Benefício"
                      renderItem={(item, index, onChangeItem, onDelete) => (
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <h4 className="font-semibold">Benefício {index + 1}</h4>
                            <Button type="button" variant="ghost" size="icon" onClick={onDelete}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <Input
                              value={item.icon || ""}
                              onChange={(e) => onChangeItem({ ...item, icon: e.target.value })}
                              placeholder="Ícone (Lucide)"
                            />
                            <Input
                              value={item.title || ""}
                              onChange={(e) => onChangeItem({ ...item, title: e.target.value })}
                              placeholder="Título"
                            />
                            <Textarea
                              value={item.description || ""}
                              onChange={(e) => onChangeItem({ ...item, description: e.target.value })}
                              placeholder="Descrição"
                              rows={2}
                            />
                          </div>
                        </div>
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>

                {/* Drones */}
                <AccordionItem value="drones">
                  <AccordionTrigger>Drones</AccordionTrigger>
                  <AccordionContent>
                    <ArrayEditor
                      items={formData.drones}
                      onChange={(items) => setFormData({ ...formData, drones: items })}
                      onAdd={() => ({ name: "", variant: "", image: "", features: [], applications: [], bestFor: "" })}
                      addButtonText="Adicionar Drone"
                      renderItem={(item, index, onChangeItem, onDelete) => (
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <h4 className="font-semibold">Drone {index + 1}</h4>
                            <Button type="button" variant="ghost" size="icon" onClick={onDelete}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <Input
                              value={item.name || ""}
                              onChange={(e) => onChangeItem({ ...item, name: e.target.value })}
                              placeholder="Nome"
                            />
                            <Input
                              value={item.variant || ""}
                              onChange={(e) => onChangeItem({ ...item, variant: e.target.value })}
                              placeholder="Variante"
                            />
                          </div>
                          <Input
                            value={item.image || ""}
                            onChange={(e) => onChangeItem({ ...item, image: e.target.value })}
                            placeholder="URL da Imagem"
                          />
                          <Textarea
                            value={item.bestFor || ""}
                            onChange={(e) => onChangeItem({ ...item, bestFor: e.target.value })}
                            placeholder="Melhor para..."
                            rows={2}
                          />
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-semibold mb-2">Características (uma por linha)</label>
                              <Textarea
                                value={item.features?.join("\n") || ""}
                                onChange={(e) => onChangeItem({
                                  ...item,
                                  features: e.target.value.split("\n").filter(f => f.trim())
                                })}
                                rows={4}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold mb-2">Aplicações (uma por linha)</label>
                              <Textarea
                                value={item.applications?.join("\n") || ""}
                                onChange={(e) => onChangeItem({
                                  ...item,
                                  applications: e.target.value.split("\n").filter(a => a.trim())
                                })}
                                rows={4}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>

                {/* Applications */}
                <AccordionItem value="applications">
                  <AccordionTrigger>Aplicações/Indústrias</AccordionTrigger>
                  <AccordionContent>
                    <ArrayEditor
                      items={formData.applications}
                      onChange={(items) => setFormData({ ...formData, applications: items })}
                      onAdd={() => ({ title: "", description: "", image: "", features: [], results: [] })}
                      addButtonText="Adicionar Aplicação"
                      renderItem={(item, index, onChangeItem, onDelete) => (
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <h4 className="font-semibold">Aplicação {index + 1}</h4>
                            <Button type="button" variant="ghost" size="icon" onClick={onDelete}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <Input
                            value={item.title || ""}
                            onChange={(e) => onChangeItem({ ...item, title: e.target.value })}
                            placeholder="Título"
                          />
                          <Textarea
                            value={item.description || ""}
                            onChange={(e) => onChangeItem({ ...item, description: e.target.value })}
                            placeholder="Descrição"
                            rows={2}
                          />
                          <Input
                            value={item.image || ""}
                            onChange={(e) => onChangeItem({ ...item, image: e.target.value })}
                            placeholder="URL da Imagem"
                          />
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-semibold mb-2">Recursos (uma por linha)</label>
                              <Textarea
                                value={item.features?.join("\n") || ""}
                                onChange={(e) => onChangeItem({
                                  ...item,
                                  features: e.target.value.split("\n").filter(f => f.trim())
                                })}
                                rows={4}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold mb-2">Resultados (uma por linha)</label>
                              <Textarea
                                value={item.results?.join("\n") || ""}
                                onChange={(e) => onChangeItem({
                                  ...item,
                                  results: e.target.value.split("\n").filter(r => r.trim())
                                })}
                                rows={4}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>

                {/* Use Cases Rich */}
                <AccordionItem value="useCases">
                  <AccordionTrigger>Casos de Uso (Rico)</AccordionTrigger>
                  <AccordionContent>
                    <ArrayEditor
                      items={formData.use_cases_rich}
                      onChange={(items) => setFormData({ ...formData, use_cases_rich: items })}
                      onAdd={() => ({ title: "", description: "", icon: "", image: "", benefits: [], results: [] })}
                      addButtonText="Adicionar Caso de Uso"
                      renderItem={(item, index, onChangeItem, onDelete) => (
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <h4 className="font-semibold">Caso de Uso {index + 1}</h4>
                            <Button type="button" variant="ghost" size="icon" onClick={onDelete}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <Input
                              value={item.title || ""}
                              onChange={(e) => onChangeItem({ ...item, title: e.target.value })}
                              placeholder="Título"
                            />
                            <Input
                              value={item.icon || ""}
                              onChange={(e) => onChangeItem({ ...item, icon: e.target.value })}
                              placeholder="Ícone (Lucide) - deixe vazio se usar imagem"
                            />
                          </div>
                          <Textarea
                            value={item.description || ""}
                            onChange={(e) => onChangeItem({ ...item, description: e.target.value })}
                            placeholder="Descrição"
                            rows={2}
                          />
                          <div>
                            <label className="block text-sm font-semibold mb-2">URL da Imagem (opcional - use imagem OU ícone)</label>
                            <Input
                              value={item.image || ""}
                              onChange={(e) => onChangeItem({ ...item, image: e.target.value })}
                              placeholder="/images/solucoes/..."
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-semibold mb-2">Benefícios (uma por linha)</label>
                              <Textarea
                                value={item.benefits?.join("\n") || ""}
                                onChange={(e) => onChangeItem({
                                  ...item,
                                  benefits: e.target.value.split("\n").filter(b => b.trim())
                                })}
                                rows={4}
                                placeholder="Usado quando tem ícone"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold mb-2">Resultados (uma por linha)</label>
                              <Textarea
                                value={item.results?.join("\n") || ""}
                                onChange={(e) => onChangeItem({
                                  ...item,
                                  results: e.target.value.split("\n").filter(r => r.trim())
                                })}
                                rows={4}
                                placeholder="Usado quando tem imagem"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>

                {/* Theme Colors */}
                <AccordionItem value="theme">
                  <AccordionTrigger>Cores do Tema</AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2">Cor Primária</label>
                        <Input
                          value={formData.theme_colors?.primary || ""}
                          onChange={(e) => setFormData({
                            ...formData,
                            theme_colors: { ...formData.theme_colors, primary: e.target.value } as ThemeColors
                          })}
                          placeholder="blue, orange, red..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Cor Secundária</label>
                        <Input
                          value={formData.theme_colors?.secondary || ""}
                          onChange={(e) => setFormData({
                            ...formData,
                            theme_colors: { ...formData.theme_colors, secondary: e.target.value } as ThemeColors
                          })}
                          placeholder="blue, orange, red..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Badge BG (ex: bg-blue-100)</label>
                        <Input
                          value={formData.theme_colors?.badge_bg || ""}
                          onChange={(e) => setFormData({
                            ...formData,
                            theme_colors: { ...formData.theme_colors, badge_bg: e.target.value } as ThemeColors
                          })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Badge Text (ex: text-blue-700)</label>
                        <Input
                          value={formData.theme_colors?.badge_text || ""}
                          onChange={(e) => setFormData({
                            ...formData,
                            theme_colors: { ...formData.theme_colors, badge_text: e.target.value } as ThemeColors
                          })}
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

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

