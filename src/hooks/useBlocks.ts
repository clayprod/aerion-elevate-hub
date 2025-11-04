import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Block, BlockType } from '@/types/blocks';
import { useToast } from '@/hooks/use-toast';

export const useBlocks = (pageSlug: string) => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchBlocks = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('page_sections')
        .select('*')
        .eq('page_slug', pageSlug)
        .eq('active', true)
        .order('order_index', { ascending: true });

      if (error) {
        throw error;
      }

      // Converter dados do banco para formato Block
      const formattedBlocks: Block[] = (data || []).map(item => ({
        id: item.id,
        type: item.section_type as BlockType,
        order_index: item.order_index,
        active: item.active,
        created_at: item.created_at,
        updated_at: item.updated_at,
        content: item.content
      }));

      setBlocks(formattedBlocks);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar blocos';
      setError(errorMessage);
      console.error('Erro ao buscar blocos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createBlock = async (block: Omit<Block, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('page_sections')
        .insert({
          page_slug: pageSlug,
          section_type: block.type,
          content: block.content,
          order_index: block.order_index,
          active: block.active
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      const newBlock: Block = {
        id: data.id,
        type: data.section_type as BlockType,
        order_index: data.order_index,
        active: data.active,
        created_at: data.created_at,
        updated_at: data.updated_at,
        content: data.content
      };

      setBlocks(prev => [...prev, newBlock]);
      toast({
        title: 'Sucesso!',
        description: 'Bloco criado com sucesso.',
      });

      return newBlock;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar bloco';
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  };

  const updateBlock = async (blockId: string, updates: Partial<Block>) => {
    try {
      const { data, error } = await supabase
        .from('page_sections')
        .update({
          section_type: updates.type,
          content: updates.content,
          order_index: updates.order_index,
          active: updates.active,
          updated_at: new Date().toISOString()
        })
        .eq('id', blockId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      const updatedBlock: Block = {
        id: data.id,
        type: data.section_type as BlockType,
        order_index: data.order_index,
        active: data.active,
        created_at: data.created_at,
        updated_at: data.updated_at,
        content: data.content
      };

      setBlocks(prev => prev.map(block => 
        block.id === blockId ? updatedBlock : block
      ));

      toast({
        title: 'Sucesso!',
        description: 'Bloco atualizado com sucesso.',
      });

      return updatedBlock;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar bloco';
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  };

  const deleteBlock = async (blockId: string) => {
    try {
      const { error } = await supabase
        .from('page_sections')
        .delete()
        .eq('id', blockId);

      if (error) {
        throw error;
      }

      setBlocks(prev => prev.filter(block => block.id !== blockId));
      toast({
        title: 'Sucesso!',
        description: 'Bloco removido com sucesso.',
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao remover bloco';
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  };

  const reorderBlocks = async (blockId: string, newOrderIndex: number) => {
    try {
      const { error } = await supabase
        .from('page_sections')
        .update({ order_index: newOrderIndex })
        .eq('id', blockId);

      if (error) {
        throw error;
      }

      // Atualizar estado local
      setBlocks(prev => prev.map(block => 
        block.id === blockId 
          ? { ...block, order_index: newOrderIndex }
          : block
      ));

      // Reordenar array
      setBlocks(prev => [...prev].sort((a, b) => a.order_index - b.order_index));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao reordenar blocos';
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  };

  const moveBlock = async (blockId: string, direction: 'up' | 'down') => {
    const currentBlock = blocks.find(block => block.id === blockId);
    if (!currentBlock) return;

    const currentIndex = blocks.findIndex(block => block.id === blockId);
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= blocks.length) return;

    const targetBlock = blocks[targetIndex];
    
    // Trocar as posições
    await Promise.all([
      reorderBlocks(blockId, targetBlock.order_index),
      reorderBlocks(targetBlock.id, currentBlock.order_index)
    ]);
  };

  useEffect(() => {
    fetchBlocks();
  }, [pageSlug]);

  return {
    blocks,
    isLoading,
    error,
    createBlock,
    updateBlock,
    deleteBlock,
    reorderBlocks,
    moveBlock,
    refetch: fetchBlocks
  };
};

// Hook para gerenciar blocos de uma página específica (para admin)
export const usePageBlocks = (pageSlug: string) => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchPageBlocks = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('page_sections')
        .select('*')
        .eq('page_slug', pageSlug)
        .order('order_index', { ascending: true });

      if (error) {
        throw error;
      }

      const formattedBlocks: Block[] = (data || []).map(item => ({
        id: item.id,
        type: item.section_type as BlockType,
        order_index: item.order_index,
        active: item.active,
        created_at: item.created_at,
        updated_at: item.updated_at,
        content: item.content
      }));

      setBlocks(formattedBlocks);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar blocos da página';
      setError(errorMessage);
      console.error('Erro ao buscar blocos da página:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const savePageBlocks = async (newBlocks: Block[]) => {
    try {
      // Primeiro, remover todos os blocos existentes da página
      await supabase
        .from('page_sections')
        .delete()
        .eq('page_slug', pageSlug);

      // Depois, inserir os novos blocos
      if (newBlocks.length > 0) {
        const blocksToInsert = newBlocks.map(block => ({
          page_slug: pageSlug,
          section_type: block.type,
          content: block.content,
          order_index: block.order_index,
          active: block.active
        }));

        const { error } = await supabase
          .from('page_sections')
          .insert(blocksToInsert);

        if (error) {
          throw error;
        }
      }

      setBlocks(newBlocks);
      toast({
        title: 'Sucesso!',
        description: 'Página salva com sucesso.',
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao salvar página';
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchPageBlocks();
  }, [pageSlug]);

  return {
    blocks,
    isLoading,
    error,
    savePageBlocks,
    refetch: fetchPageBlocks
  };
};

