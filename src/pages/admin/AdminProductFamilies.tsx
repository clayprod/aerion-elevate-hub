import { useEffect, useState } from "react";
import { useProducts, useBrands } from "@/hooks/useProducts";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Edit, Plus, Eye, EyeOff, Package } from "lucide-react";
import { ProductFamily, CreateProductFamilyData, UpdateProductFamilyData, validateProductFamily } from "@/types/products";

const AdminProductFamilies = () => {
  const { productFamilies, isLoading, createProductFamily, updateProductFamily, deleteProductFamily } = useProducts();
  const { brands } = useBrands();
  const { toast } = useToast();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingFamily, setEditingFamily] = useState<ProductFamily | null>(null);
  const [formData, setFormData] = useState<CreateProductFamilyData>({
    brand_id: '',
    name: '',
    slug: '',
    description: '',
    short_description: '',
    youtube_video_id: '',
    brochure_url: '',
    fallback_image: '',
    key_features: [],
    technical_data: {},
    components: [],
    accessories_included: [],
    applications: [],
    active: true,
    featured: false
  });

  const resetForm = () => {
    setFormData({
      brand_id: '',
      name: '',
      slug: '',
      description: '',
      short_description: '',
      youtube_video_id: '',
      brochure_url: '',
      fallback_image: '',
      key_features: [],
      technical_data: {},
      components: [],
      accessories_included: [],
      applications: [],
      active: true,
      featured: false
    });
    setEditingFamily(null);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateProductFamily(formData);
    if (!validation.isValid) {
      toast({
        title: "Erro de validação",
        description: validation.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    try {
      await createProductFamily(formData);
      setIsCreateModalOpen(false);
      resetForm();
    } catch (error) {
      // Erro já tratado no hook
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingFamily) return;

    const updateData: UpdateProductFamilyData = {
      id: editingFamily.id,
      ...formData
    };

    try {
      await updateProductFamily(updateData);
      setIsEditModalOpen(false);
      resetForm();
    } catch (error) {
      // Erro já tratado no hook
    }
  };

  const handleDelete = async (family: ProductFamily) => {
    if (!confirm(`Tem certeza que deseja excluir a família "${family.name}"?`)) {
      return;
    }

    try {
      await deleteProductFamily(family.id);
    } catch (error) {
      // Erro já tratado no hook
    }
  };

  const openEditModal = (family: ProductFamily) => {
    setEditingFamily(family);
    setFormData({
      brand_id: family.brand_id,
      name: family.name,
      slug: family.slug,
      description: family.description,
      short_description: family.short_description || '',
      youtube_video_id: family.youtube_video_id || '',
      brochure_url: family.brochure_url || '',
      fallback_image: family.fallback_image || '',
      key_features: family.key_features,
      technical_data: family.technical_data || {},
      components: family.components,
      accessories_included: family.accessories_included,
      applications: family.applications || [],
      active: family.active,
      featured: family.featured
    });
    setIsEditModalOpen(true);
  };

  const openCreateModal = () => {
    resetForm();
    setIsCreateModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-28 pb-20">
          <div className="container-custom max-w-6xl">
            <div className="text-center">
              <p className="text-gray-dark">Carregando famílias de produtos...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-28 pb-20">
        <div className="container-custom max-w-6xl">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-heading font-bold text-navy-deep">
              Gerenciar Famílias de Produtos
            </h1>
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button onClick={openCreateModal} className="bg-action hover:bg-action/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Família
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Criar Nova Família de Produto</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="brand_id">Marca *</Label>
                      <Select value={formData.brand_id} onValueChange={(value) => setFormData({ ...formData, brand_id: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma marca" />
                        </SelectTrigger>
                        <SelectContent>
                          {brands.map((brand) => (
                            <SelectItem key={brand.id} value={brand.id}>
                              {brand.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="name">Nome da Família *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="slug">Slug *</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="exemplo-familia"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Descrição *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="short_description">Descrição Curta</Label>
                    <Textarea
                      id="short_description"
                      value={formData.short_description}
                      onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="youtube_video_id">ID do Vídeo YouTube</Label>
                      <Input
                        id="youtube_video_id"
                        value={formData.youtube_video_id}
                        onChange={(e) => setFormData({ ...formData, youtube_video_id: e.target.value })}
                        placeholder="ABC123DEF456"
                      />
                    </div>

                    <div>
                      <Label htmlFor="brochure_url">URL da Brochure</Label>
                      <Input
                        id="brochure_url"
                        value={formData.brochure_url}
                        onChange={(e) => setFormData({ ...formData, brochure_url: e.target.value })}
                        placeholder="https://exemplo.com/brochure.pdf"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="fallback_image">Imagem de Fallback</Label>
                    <Input
                      id="fallback_image"
                      value={formData.fallback_image}
                      onChange={(e) => setFormData({ ...formData, fallback_image: e.target.value })}
                      placeholder="https://exemplo.com/imagem.jpg"
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={formData.active}
                        onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                      />
                      <Label>Ativa</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={formData.featured}
                        onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                      />
                      <Label>Destaque</Label>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" className="bg-action hover:bg-action/90">
                      Criar Família
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                      Cancelar
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Product Families List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productFamilies.map((family) => (
              <Card key={family.id} className="p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded flex items-center justify-center">
                      <Package className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-heading font-bold text-navy-deep">
                        {family.name}
                      </h3>
                      <p className="text-sm text-gray-500">/{family.slug}</p>
                      <p className="text-xs text-gray-400">{family.brand?.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {family.active ? (
                      <Eye className="w-4 h-4 text-green-600" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    )}
                    {family.featured && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        Destaque
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-gray-dark text-sm mb-4 line-clamp-3">
                  {family.short_description || family.description}
                </p>

                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditModal(family)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(family)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Excluir
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {productFamilies.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-dark mb-4">Nenhuma família de produto cadastrada ainda.</p>
              <Button onClick={openCreateModal} className="bg-action hover:bg-action/90">
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeira Família
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminProductFamilies;

