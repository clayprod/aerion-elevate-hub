import { useEffect, useState } from "react";
import { useBrands } from "@/hooks/useProducts";
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
import { Trash2, Edit, Plus, Eye, EyeOff } from "lucide-react";
import { Brand, CreateBrandData, UpdateBrandData, validateBrand } from "@/types/products";

const AdminBrands = () => {
  const { brands, isLoading, createBrand, updateBrand, deleteBrand } = useBrands();
  const { toast } = useToast();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [formData, setFormData] = useState<CreateBrandData>({
    name: '',
    slug: '',
    logo_url: '',
    description: '',
    website: '',
    active: true
  });

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      logo_url: '',
      description: '',
      website: '',
      active: true
    });
    setEditingBrand(null);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação
    const validation = validateBrand(formData);
    if (!validation.isValid) {
      toast({
        title: "Erro de validação",
        description: validation.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    try {
      await createBrand(formData);
      setIsCreateModalOpen(false);
      resetForm();
    } catch (error) {
      // Erro já tratado no hook
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingBrand) return;

    const updateData: UpdateBrandData = {
      id: editingBrand.id,
      ...formData
    };

    // Validação
    const validation = validateBrand(formData);
    if (!validation.isValid) {
      toast({
        title: "Erro de validação",
        description: validation.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    try {
      await updateBrand(updateData);
      setIsEditModalOpen(false);
      resetForm();
    } catch (error) {
      // Erro já tratado no hook
    }
  };

  const handleDelete = async (brand: Brand) => {
    if (!confirm(`Tem certeza que deseja excluir a marca "${brand.name}"?`)) {
      return;
    }

    try {
      await deleteBrand(brand.id);
    } catch (error) {
      // Erro já tratado no hook
    }
  };

  const openEditModal = (brand: Brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      slug: brand.slug,
      logo_url: brand.logo_url || '',
      description: brand.description || '',
      website: brand.website || '',
      active: brand.active
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
              <p className="text-gray-dark">Carregando marcas...</p>
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
              Gerenciar Marcas
            </h1>
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button onClick={openCreateModal} className="bg-action hover:bg-action/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Marca
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Criar Nova Marca</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreate} className="space-y-6">
                  <div>
                    <Label htmlFor="name">Nome da Marca *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="slug">Slug *</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="exemplo-marca"
                      required
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      URL amigável (apenas letras minúsculas, números e hífens)
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="logo_url">URL do Logo</Label>
                    <Input
                      id="logo_url"
                      value={formData.logo_url}
                      onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                      placeholder="https://exemplo.com/logo.png"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="https://exemplo.com"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.active}
                      onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                    />
                    <Label>Marca ativa</Label>
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" className="bg-action hover:bg-action/90">
                      Criar Marca
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                      Cancelar
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Brands List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {brands.map((brand) => (
              <Card key={brand.id} className="p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {brand.logo_url ? (
                      <img
                        src={brand.logo_url}
                        alt={brand.name}
                        className="w-12 h-12 object-contain rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-gray-500 font-semibold">
                          {brand.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-heading font-bold text-navy-deep">
                        {brand.name}
                      </h3>
                      <p className="text-sm text-gray-500">/{brand.slug}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {brand.active ? (
                      <Eye className="w-4 h-4 text-green-600" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </div>

                {brand.description && (
                  <p className="text-gray-dark text-sm mb-4 line-clamp-2">
                    {brand.description}
                  </p>
                )}

                {brand.website && (
                  <a
                    href={brand.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-action text-sm hover:underline"
                  >
                    {brand.website}
                  </a>
                )}

                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditModal(brand)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(brand)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Excluir
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {brands.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-dark mb-4">Nenhuma marca cadastrada ainda.</p>
              <Button onClick={openCreateModal} className="bg-action hover:bg-action/90">
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeira Marca
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Marca</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-6">
            <div>
              <Label htmlFor="edit-name">Nome da Marca *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="edit-slug">Slug *</Label>
              <Input
                id="edit-slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="edit-logo_url">URL do Logo</Label>
              <Input
                id="edit-logo_url"
                value={formData.logo_url}
                onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="edit-description">Descrição</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="edit-website">Website</Label>
              <Input
                id="edit-website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.active}
                onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
              />
              <Label>Marca ativa</Label>
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="bg-action hover:bg-action/90">
                Salvar Alterações
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancelar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default AdminBrands;

