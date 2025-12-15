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
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Produto:</label>
            <Input
              value={productSlug}
              onChange={(e) => setProductSlug(e.target.value)}
              placeholder="ex: evo-max-v2"
              className="max-w-xs"
            />
            <Button onClick={fetchBlocks} disabled={!productSlug}>
              Carregar
            </Button>
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

export default ProductPageEditor;

