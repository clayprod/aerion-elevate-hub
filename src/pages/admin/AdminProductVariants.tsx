import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Edit } from "lucide-react";
import { generateSlug } from "@/lib/pageUtils";
import MediaUploader from "@/components/admin/MediaUploader";

interface ProductVariant {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string | null;
  family_id: string | null;
  specifications: any;
  price: number | null;
  image_url: string | null;
  gallery_urls: string[] | null;
  active: boolean;
  order_index: number;
}

interface ProductFamily {
  id: string;
  name: string;
  slug: string;
}

const AdminProductVariants = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const familySlug = searchParams.get("family");
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [families, setFamilies] = useState<ProductFamily[]>([]);
  const [selectedFamilyFilter, setSelectedFamilyFilter] = useState<string>("");
  const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    short_description: "",
    family_id: "",
    specifications: "",
    price: "",
    image_url: "",
    image_path: "",
    gallery_urls: "",
    active: true,
  });

  useEffect(() => {
    fetchVariants();
    fetchFamilies();
  }, []);

  useEffect(() => {
    // Se há um filtro de família na URL, aplicar automaticamente
    if (familySlug) {
      const family = families.find(f => f.slug === familySlug);
      if (family) {
        setSelectedFamilyFilter(family.id);
        setFormData(prev => ({ ...prev, family_id: family.id }));
      }
    }
  }, [familySlug, families]);

  const fetchVariants = async () => {
    try {
      let query = supabase
        .from("product_variants")
        .select("*");

      // Aplicar filtro de família se selecionado
      if (selectedFamilyFilter) {
        query = query.eq("family_id", selectedFamilyFilter);
      }

      const { data, error } = await query.order("order_index", { ascending: true });

      if (error) {
        console.error("Error fetching variants:", error);
        let errorMessage = "Não foi possível carregar as variantes de produtos.";
        
        if (error.message?.includes("relation") && error.message?.includes("does not exist")) {
          errorMessage = "A tabela 'product_variants' não existe. Por favor, execute as migrations no Supabase.";
        } else if (error.message?.includes("permission") || error.message?.includes("policy")) {
          errorMessage = "Erro de permissão. Verifique as políticas RLS no Supabase.";
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        toast({
          title: "Erro",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        setVariants(data || []);
        console.log(`✅ Variantes carregadas: ${data?.length || 0}`);
      }
    } catch (err: any) {
      console.error("Unexpected error fetching variants:", err);
      toast({
        title: "Erro",
        description: err.message || "Erro inesperado ao carregar variantes.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (families.length > 0 || !selectedFamilyFilter) {
      fetchVariants();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFamilyFilter]);

  const fetchFamilies = async () => {
    const { data, error } = await supabase
      .from("product_families")
      .select("id, name, slug")
      .eq("active", true)
      .order("name", { ascending: true });

    if (!error && data) {
      setFamilies(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let specifications = null;
    if (formData.specifications.trim()) {
      try {
        specifications = JSON.parse(formData.specifications);
      } catch (err) {
        toast({
          title: "Erro",
          description: "Especificações devem ser um JSON válido.",
          variant: "destructive",
        });
        return;
      }
    }

    const galleryUrls = formData.gallery_urls
      ? formData.gallery_urls.split("\n").filter((url) => url.trim())
      : [];

    const variantData = {
      name: formData.name,
      slug: formData.slug,
      description: formData.description,
      short_description: formData.short_description || null,
      family_id: formData.family_id || null,
      specifications,
      specs: specifications, // Também salvar em specs para compatibilidade
      price: formData.price ? parseFloat(formData.price) : null,
      image_url: formData.image_url || null,
      image_path: formData.image_path || null,
      gallery_urls: galleryUrls.length > 0 ? galleryUrls : null,
      active: formData.active,
    };

    if (editingVariant) {
      const { error } = await supabase
        .from("product_variants")
        .update(variantData)
        .eq("id", editingVariant.id);

      if (error) {
        toast({
          title: "Erro",
          description: "Não foi possível atualizar a variante de produto.",
          variant: "destructive",
        });
      } else {
        toast({ title: "Sucesso!", description: "Variante de produto atualizada." });
        resetForm();
        fetchVariants();
      }
    } else {
      const maxOrder = Math.max(...variants.map((v) => v.order_index), -1);
      const { error } = await supabase.from("product_variants").insert({
        ...variantData,
        order_index: maxOrder + 1,
      });

      if (error) {
        toast({
          title: "Erro",
          description: "Não foi possível criar a variante de produto.",
          variant: "destructive",
        });
      } else {
        toast({ title: "Sucesso!", description: "Variante de produto criada." });
        resetForm();
        fetchVariants();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta variante de produto?")) return;

    const { error } = await supabase.from("product_variants").delete().eq("id", id);

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir a variante de produto.",
        variant: "destructive",
      });
    } else {
      toast({ title: "Sucesso!", description: "Variante de produto excluída." });
      fetchVariants();
    }
  };

  const handleEdit = (variant: ProductVariant) => {
    setEditingVariant(variant);
    // Usar specs se specifications não estiver disponível
    const specs = variant.specifications || (variant as any).specs || {};
    setFormData({
      name: variant.name,
      slug: variant.slug,
      description: variant.description,
      short_description: variant.short_description || "",
      family_id: variant.family_id || "",
      specifications: Object.keys(specs).length > 0
        ? JSON.stringify(specs, null, 2)
        : "",
      price: variant.price ? variant.price.toString() : "",
      image_url: variant.image_url || "",
      image_path: (variant as any).image_path || "",
      gallery_urls: variant.gallery_urls ? variant.gallery_urls.join("\n") : "",
      active: variant.active,
    });
  };

  const resetForm = () => {
    setEditingVariant(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      short_description: "",
      family_id: familySlug ? (families.find(f => f.slug === familySlug)?.id || "") : "",
      specifications: "",
      price: "",
      image_url: "",
      image_path: "",
      gallery_urls: "",
      active: true,
    });
  };

  const getFamilyName = (familyId: string | null) => {
    if (!familyId) return "Sem família";
    const family = families.find((f) => f.id === familyId);
    return family ? family.name : "Família não encontrada";
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-heading font-bold text-navy-deep mb-8">
          Gerenciamento de Variantes de Produtos
        </h1>

        {/* Family Filter */}
        <Card className="p-4 mb-6">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Filtrar por Família:</label>
            <Select
              value={selectedFamilyFilter}
              onValueChange={(value) => {
                setSelectedFamilyFilter(value);
                setFormData(prev => ({ ...prev, family_id: value }));
              }}
            >
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Todas as famílias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas as famílias</SelectItem>
                {families.map((family) => (
                  <SelectItem key={family.id} value={family.id}>
                    {family.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedFamilyFilter && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedFamilyFilter("");
                  setFormData(prev => ({ ...prev, family_id: "" }));
                }}
              >
                Limpar Filtro
              </Button>
            )}
          </div>
        </Card>

        {/* Form */}
        <Card className="p-8 mb-12">
          <h2 className="text-2xl font-heading font-bold text-navy-deep mb-6">
            {editingVariant ? "Editar Variante" : "Nova Variante de Produto"}
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
                Família de Produtos
              </label>
              <Select
                value={formData.family_id}
                onValueChange={(value) => setFormData({ ...formData, family_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma família" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Sem família</SelectItem>
                  {families.map((family) => (
                    <SelectItem key={family.id} value={family.id}>
                      {family.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-heading font-semibold text-navy-deep mb-2">
                  Preço
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                />
              </div>

              <div>
                <MediaUploader
                  onUploadComplete={(url) => setFormData({ ...formData, image_url: url })}
                  currentUrl={formData.image_url}
                  onRemove={() => setFormData({ ...formData, image_url: "" })}
                  folder="product-variants"
                  label="Imagem Principal"
                  accept="image/*"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-heading font-semibold text-navy-deep mb-2">
                Caminho da Pasta de Imagens
              </label>
              <Input
                value={formData.image_path}
                onChange={(e) => setFormData({ ...formData, image_path: e.target.value })}
                placeholder="/images/products/evo_lite/640t"
              />
              <p className="text-xs text-gray-500 mt-1">
                Caminho base para imagens numeradas (ex: /images/products/evo_lite/640t)
              </p>
            </div>

            <div>
              <label className="block text-sm font-heading font-semibold text-navy-deep mb-2">
                Galeria de Imagens (uma URL por linha)
              </label>
              <Textarea
                value={formData.gallery_urls}
                onChange={(e) =>
                  setFormData({ ...formData, gallery_urls: e.target.value })
                }
                rows={4}
                placeholder="https://exemplo.com/imagem1.jpg&#10;https://exemplo.com/imagem2.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-heading font-semibold text-navy-deep mb-2">
                Especificações (JSON)
              </label>
              <Textarea
                value={formData.specifications}
                onChange={(e) =>
                  setFormData({ ...formData, specifications: e.target.value })
                }
                rows={8}
                placeholder='{"peso": "2.5kg", "dimensoes": "30x20x10cm"}'
              />
              <p className="text-xs text-gray-500 mt-1">
                Formato JSON válido. Exemplo: {"{"}"peso": "2.5kg", "dimensoes": "30x20x10cm"{"}"}
              </p>
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
                {editingVariant ? "Atualizar Variante" : "Criar Variante"}
              </Button>
              {editingVariant && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </Card>

        {/* Variants List */}
        <div>
          <h2 className="text-2xl font-heading font-bold text-navy-deep mb-6">
            Variantes Cadastradas ({variants.length})
          </h2>
          {variants.length === 0 ? (
            <p className="text-gray-500">Nenhuma variante cadastrada ainda.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {variants.map((variant) => (
                <Card key={variant.id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="bg-gray-100 px-2 py-1 rounded text-sm font-semibold">
                          {getFamilyName(variant.family_id)}
                        </span>
                        {variant.active ? (
                          <span className="text-green-600 text-sm font-semibold">✓ Ativa</span>
                        ) : (
                          <span className="text-gray-400 text-sm">✗ Inativa</span>
                        )}
                      </div>
                      {variant.image_url && (
                        <img
                          src={variant.image_url}
                          alt={variant.name}
                          className="h-24 mb-4 object-contain"
                        />
                      )}
                      <h3 className="text-xl font-heading font-bold text-navy-deep mb-2">
                        {variant.name}
                      </h3>
                      {variant.short_description && (
                        <p className="text-gray-dark mb-2">{variant.short_description}</p>
                      )}
                      <p className="text-sm text-gray-medium mb-2">{variant.description}</p>
                      {variant.price && (
                        <p className="text-lg font-semibold text-navy-deep mb-2">
                          R$ {variant.price.toFixed(2)}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-medium">
                        <span>Slug: {variant.slug}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(variant)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(variant.id)}
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

export default AdminProductVariants;

