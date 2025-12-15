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

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string | null;
  features: string[] | null;
  image_url: string | null;
  category: string | null;
  price: number | null;
  active: boolean;
}

const AdminProducts = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    short_description: "",
    features: "",
    image_url: "",
    category: "",
    price: "",
    active: true,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("order_index", { ascending: true });

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os produtos.",
        variant: "destructive",
      });
    } else {
      setProducts(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const features = formData.features
      ? formData.features.split("\n").filter((f) => f.trim())
      : [];

    const productData = {
      name: formData.name,
      slug: formData.slug,
      description: formData.description,
      short_description: formData.short_description || null,
      features,
      image_url: formData.image_url || null,
      category: formData.category || null,
      price: formData.price ? parseFloat(formData.price) : null,
      active: formData.active,
    };

    if (editingProduct) {
      const { error } = await supabase
        .from("products")
        .update(productData)
        .eq("id", editingProduct.id);

      if (error) {
        toast({
          title: "Erro",
          description: "Não foi possível atualizar o produto.",
          variant: "destructive",
        });
      } else {
        toast({ title: "Sucesso!", description: "Produto atualizado." });
        resetForm();
        fetchProducts();
      }
    } else {
      const { error } = await supabase.from("products").insert(productData);

      if (error) {
        toast({
          title: "Erro",
          description: "Não foi possível criar o produto.",
          variant: "destructive",
        });
      } else {
        toast({ title: "Sucesso!", description: "Produto criado." });
        resetForm();
        fetchProducts();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o produto.",
        variant: "destructive",
      });
    } else {
      toast({ title: "Sucesso!", description: "Produto excluído." });
      fetchProducts();
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description,
      short_description: product.short_description || "",
      features: product.features ? product.features.join("\n") : "",
      image_url: product.image_url || "",
      category: product.category || "",
      price: product.price ? product.price.toString() : "",
      active: product.active,
    });
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      short_description: "",
      features: "",
      image_url: "",
      category: "",
      price: "",
      active: true,
    });
  };

  return (
    <AdminLayout>

      <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-heading font-bold text-navy-deep mb-8">
            Gerenciar Produtos
          </h1>

          {/* Form */}
          <Card className="p-8 mb-12">
            <h2 className="text-2xl font-heading font-bold text-navy-deep mb-6">
              {editingProduct ? "Editar Produto" : "Novo Produto"}
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

              <div>
                <label className="block text-sm font-heading font-semibold text-navy-deep mb-2">
                  Características (uma por linha)
                </label>
                <Textarea
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  rows={5}
                  placeholder="Alta precisão&#10;Longa duração de bateria&#10;Design robusto"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <MediaUploader
                    onUploadComplete={(url) => setFormData({ ...formData, image_url: url })}
                    currentUrl={formData.image_url}
                    onRemove={() => setFormData({ ...formData, image_url: "" })}
                    folder="products"
                    label="Imagem do Produto"
                    accept="image/*"
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

                <div>
                  <label className="block text-sm font-heading font-semibold text-navy-deep mb-2">
                    Preço (opcional)
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                />
                <label className="text-sm font-heading font-semibold text-navy-deep">Ativo</label>
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="bg-action hover:bg-action/90 text-action-foreground">
                  {editingProduct ? "Atualizar Produto" : "Criar Produto"}
                </Button>
                {editingProduct && (
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancelar
                  </Button>
                )}
              </div>
            </form>
          </Card>

          {/* Products List */}
          <div>
            <h2 className="text-2xl font-heading font-bold text-navy-deep mb-6">
              Produtos Cadastrados ({products.length})
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {products.map((product) => (
                <Card key={product.id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {product.category && (
                          <span className="bg-gray-100 px-2 py-1 rounded text-sm font-semibold">
                            {product.category}
                          </span>
                        )}
                        {product.active ? (
                          <span className="text-green-600 text-sm font-semibold">✓ Ativo</span>
                        ) : (
                          <span className="text-gray-400 text-sm">✗ Inativo</span>
                        )}
                      </div>
                      <h3 className="text-xl font-heading font-bold text-navy-deep mb-2">
                        {product.name}
                      </h3>
                      <p className="text-gray-dark mb-2">{product.short_description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-medium">
                        <span>Slug: {product.slug}</span>
                        {product.price && <span>R$ {product.price.toFixed(2)}</span>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(product)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(product.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProducts;

