import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Download, Upload, Trash2, Calendar, HardDrive, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Backup {
  id: string;
  name: string;
  description: string | null;
  backup_data: any;
  size_bytes: number | null;
  tables_backed_up: string[];
  created_at: string;
  created_by: string | null;
  restored_at: string | null;
  restored_by: string | null;
}

const AdminBackups = () => {
  const { toast } = useToast();
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [restoring, setRestoring] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total_backups: 0,
    total_size_bytes: 0,
    oldest_backup: null as string | null,
    newest_backup: null as string | null,
    last_restore: null as string | null,
  });
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [backupName, setBackupName] = useState("");
  const [backupDescription, setBackupDescription] = useState("");

  useEffect(() => {
    fetchBackups();
    fetchStats();
  }, []);

  const fetchBackups = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("backups")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os backups.",
        variant: "destructive",
      });
    } else {
      setBackups(data || []);
    }
    setLoading(false);
  };

  const fetchStats = async () => {
    const { data, error } = await supabase.rpc("get_backup_stats");

    if (!error && data && data.length > 0) {
      setStats(data[0]);
    }
  };

  const formatBytes = (bytes: number | null): string => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const handleCreateBackup = async () => {
    if (!backupName.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, informe um nome para o backup.",
        variant: "destructive",
      });
      return;
    }

    setCreating(true);
    try {
      // Chamar a função com os parâmetros corretos
      const { data, error } = await supabase.rpc("create_site_backup", {
        backup_name: backupName.trim(),
        backup_description: backupDescription?.trim() || null,
      });

      if (error) {
        // Se o erro for sobre função não encontrada, dar mensagem mais clara
        const errorMessage = error.message || "";
        if (errorMessage.includes("Could not find the function") || 
            (errorMessage.includes("function") && errorMessage.includes("does not exist")) ||
            errorMessage.includes("schema cache")) {
          throw new Error("A função de backup não foi encontrada no banco de dados. Por favor, execute a migration '20250117000000_backup_system.sql' no Supabase SQL Editor.");
        }
        throw error;
      }

      toast({
        title: "Sucesso!",
        description: "Backup criado com sucesso.",
      });

      setCreateDialogOpen(false);
      setBackupName("");
      setBackupDescription("");
      fetchBackups();
      fetchStats();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível criar o backup.",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  const handleRestoreBackup = async (backupId: string) => {
    setRestoring(backupId);
    try {
      const { error } = await supabase.rpc("restore_site_backup", {
        backup_id: backupId,
      });

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Backup restaurado com sucesso. A página será recarregada.",
      });

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível restaurar o backup.",
        variant: "destructive",
      });
      setRestoring(null);
    }
  };

  const handleDeleteBackup = async (backupId: string) => {
    const { error } = await supabase.from("backups").delete().eq("id", backupId);

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o backup.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Sucesso!",
        description: "Backup excluído com sucesso.",
      });
      fetchBackups();
      fetchStats();
    }
  };

  const handleDownloadBackup = (backup: Backup) => {
    const dataStr = JSON.stringify(backup.backup_data, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `backup-${backup.name.replace(/\s+/g, "-")}-${backup.id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Download iniciado",
      description: "O backup foi baixado com sucesso.",
    });
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-heading font-bold text-navy-deep">
            Gerenciamento de Backups
          </h1>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-action hover:bg-action/90 text-action-foreground">
                <Download className="mr-2 h-4 w-4" />
                Criar Backup
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Novo Backup</DialogTitle>
                <DialogDescription>
                  Crie um backup completo de todos os dados do site.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Nome do Backup *
                  </label>
                  <Input
                    value={backupName}
                    onChange={(e) => setBackupName(e.target.value)}
                    placeholder="Ex: Backup antes de atualização"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Descrição (opcional)
                  </label>
                  <Textarea
                    value={backupDescription}
                    onChange={(e) => setBackupDescription(e.target.value)}
                    placeholder="Descreva o motivo ou contexto deste backup"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setCreateDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleCreateBackup}
                  disabled={creating}
                  className="bg-action hover:bg-action/90"
                >
                  {creating ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Criando...
                    </>
                  ) : (
                    "Criar Backup"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-medium">Total de Backups</p>
                <p className="text-2xl font-bold text-navy-deep">
                  {stats.total_backups}
                </p>
              </div>
              <HardDrive className="h-8 w-8 text-action" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-medium">Tamanho Total</p>
                <p className="text-2xl font-bold text-navy-deep">
                  {formatBytes(stats.total_size_bytes)}
                </p>
              </div>
              <HardDrive className="h-8 w-8 text-action" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-medium">Backup Mais Antigo</p>
                <p className="text-sm font-semibold text-navy-deep">
                  {stats.oldest_backup
                    ? format(new Date(stats.oldest_backup), "dd/MM/yyyy", {
                        locale: ptBR,
                      })
                    : "N/A"}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-action" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-medium">Última Restauração</p>
                <p className="text-sm font-semibold text-navy-deep">
                  {stats.last_restore
                    ? format(new Date(stats.last_restore), "dd/MM/yyyy HH:mm", {
                        locale: ptBR,
                      })
                    : "Nunca"}
                </p>
              </div>
              <Upload className="h-8 w-8 text-action" />
            </div>
          </Card>
        </div>

        {/* Backups Table */}
        <Card>
          <div className="p-6">
            <h2 className="text-2xl font-heading font-bold text-navy-deep mb-4">
              Lista de Backups
            </h2>
            {loading ? (
              <div className="text-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto text-action" />
                <p className="mt-2 text-gray-medium">Carregando backups...</p>
              </div>
            ) : backups.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-medium">
                  Nenhum backup encontrado. Crie seu primeiro backup!
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Tamanho</TableHead>
                    <TableHead>Tabelas</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {backups.map((backup) => (
                    <TableRow key={backup.id}>
                      <TableCell className="font-medium">
                        {backup.name}
                      </TableCell>
                      <TableCell className="text-gray-medium">
                        {backup.description || "-"}
                      </TableCell>
                      <TableCell>{formatBytes(backup.size_bytes)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {backup.tables_backed_up.length} tabelas
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(
                          new Date(backup.created_at),
                          "dd/MM/yyyy HH:mm",
                          { locale: ptBR }
                        )}
                      </TableCell>
                      <TableCell>
                        {backup.restored_at ? (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Restaurado
                          </Badge>
                        ) : (
                          <Badge variant="outline">Disponível</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadBackup(backup)}
                            title="Baixar backup"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={restoring === backup.id}
                                title="Restaurar backup"
                              >
                                {restoring === backup.id ? (
                                  <RefreshCw className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Upload className="h-4 w-4" />
                                )}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Restaurar Backup?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta ação irá substituir todos os dados atuais
                                  pelos dados deste backup. Esta ação não pode
                                  ser desfeita. Tem certeza?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleRestoreBackup(backup.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Restaurar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                title="Excluir backup"
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Excluir Backup?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta ação não pode ser desfeita. O backup será
                                  permanentemente excluído.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteBackup(backup.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </Card>

        {/* Info Card */}
        <Card className="mt-6 p-6 bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-navy-deep mb-2">
            ℹ️ Sobre Backups Automáticos
          </h3>
          <p className="text-sm text-gray-medium">
            Backups automáticos semanais são criados toda segunda-feira às 02:00
            (horário do servidor). Os backups mais antigos (acima de 12 semanas)
            são automaticamente removidos para economizar espaço. Você pode
            criar backups manuais a qualquer momento usando o botão acima.
          </p>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminBackups;

