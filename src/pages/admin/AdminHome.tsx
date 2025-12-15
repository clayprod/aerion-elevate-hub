import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Trash2, Edit, Plus, ArrowUp, ArrowDown, Eye } from "lucide-react";
import MediaUploader from "@/components/admin/MediaUploader";
import { Link } from "react-router-dom";

interface PageBlock {
  id: string;
  page_slug: string;
  block_type: string;
  block_data: any;
  order_index: number;
  active: boolean;
}

const BLOCK_TYPES = [
  { value: "hero", label: "Hero Section" },
  { value: "products", label: "Products Section" },
  { value: "solutions", label: "Solutions Section" },
  { value: "why_aerion", label: "Why Aerion Section" },
  { value: "contact", label: "Contact Section" },
];

const AdminHome = () => {
  const { toast } = useToast();
  const [blocks, setBlocks] = useState<PageBlock[]>([]);
  const [editingBlock, setEditingBlock] = useState<PageBlock | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    block_type: "hero",
    block_data: {} as any,
    active: true,
  });

  useEffect(() => {
    fetchBlocks();
  }, []);

  const fetchBlocks = async () => {
    try {
      const { data, error } = await supabase
        .from("page_blocks")
        .select("*")
        .eq("page_slug", "home")
        .order("order_index", { ascending: true });

      if (error) throw error;
      setBlocks(data || []);
    } catch (error: any) {
      console.error("Error fetching blocks:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os blocos.",
        variant: "destructive",
      });
    }
  };

  const handleSaveBlock = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingBlock) {
        const { error } = await supabase
          .from("page_blocks")
          .update({
            block_type: formData.block_type,
            block_data: formData.block_data,
            active: formData.active,
          })
          .eq("id", editingBlock.id);

        if (error) throw error;
        toast({ title: "Sucesso!", description: "Bloco atualizado." });
      } else {
        const maxOrder = Math.max(...blocks.map((b) => b.order_index), -1);
        const { error } = await supabase.from("page_blocks").insert({
          page_slug: "home",
          block_type: formData.block_type,
          block_data: formData.block_data,
          order_index: maxOrder + 1,
          active: formData.active,
        });

        if (error) throw error;
        toast({ title: "Sucesso!", description: "Bloco adicionado." });
      }

      resetForm();
      fetchBlocks();
    } catch (error: any) {
      console.error("Error saving block:", error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível salvar o bloco.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteBlock = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este bloco?")) return;

    try {
      const { error } = await supabase.from("page_blocks").delete().eq("id", id);
      if (error) throw error;
      toast({ title: "Sucesso!", description: "Bloco excluído." });
      fetchBlocks();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o bloco.",
        variant: "destructive",
      });
    }
  };

  const handleReorderBlock = async (id: string, direction: "up" | "down") => {
    const currentIndex = blocks.findIndex((b) => b.id === id);
    if (currentIndex === -1) return;

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= blocks.length) return;

    const updates = [
      { id: blocks[currentIndex].id, order_index: targetIndex },
      { id: blocks[targetIndex].id, order_index: currentIndex },
    ];

    for (const update of updates) {
      await supabase
        .from("page_blocks")
        .update({ order_index: update.order_index })
        .eq("id", update.id);
    }

    fetchBlocks();
  };

  const handleEditBlock = (block: PageBlock) => {
    setEditingBlock(block);
    setFormData({
      block_type: block.block_type,
      block_data: block.block_data || {},
      active: block.active,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setEditingBlock(null);
    setShowForm(false);
    setFormData({
      block_type: "hero",
      block_data: {},
      active: true,
    });
  };

  const renderBlockForm = () => {
    const blockType = formData.block_type;

    return (
      <Card className="p-6 mb-6">
        <h2 className="text-2xl font-heading font-bold text-navy-deep mb-6">
          {editingBlock ? "Editar Bloco" : "Adicionar Novo Bloco"}
        </h2>

        <form onSubmit={handleSaveBlock} className="space-y-6">
          <div>
            <label className="block text-sm font-heading font-semibold text-navy-deep mb-2">
              Tipo de Bloco *
            </label>
            <select
              value={formData.block_type}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  block_type: e.target.value,
                  block_data: {},
                });
              }}
              className="w-full border rounded-md p-2"
              required
            >
              {BLOCK_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Hero Block Form */}
          {blockType === "hero" && (
            <>
              <div>
                <label className="block text-sm font-heading font-semibold text-navy-deep mb-2">
                  Título Principal *
                </label>
                <Input
                  value={formData.block_data.title || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      block_data: { ...formData.block_data, title: e.target.value },
                    })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-heading font-semibold text-navy-deep mb-2">
                  Subtítulo *
                </label>
                <Textarea
                  value={formData.block_data.subtitle || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      block_data: { ...formData.block_data, subtitle: e.target.value },
                    })
                  }
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-heading font-semibold text-navy-deep mb-2">
                  Vídeo de Fundo (URL)
                </label>
                <MediaUploader
                  onUploadComplete={(url) =>
                    setFormData({
                      ...formData,
                      block_data: { ...formData.block_data, video_url: url },
                    })
                  }
                  currentUrl={formData.block_data.video_url}
                  onRemove={() =>
                    setFormData({
                      ...formData,
                      block_data: { ...formData.block_data, video_url: "" },
                    })
                  }
                  folder="hero"
                  accept="video/*"
                  label="Vídeo de Fundo"
                />
              </div>
              <div>
                <label className="block text-sm font-heading font-semibold text-navy-deep mb-2">
                  Poster do Vídeo
                </label>
                <MediaUploader
                  onUploadComplete={(url) =>
                    setFormData({
                      ...formData,
                      block_data: { ...formData.block_data, poster_url: url },
                    })
                  }
                  currentUrl={formData.block_data.poster_url}
                  onRemove={() =>
                    setFormData({
                      ...formData,
                      block_data: { ...formData.block_data, poster_url: "" },
                    })
                  }
                  folder="hero"
                  accept="image/*"
                  label="Poster do Vídeo"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-heading font-semibold text-navy-deep mb-2">
                    Texto CTA Principal *
                  </label>
                  <Input
                    value={formData.block_data.cta1_text || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        block_data: { ...formData.block_data, cta1_text: e.target.value },
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-heading font-semibold text-navy-deep mb-2">
                    Link CTA Principal *
                  </label>
                  <Input
                    value={formData.block_data.cta1_link || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        block_data: { ...formData.block_data, cta1_link: e.target.value },
                      })
                    }
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-heading font-semibold text-navy-deep mb-2">
                    Texto CTA Secundário
                  </label>
                  <Input
                    value={formData.block_data.cta2_text || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        block_data: { ...formData.block_data, cta2_text: e.target.value },
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-heading font-semibold text-navy-deep mb-2">
                    Link CTA Secundário
                  </label>
                  <Input
                    value={formData.block_data.cta2_link || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        block_data: { ...formData.block_data, cta2_link: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
            </>
          )}

          {/* Why Aerion Block Form */}
          {blockType === "why_aerion" && (
            <>
              <div>
                <label className="block text-sm font-heading font-semibold text-navy-deep mb-2">
                  Título da Seção *
                </label>
                <Input
                  value={formData.block_data.title || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      block_data: { ...formData.block_data, title: e.target.value },
                    })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-heading font-semibold text-navy-deep mb-2">
                  Subtítulo
                </label>
                <Textarea
                  value={formData.block_data.subtitle || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      block_data: { ...formData.block_data, subtitle: e.target.value },
                    })
                  }
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-heading font-semibold text-navy-deep mb-2">
                  Diferenciais (JSON Array)
                </label>
                <Textarea
                  value={JSON.stringify(formData.block_data.differentials || [], null, 2)}
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value);
                      setFormData({
                        ...formData,
                        block_data: { ...formData.block_data, differentials: parsed },
                      });
                    } catch {
                      // Invalid JSON, ignore
                    }
                  }}
                  rows={10}
                  placeholder='[{"title": "Título", "description": "Descrição", "features": ["Feature 1", "Feature 2"]}]'
                />
              </div>
            </>
          )}

          {/* Contact Block Form */}
          {blockType === "contact" && (
            <>
              <div>
                <label className="block text-sm font-heading font-semibold text-navy-deep mb-2">
                  Título da Seção *
                </label>
                <Input
                  value={formData.block_data.title || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      block_data: { ...formData.block_data, title: e.target.value },
                    })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-heading font-semibold text-navy-deep mb-2">
                  Subtítulo
                </label>
                <Textarea
                  value={formData.block_data.subtitle || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      block_data: { ...formData.block_data, subtitle: e.target.value },
                    })
                  }
                  rows={2}
                />
              </div>
            </>
          )}

          {/* Products and Solutions blocks use existing data from tables */}
          {(blockType === "products" || blockType === "solutions") && (
            <div className="p-4 bg-blue-50 rounded-md">
              <p className="text-sm text-gray-700">
                Este bloco exibe automaticamente os {blockType === "products" ? "produtos" : "soluções"} ativos
                do banco de dados. Configure os {blockType === "products" ? "produtos" : "soluções"} nas páginas
                de administração correspondentes.
              </p>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Switch
              checked={formData.active}
              onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
            />
            <label className="text-sm font-heading font-semibold text-navy-deep">Ativo</label>
          </div>

          <div className="flex gap-4">
            <Button type="submit" className="bg-action hover:bg-action/90 text-action-foreground">
              {editingBlock ? "Atualizar Bloco" : "Adicionar Bloco"}
            </Button>
            {editingBlock && (
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </Card>
    );
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-heading font-bold text-navy-deep mb-2">
              Gerenciar Home Page
            </h1>
            <p className="text-gray-dark text-lg">
              Configure os blocos modulares da página inicial
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link to="/" target="_blank">
                <Eye className="w-4 h-4 mr-2" />
                Ver Home
              </Link>
            </Button>
            {!showForm && (
              <Button onClick={() => setShowForm(true)} className="bg-action hover:bg-action/90 text-action-foreground">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Bloco
              </Button>
            )}
          </div>
        </div>

        {showForm && renderBlockForm()}

        {/* Blocks List */}
        <div>
          <h2 className="text-2xl font-heading font-bold text-navy-deep mb-6">
            Blocos da Home ({blocks.length})
          </h2>
          {blocks.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-gray-500 mb-4">Nenhum bloco configurado ainda.</p>
              <Button onClick={() => setShowForm(true)} className="bg-action hover:bg-action/90 text-action-foreground">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Primeiro Bloco
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {blocks.map((block, index) => (
                <Card key={block.id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="bg-blue-medium text-white px-3 py-1 rounded text-sm font-semibold">
                          {BLOCK_TYPES.find((t) => t.value === block.block_type)?.label || block.block_type}
                        </span>
                        {block.active ? (
                          <span className="text-green-600 text-sm font-semibold">✓ Ativo</span>
                        ) : (
                          <span className="text-gray-400 text-sm">✗ Inativo</span>
                        )}
                        <span className="text-gray-500 text-sm">Ordem: {block.order_index + 1}</span>
                      </div>
                      {block.block_data.title && (
                        <h3 className="text-lg font-heading font-bold text-navy-deep mb-1">
                          {block.block_data.title}
                        </h3>
                      )}
                      {block.block_data.subtitle && (
                        <p className="text-gray-dark text-sm">{block.block_data.subtitle}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReorderBlock(block.id, "up")}
                        disabled={index === 0}
                      >
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReorderBlock(block.id, "down")}
                        disabled={index === blocks.length - 1}
                      >
                        <ArrowDown className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEditBlock(block)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteBlock(block.id)}>
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

export default AdminHome;

