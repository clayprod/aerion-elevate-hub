import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { migrateProductDataToDatabase } from "@/scripts/migrateProductData";
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

const MigrateProductData = () => {
  const { toast } = useToast();
  const [migrating, setMigrating] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState<string>("");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const handleMigrationClick = () => {
    setConfirmDialogOpen(true);
  };

  const handleMigration = async () => {
    setConfirmDialogOpen(false);

    setMigrating(true);
    setMigrationStatus("Iniciando migração...");

    try {
      // Capturar console.log para mostrar no status
      const originalLog = console.log;
      const logs: string[] = [];
      console.log = (...args: any[]) => {
        logs.push(args.join(" "));
        originalLog(...args);
      };

      await migrateProductDataToDatabase();

      console.log = originalLog;
      setMigrationStatus(logs.join("\n"));
      
      toast({
        title: "Sucesso!",
        description: "Migração de dados concluída com sucesso.",
      });
    } catch (error: any) {
      console.error("Erro na migração:", error);
      setMigrationStatus(`Erro: ${error.message}`);
      toast({
        title: "Erro",
        description: "Não foi possível completar a migração.",
        variant: "destructive",
      });
    } finally {
      setMigrating(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-heading font-bold text-navy-deep mb-8">
          Migração de Dados de Produtos
        </h1>

        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-heading font-bold text-navy-deep mb-4">
            Migrar Dados do Código para o Banco
          </h2>
          <p className="text-gray-dark mb-6">
            Este script migra todas as famílias de produtos e variantes do arquivo <code>products.ts</code> para o banco de dados.
            Os dados existentes serão atualizados e novos dados serão criados.
          </p>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800">
              <strong>Atenção:</strong> Esta operação irá:
            </p>
            <ul className="list-disc list-inside text-sm text-yellow-800 mt-2 space-y-1">
              <li>Criar ou atualizar famílias de produtos no banco</li>
              <li>Criar ou atualizar variantes de produtos no banco</li>
              <li>Preservar dados já existentes (atualizará apenas se o slug corresponder)</li>
            </ul>
          </div>

          <Button
            onClick={handleMigrationClick}
            disabled={migrating}
            className="bg-action hover:bg-action/90 text-action-foreground"
          >
            {migrating ? "Migrando..." : "Executar Migração"}
          </Button>

          {migrationStatus && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Status da Migração:</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto max-h-96">
                {migrationStatus}
              </pre>
            </div>
          )}
        </Card>

        <Card className="p-8">
          <h2 className="text-2xl font-heading font-bold text-navy-deep mb-4">
            Próximos Passos
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-dark">
            <li>Execute a migração usando o botão acima</li>
            <li>Verifique os dados em "Famílias de Produtos" e "Variantes de Produtos"</li>
            <li>As páginas de produtos começarão a usar dados do banco automaticamente</li>
            <li>Use o Editor de Páginas para personalizar o conteúdo de cada produto</li>
          </ol>
        </Card>

        {/* Confirmation Dialog */}
        <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar migração de dados</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja migrar os dados de produtos?
                <br />
                <br />
                Esta operação irá atualizar ou criar registros no banco de dados. Os dados existentes serão atualizados e novos dados serão criados.
                <br />
                <br />
                <strong>Esta ação não pode ser desfeita facilmente.</strong>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleMigration}
                className="bg-action hover:bg-action/90 text-action-foreground"
              >
                Executar Migração
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
};

export default MigrateProductData;

