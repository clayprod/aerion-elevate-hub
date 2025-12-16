import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Trash2, Edit, Plus, ArrowUp, ArrowDown, Eye, X } from "lucide-react";
import MediaUploader from "@/components/admin/MediaUploader";
import { Link } from "react-router-dom";
import BlockRenderer from "@/components/home/BlockRenderer";
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
  const [showPreview, setShowPreview] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [blockToDelete, setBlockToDelete] = useState<PageBlock | null>(null);
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

    // Validações básicas
    if (!formData.block_type) {
      toast({
        title: "Erro",
        description: "Selecione um tipo de bloco.",
        variant: "destructive",
      });
      return;
    }

    // Validações específicas por tipo de bloco
    if (formData.block_type === "hero") {
      const slides = formData.block_data.slides || [];
      if (slides.length === 0) {
        // Se não há slides, validar campos antigos
        if (!formData.block_data.title || !formData.block_data.subtitle) {
          toast({
            title: "Erro",
            description: "Preencha título e subtítulo do hero.",
            variant: "destructive",
          });
          return;
        }
      } else {
        // Validar slides
        for (let i = 0; i < slides.length; i++) {
          const slide = slides[i];
          if (!slide.title || !slide.subtitle) {
            toast({
              title: "Erro",
              description: `Slide ${i + 1}: Preencha título e subtítulo.`,
              variant: "destructive",
            });
            return;
          }
        }
      }
    }

    if (formData.block_type === "why_aerion") {
      if (!formData.block_data.title) {
        toast({
          title: "Erro",
          description: "Preencha o título da seção.",
          variant: "destructive",
        });
        return;
      }
    }

    if (formData.block_type === "contact") {
      if (!formData.block_data.title) {
        toast({
          title: "Erro",
          description: "Preencha o título da seção.",
          variant: "destructive",
        });
        return;
      }
    }

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

  const handleDeleteClick = (id: string) => {
    const block = blocks.find((b) => b.id === id);
    if (!block) return;
    setBlockToDelete(block);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!blockToDelete) return;

    try {
      const { error } = await supabase.from("page_blocks").delete().eq("id", blockToDelete.id);
      if (error) throw error;
      toast({
        title: "Sucesso!",
        description: `Bloco "${BLOCK_TYPES.find((t) => t.value === blockToDelete.block_type)?.label || blockToDelete.block_type}" excluído com sucesso.`,
      });
      fetchBlocks();
    } catch (error: any) {
      toast({
        title: "Erro ao excluir bloco",
        description: error.message || "Não foi possível excluir o bloco.",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setBlockToDelete(null);
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
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-heading font-semibold text-navy-deep">
                  Slides do Hero (Carrossel)
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const slides = formData.block_data.slides || [];
                    const newSlide = {
                      title: "",
                      subtitle: "",
                      video_url: "",
                      poster_url: "",
                      cta1_text: "",
                      cta1_link: "",
                      cta2_text: "",
                      cta2_link: "",
                      order_index: slides.length,
                    };
                    setFormData({
                      ...formData,
                      block_data: {
                        ...formData.block_data,
                        slides: [...slides, newSlide],
                      },
                    });
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Slide
                </Button>
              </div>

              {/* Se não há slides, criar um padrão */}
              {(!formData.block_data.slides || formData.block_data.slides.length === 0) && (
                <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm text-yellow-800 mb-2">
                    Nenhum slide configurado. Adicione pelo menos um slide ou use o formato antigo abaixo.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        block_data: {
                          ...formData.block_data,
                          slides: [
                            {
                              title: formData.block_data.title || "",
                              subtitle: formData.block_data.subtitle || "",
                              video_url: formData.block_data.video_url || "",
                              poster_url: formData.block_data.poster_url || "",
                              cta1_text: formData.block_data.cta1_text || "",
                              cta1_link: formData.block_data.cta1_link || "",
                              cta2_text: formData.block_data.cta2_text || "",
                              cta2_link: formData.block_data.cta2_link || "",
                              order_index: 0,
                            },
                          ],
                        },
                      });
                    }}
                  >
                    Converter para Slide
                  </Button>
                </div>
              )}

              {/* Lista de Slides */}
              {formData.block_data.slides && formData.block_data.slides.length > 0 && (
                <div className="space-y-4 mb-6">
                  {formData.block_data.slides
                    .sort((a: any, b: any) => a.order_index - b.order_index)
                    .map((slide: any, index: number) => (
                      <Card key={index} className="p-4">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold">Slide {index + 1}</h4>
                          <div className="flex gap-2">
                            {index > 0 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const slides = [...formData.block_data.slides];
                                  slides[index].order_index = index - 1;
                                  slides[index - 1].order_index = index;
                                  setFormData({
                                    ...formData,
                                    block_data: { ...formData.block_data, slides },
                                  });
                                }}
                              >
                                <ArrowUp className="w-4 h-4" />
                              </Button>
                            )}
                            {index < formData.block_data.slides.length - 1 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const slides = [...formData.block_data.slides];
                                  slides[index].order_index = index + 1;
                                  slides[index + 1].order_index = index;
                                  setFormData({
                                    ...formData,
                                    block_data: { ...formData.block_data, slides },
                                  });
                                }}
                              >
                                <ArrowDown className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const slides = formData.block_data.slides.filter(
                                  (_: any, i: number) => i !== index
                                );
                                setFormData({
                                  ...formData,
                                  block_data: { ...formData.block_data, slides },
                                });
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Título *</label>
                            <Input
                              value={slide.title || ""}
                              onChange={(e) => {
                                const slides = [...formData.block_data.slides];
                                slides[index].title = e.target.value;
                                setFormData({
                                  ...formData,
                                  block_data: { ...formData.block_data, slides },
                                });
                              }}
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Subtítulo *</label>
                            <Textarea
                              value={slide.subtitle || ""}
                              onChange={(e) => {
                                const slides = [...formData.block_data.slides];
                                slides[index].subtitle = e.target.value;
                                setFormData({
                                  ...formData,
                                  block_data: { ...formData.block_data, slides },
                                });
                              }}
                              rows={2}
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Vídeo de Fundo</label>
                            <MediaUploader
                              onUploadComplete={(url) => {
                                const slides = [...formData.block_data.slides];
                                slides[index].video_url = url;
                                setFormData({
                                  ...formData,
                                  block_data: { ...formData.block_data, slides },
                                });
                              }}
                              currentUrl={slide.video_url}
                              onRemove={() => {
                                const slides = [...formData.block_data.slides];
                                slides[index].video_url = "";
                                setFormData({
                                  ...formData,
                                  block_data: { ...formData.block_data, slides },
                                });
                              }}
                              folder="hero"
                              accept="video/*"
                              label="Vídeo"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Poster</label>
                            <MediaUploader
                              onUploadComplete={(url) => {
                                const slides = [...formData.block_data.slides];
                                slides[index].poster_url = url;
                                setFormData({
                                  ...formData,
                                  block_data: { ...formData.block_data, slides },
                                });
                              }}
                              currentUrl={slide.poster_url}
                              onRemove={() => {
                                const slides = [...formData.block_data.slides];
                                slides[index].poster_url = "";
                                setFormData({
                                  ...formData,
                                  block_data: { ...formData.block_data, slides },
                                });
                              }}
                              folder="hero"
                              accept="image/*"
                              label="Poster"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">CTA 1 Texto</label>
                            <Input
                              value={slide.cta1_text || ""}
                              onChange={(e) => {
                                const slides = [...formData.block_data.slides];
                                slides[index].cta1_text = e.target.value;
                                setFormData({
                                  ...formData,
                                  block_data: { ...formData.block_data, slides },
                                });
                              }}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">CTA 1 Link</label>
                            <Input
                              value={slide.cta1_link || ""}
                              onChange={(e) => {
                                const slides = [...formData.block_data.slides];
                                slides[index].cta1_link = e.target.value;
                                setFormData({
                                  ...formData,
                                  block_data: { ...formData.block_data, slides },
                                });
                              }}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">CTA 2 Texto</label>
                            <Input
                              value={slide.cta2_text || ""}
                              onChange={(e) => {
                                const slides = [...formData.block_data.slides];
                                slides[index].cta2_text = e.target.value;
                                setFormData({
                                  ...formData,
                                  block_data: { ...formData.block_data, slides },
                                });
                              }}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">CTA 2 Link</label>
                            <Input
                              value={slide.cta2_link || ""}
                              onChange={(e) => {
                                const slides = [...formData.block_data.slides];
                                slides[index].cta2_link = e.target.value;
                                setFormData({
                                  ...formData,
                                  block_data: { ...formData.block_data, slides },
                                });
                              }}
                            />
                          </div>
                        </div>
                      </Card>
                    ))}
                </div>
              )}

              {/* Configurações do Carrossel */}
              {formData.block_data.slides && formData.block_data.slides.length > 1 && (
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.block_data.autoplay !== false}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          block_data: { ...formData.block_data, autoplay: checked },
                        })
                      }
                    />
                    <label className="text-sm font-medium">Reprodução Automática</label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Intervalo (ms)
                    </label>
                    <Input
                      type="number"
                      value={formData.block_data.autoplay_interval || 5000}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          block_data: {
                            ...formData.block_data,
                            autoplay_interval: parseInt(e.target.value) || 5000,
                          },
                        })
                      }
                    />
                  </div>
                </div>
              )}

              {/* Formato antigo (compatibilidade) - só mostra se não há slides */}
              {(!formData.block_data.slides || formData.block_data.slides.length === 0) && (
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

  // Criar blocos mockados para preview - atualiza automaticamente quando formData muda
  const getPreviewBlocks = (): PageBlock[] => {
    const activeBlocks = blocks.filter((b) => b.active).sort((a, b) => a.order_index - b.order_index);
    
    // Sempre mostrar preview quando formulário está aberto e há dados
    if (showForm && formData.block_type) {
      // Se está editando um bloco existente, substituir na lista
      if (editingBlock) {
        const updatedBlocks = activeBlocks.map((block) =>
          block.id === editingBlock.id
            ? {
                ...block,
                block_type: formData.block_type,
                block_data: formData.block_data,
                active: formData.active,
              }
            : block
        );
        return updatedBlocks;
      }
      
      // Se está criando novo bloco, adicionar ao final
      const previewBlock: PageBlock = {
        id: "preview",
        page_slug: "home",
        block_type: formData.block_type,
        block_data: formData.block_data,
        order_index: activeBlocks.length,
        active: formData.active,
      };
      return [...activeBlocks, previewBlock];
    }
    
    return activeBlocks;
  };

  // Atualizar preview quando formData mudar
  useEffect(() => {
    if (showForm && showPreview) {
      setPreviewKey((prev) => prev + 1);
    }
  }, [formData, showForm, showPreview]);

  return (
    <AdminLayout>
      <div className="max-w-[1920px] mx-auto">
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
            <Button
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
            >
              <Eye className="w-4 h-4 mr-2" />
              {showPreview ? "Ocultar Preview" : "Mostrar Preview"}
            </Button>
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

        <div className={`grid gap-6 ${showPreview && showForm ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"}`}>
          {/* Form Section */}
          <div>
            {showForm && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-heading font-semibold text-navy-deep">
                    {editingBlock ? "Editar Bloco" : "Adicionar Novo Bloco"}
                  </h2>
                  <Button variant="ghost" size="sm" onClick={resetForm}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                {renderBlockForm()}
              </div>
            )}

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
                          {block.block_data.slides && block.block_data.slides.length > 0 && (
                            <p className="text-gray-500 text-xs mt-1">
                              {block.block_data.slides.length} slide{block.block_data.slides.length > 1 ? "s" : ""} no carrossel
                            </p>
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
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteClick(block.id)}
                            aria-label={`Excluir bloco ${BLOCK_TYPES.find((t) => t.value === block.block_type)?.label || block.block_type}`}
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

          {/* Preview Section */}
          {showPreview && (
            <div className="lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)]">
              <Card className="p-6 h-full overflow-hidden flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-heading font-semibold text-navy-deep">
                    Preview em Tempo Real
                  </h2>
                  <Button variant="ghost" size="sm" onClick={() => setShowPreview(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="border rounded-lg overflow-auto bg-white flex-1">
                  <div className="min-h-screen" key={previewKey}>
                    {showForm && formData.block_type ? (
                      <BlockRenderer
                        pageSlug="home"
                        previewBlocks={getPreviewBlocks()}
                      />
                    ) : (
                      <BlockRenderer pageSlug="home" />
                    )}
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o bloco{" "}
              <strong>
                "{BLOCK_TYPES.find((t) => t.value === blockToDelete?.block_type)?.label ||
                  blockToDelete?.block_type}"
              </strong>
              ?
              <br />
              <br />
              Esta ação não pode ser desfeita e o bloco será removido permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setBlockToDelete(null)}>
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

export default AdminHome;

