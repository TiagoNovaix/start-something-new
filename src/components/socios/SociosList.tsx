import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Users } from "lucide-react";
import { toastSuccess, toastError } from "@/hooks/useToast";
import { useIsMobile } from "@/hooks/use-mobile";
import EmptyState from "@/components/EmptyState";
import SocioModal from "./SocioModal";

const SociosList = () => {
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);

  const { data: socios = [], isLoading } = useQuery({
    queryKey: ["socios"],
    queryFn: async () => {
      const { data, error } = await supabase.from("socios").select("*").order("nome");
      if (error) throw error;
      return data;
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, ativo }: { id: string; ativo: boolean }) => {
      const { error } = await supabase.from("socios").update({ ativo }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["socios"] }); toast.success("Status atualizado"); },
    onError: (err: any) => toast.error("Erro ao atualizar status", { description: err.message }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("socios").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["socios"] }); toast.success("Sócio excluído"); },
    onError: (err: any) => toast.error("Erro ao excluir sócio", { description: err.message }),
  });

  const handleDelete = (id: string) => {
    if (confirm("Deseja realmente excluir este sócio?")) deleteMutation.mutate(id);
  };

  return (
    <div className="bg-card rounded-lg border p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Gestão de Sócios</h2>
        <Button size="sm" onClick={() => { setEditing(null); setModalOpen(true); }}>
          <Plus className="mr-1 h-4 w-4" /> Novo Sócio
        </Button>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground text-sm">Carregando…</p>
      ) : socios.length === 0 ? (
        <EmptyState icon={Users} title="Nenhum sócio cadastrado" description="Adicione os sócios da empresa para gerenciar participações e distribuições." actionLabel="Novo Sócio" onAction={() => { setEditing(null); setModalOpen(true); }} />
      ) : isMobile ? (
        <div className="space-y-3">
          {socios.map((socio) => (
            <Card key={socio.id} className="bg-background border">
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{socio.nome}</span>
                  <Switch checked={socio.ativo !== false} onCheckedChange={(c) => toggleMutation.mutate({ id: socio.id, ativo: c })} />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{socio.email || "—"}</span>
                  <Badge variant="outline" className="border-primary/20 text-primary">{socio.participacao}%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">R$ {socio.pro_labore?.toLocaleString() || "0,00"}</span>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditing(socio); setModalOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(socio.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Participação (%)</TableHead>
              <TableHead>Pró-labore (R$)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {socios.map((socio) => (
              <TableRow key={socio.id}>
                <TableCell className="font-medium">{socio.nome}</TableCell>
                <TableCell className="text-muted-foreground">{socio.email || "—"}</TableCell>
                <TableCell>{socio.participacao}%</TableCell>
                <TableCell>R$ {socio.pro_labore?.toLocaleString() || "0,00"}</TableCell>
                <TableCell><Switch checked={socio.ativo !== false} onCheckedChange={(c) => toggleMutation.mutate({ id: socio.id, ativo: c })} /></TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => { setEditing(socio); setModalOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(socio.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <SocioModal open={modalOpen} onOpenChange={setModalOpen} editing={editing} />
    </div>
  );
};

export default SociosList;
