import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Save, Eye, GripVertical, Trash2, Edit, X } from "lucide-react";
import DynamicHeroSection from "@/components/home/DynamicHeroSection";
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

const ProductPageEditor = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [blocks, setBlocks] = useState<PageBlock[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingBlock, setEditingBlock] = useState<PageBlock | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [blockToDelete, setBlockToDelete] = useState<PageBlock | null>(null);
  const [productSlug, setProductSlug] = useState(slug || "");
  const [products, setProducts] = useState<{ slug: string; name: string }[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  // Available product slugs
  const availableProducts = [
    { slug: "evo-max-v2", name: "EVO Max V2" },
    { slug: "evo-lite-enterprise", name: "EVO Lite Enterprise" },
    { slug: "autel-alpha", name: "Autel Alpha" },
    { slug: "autel-mapper", name: "Autel Mapper" },
  ];

  useEffect(() => {
    setProducts(availableProducts);
    if (slug) {
      setProductSlug(slug);
    }
  }, [slug]);

  useEffect(() => {
    if (productSlug) {
      fetchBlocks();
    }
  }, [productSlug]);

  const fetchBlocks = async () => {
    if (!productSlug) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("page_blocks")
        .select("*")
        .eq("page_slug", productSlug)
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
    } finally {
      setLoading(false);
    }
  };

  const handleAddBlock = (blockType: string) => {
    const newBlock: Omit<PageBlock, "id"> = {
      page_slug: productSlug,
      block_type: blockType,
      block_data: getDefaultBlockData(blockType),
      order_index: blocks.length,
      active: true,
    };

    setEditingBlock(newBlock as PageBlock);
  };

  const getDefaultBlockData = (blockType: string) => {
    switch (blockType) {
      case "hero":
        return { video_url: "", poster_url: "", title: "", subtitle: "" };
      case "highlight":
        return { items: [] };
      case "specification":
        return { categories: {} };
      case "application":
        return { items: [] };
      case "video":
        return { videos: [] };
      default:
        return {};
    }
  };

  const handleSaveBlock = async (block: PageBlock) => {
    setSaving(true);
    try {
      if (block.id) {
        // Update existing block
        const { error } = await supabase
          .from("page_blocks")
          .update({
            block_data: block.block_data,
            active: block.active,
          })
          .eq("id", block.id);

        if (error) throw error;
      } else {
        // Create new block
        const { error } = await supabase.from("page_blocks").insert({
          page_slug: block.page_slug,
          block_type: block.block_type,
          block_data: block.block_data,
          order_index: block.order_index,
          active: block.active,
        });

        if (error) throw error;
      }

      toast({
        title: "Sucesso!",
        description: "Bloco salvo com sucesso.",
      });

      setEditingBlock(null);
      fetchBlocks();
    } catch (error: any) {
      console.error("Error saving block:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o bloco.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBlock = async () => {
    if (!blockToDelete) return;

    try {
      const { error } = await supabase.from("page_blocks").delete().eq("id", blockToDelete.id);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Bloco excluído com sucesso.",
      });

      fetchBlocks();
    } catch (error: any) {
      console.error("Error deleting block:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o bloco.",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setBlockToDelete(null);
    }
  };

  const getBlockTitle = (blockType: string) => {
    const titles: Record<string, string> = {
      hero: "Hero",
      highlight: "Destaques",
      specification: "Especificações",
      application: "Aplicações",
      video: "Vídeos",
    };
    return titles[blockType] || blockType;
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold text-navy-deep mb-2">
            Editor de Página de Produto
          </h1>
          <p className="text-gray-dark text-lg">
            Edite o conteúdo da página usando blocos
          </p>
        </div>

        {/* Product Selector */}
        <Card className="p-6 mb-8">
          <div className="flex items-center gap-4 flex-wrap">
            <label className="text-sm font-medium">Produto:</label>
            <Select value={productSlug} onValueChange={(value) => {
              setProductSlug(value);
              if (value) {
                setTimeout(() => fetchBlocks(), 100);
              }
            }}>
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Selecione um produto" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.slug} value={product.slug}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {productSlug && (
              <>
                <Button onClick={fetchBlocks} disabled={!productSlug || loading}>
                  {loading ? "Carregando..." : "Recarregar"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.open(`/produtos/${productSlug}`, '_blank')}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Página Pública
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowPreview(!showPreview)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {showPreview ? "Ocultar Preview" : "Mostrar Preview"}
                </Button>
              </>
            )}
          </div>
        </Card>

        {/* Add Block */}
        {productSlug && (
          <Card className="p-6 mb-8">
            <h2 className="text-xl font-heading font-bold text-navy-deep mb-4">
              Adicionar Bloco
            </h2>
            <div className="flex flex-wrap gap-2">
              {["hero", "highlight", "specification", "application", "video"].map((blockType) => (
                <Button
                  key={blockType}
                  variant="outline"
                  onClick={() => handleAddBlock(blockType)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {getBlockTitle(blockType)}
                </Button>
              ))}
            </div>
          </Card>
        )}

        {/* Preview Section */}
        {showPreview && productSlug && (
          <Card className="p-6 mb-8 border-blue-200 bg-blue-50">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-heading font-bold text-navy-deep">
                Preview em Tempo Real
              </h2>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowPreview(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-4 bg-gray-50 border-b">
                <p className="text-sm text-gray-600">
                  Visualização dos blocos ativos para: <strong>{products.find(p => p.slug === productSlug)?.name || productSlug}</strong>
                </p>
              </div>
              <div className="max-h-[600px] overflow-y-auto p-4">
                {blocks.filter(b => b.active).length === 0 && !editingBlock ? (
                  <p className="text-gray-500 text-center py-8">Nenhum bloco ativo para preview</p>
                ) : (
                  <ProductBlockPreview 
                    blocks={blocks.filter(b => b.active).sort((a, b) => a.order_index - b.order_index)}
                    editingBlock={editingBlock}
                  />
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Blocks List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Carregando blocos...</p>
          </div>
        ) : blocks.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-gray-500 text-lg">Nenhum bloco adicionado ainda</p>
            <p className="text-gray-400 text-sm mt-2">
              Adicione blocos para começar a editar a página
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {blocks.map((block, index) => (
              <Card key={block.id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <GripVertical className="h-5 w-5 text-gray-400" />
                    <h3 className="text-lg font-heading font-bold text-navy-deep">
                      {getBlockTitle(block.block_type)}
                    </h3>
                    {!block.active && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        Inativo
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingBlock(block)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setBlockToDelete(block);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  Tipo: {block.block_type} | Ordem: {block.order_index}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Block Editor Dialog */}
        {editingBlock && (
          <BlockEditorDialog
            block={editingBlock}
            onSave={handleSaveBlock}
            onCancel={() => setEditingBlock(null)}
            saving={saving}
          />
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir este bloco? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteBlock}>Excluir</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
};

// Block Editor Dialog Component
interface BlockEditorDialogProps {
  block: PageBlock;
  onSave: (block: PageBlock) => void;
  onCancel: () => void;
  saving: boolean;
}

const BlockEditorDialog = ({ block, onSave, onCancel, saving }: BlockEditorDialogProps) => {
  const [blockData, setBlockData] = useState(block.block_data);
  const [active, setActive] = useState(block.active);

  const handleSave = () => {
    onSave({
      ...block,
      block_data: blockData,
      active,
    });
  };

  // Render different editors based on block type
  const renderEditor = () => {
    switch (block.block_type) {
      case "hero":
        return (
          <HeroBlockEditor data={blockData} onChange={setBlockData} />
        );
      case "highlight":
        return (
          <HighlightBlockEditor data={blockData} onChange={setBlockData} />
        );
      case "specification":
        return (
          <SpecificationBlockEditor data={blockData} onChange={setBlockData} />
        );
      case "application":
        return (
          <ApplicationBlockEditor data={blockData} onChange={setBlockData} />
        );
      case "video":
        return (
          <VideoBlockEditor data={blockData} onChange={setBlockData} />
        );
      default:
        return <div>Editor não implementado para este tipo de bloco</div>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-heading font-bold text-navy-deep">
              Editar Bloco: {block.block_type}
            </h2>
            <Button variant="ghost" size="icon" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {renderEditor()}

          <div className="flex items-center gap-4 mt-6 pt-6 border-t">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Ativo</span>
            </label>
            <div className="flex-1" />
            <Button variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

// Individual Block Editors (simplified versions - will be expanded)
const HeroBlockEditor = ({ data, onChange }: { data: any; onChange: (data: any) => void }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">URL do Vídeo</label>
        <Input
          value={data.video_url || ""}
          onChange={(e) => onChange({ ...data, video_url: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">URL do Poster</label>
        <Input
          value={data.poster_url || ""}
          onChange={(e) => onChange({ ...data, poster_url: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Título</label>
        <Input
          value={data.title || ""}
          onChange={(e) => onChange({ ...data, title: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Subtítulo</label>
        <Input
          value={data.subtitle || ""}
          onChange={(e) => onChange({ ...data, subtitle: e.target.value })}
        />
      </div>
    </div>
  );
};

const HighlightBlockEditor = ({ data, onChange }: { data: any; onChange: (data: any) => void }) => {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        Editor de destaques - será expandido com funcionalidade completa
      </p>
      <Button onClick={() => onChange({ ...data, items: [...(data.items || []), {}] })}>
        Adicionar Destaque
      </Button>
    </div>
  );
};

const SpecificationBlockEditor = ({ data, onChange }: { data: any; onChange: (data: any) => void }) => {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        Editor de especificações - será expandido com funcionalidade completa
      </p>
    </div>
  );
};

const ApplicationBlockEditor = ({ data, onChange }: { data: any; onChange: (data: any) => void }) => {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        Editor de aplicações - será expandido com funcionalidade completa
      </p>
    </div>
  );
};

const VideoBlockEditor = ({ data, onChange }: { data: any; onChange: (data: any) => void }) => {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        Editor de vídeos - será expandido com funcionalidade completa
      </p>
    </div>
  );
};

// Product Block Preview Component
interface ProductBlockPreviewProps {
  blocks: PageBlock[];
  editingBlock?: PageBlock | null;
}

const ProductBlockPreview = ({ blocks, editingBlock }: ProductBlockPreviewProps) => {
  // Se está editando um bloco novo (sem id), adicionar ao final
  // Se está editando um bloco existente, substituir na lista
  let displayBlocks = [...blocks];
  
  if (editingBlock) {
    if (editingBlock.id) {
      // Substituir bloco existente
      displayBlocks = blocks.map((block) =>
        block.id === editingBlock.id ? editingBlock : block
      );
    } else {
      // Adicionar novo bloco ao final
      displayBlocks = [...blocks, editingBlock];
    }
  }

  return (
    <div className="space-y-8">
      {displayBlocks.map((block) => {
        switch (block.block_type) {
          case "hero":
            return (
              <div key={block.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-600">
                  Hero Section
                </div>
                <div className="bg-white">
                  <DynamicHeroSection data={block.block_data} />
                </div>
              </div>
            );
          case "highlight":
            return (
              <div key={block.id} className="border border-gray-200 rounded-lg p-4">
                <div className="bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-600 mb-4 rounded">
                  Destaques
                </div>
                <div className="text-sm text-gray-600">
                  {block.block_data?.items?.length > 0 ? (
                    <ul className="list-disc list-inside space-y-2">
                      {block.block_data.items.map((item: any, idx: number) => (
                        <li key={idx}>{item.title || `Destaque ${idx + 1}`}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-400 italic">Nenhum destaque adicionado</p>
                  )}
                </div>
              </div>
            );
          case "specification":
            return (
              <div key={block.id} className="border border-gray-200 rounded-lg p-4">
                <div className="bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-600 mb-4 rounded">
                  Especificações
                </div>
                <div className="text-sm text-gray-600">
                  {block.block_data?.categories && Object.keys(block.block_data.categories).length > 0 ? (
                    <div className="space-y-2">
                      {Object.entries(block.block_data.categories).map(([category, specs]: [string, any]) => (
                        <div key={category}>
                          <strong className="text-gray-800">{category}:</strong> {Object.keys(specs).length} especificações
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 italic">Nenhuma especificação adicionada</p>
                  )}
                </div>
              </div>
            );
          case "application":
            return (
              <div key={block.id} className="border border-gray-200 rounded-lg p-4">
                <div className="bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-600 mb-4 rounded">
                  Aplicações
                </div>
                <div className="text-sm text-gray-600">
                  {block.block_data?.items?.length > 0 ? (
                    <ul className="list-disc list-inside space-y-2">
                      {block.block_data.items.map((item: any, idx: number) => (
                        <li key={idx}>{item.title || `Aplicação ${idx + 1}`}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-400 italic">Nenhuma aplicação adicionada</p>
                  )}
                </div>
              </div>
            );
          case "video":
            return (
              <div key={block.id} className="border border-gray-200 rounded-lg p-4">
                <div className="bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-600 mb-4 rounded">
                  Vídeos
                </div>
                <div className="text-sm text-gray-600">
                  {block.block_data?.videos?.length > 0 ? (
                    <ul className="list-disc list-inside space-y-2">
                      {block.block_data.videos.map((video: any, idx: number) => (
                        <li key={idx}>{video.title || video.url || `Vídeo ${idx + 1}`}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-400 italic">Nenhum vídeo adicionado</p>
                  )}
                </div>
              </div>
            );
          default:
            return (
              <div key={block.id} className="border border-gray-200 rounded-lg p-4">
                <div className="text-sm text-gray-600">
                  Tipo de bloco não suportado: {block.block_type}
                </div>
              </div>
            );
        }
      })}
    </div>
  );
};

export default ProductPageEditor;

