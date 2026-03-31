import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import SocioModal from "./SocioModal";

const SociosList = () => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);

  const { data: socios = [], isLoading } = useQuery({
    queryKey: ["socios"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("socios")
        .select("*")
        .order("nome");
      if (error) throw error;
      return data;
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, ativo }: { id: string; ativo: boolean }) => {
      const { error } = await supabase.from("socios").update({ ativo }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["socios"] });
      toast({ title: "Status atualizado" });
    },
    onError: () => toast({ title: "Erro ao atualizar status", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("socios").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["socios"] });
      toast({ title: "Sócio excluído" });
    },
    onError: () => toast({ title: "Erro ao excluir sócio", variant: "destructive" }),
  });

  const handleDelete = (id: string) => {
    if (confirm("Deseja realmente excluir este sócio?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="bg-card rounded-lg border p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Gestão de Sócios</h2>
        <Button size="sm" onClick={() => { setEditing(null); setModalOpen(true); }}>
          <Plus className="mr-1 h-4 w-4" /> Novo Sócio
        </Button>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground text-sm">Carregando…</p>
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
                <TableCell>
                  <Switch
                    checked={socio.ativo !== false}
                    onCheckedChange={(checked) => toggleMutation.mutate({ id: socio.id, ativo: checked })}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => { setEditing(socio); setModalOpen(true); }}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(socio.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {socios.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  Nenhum sócio cadastrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      <SocioModal 
        open={modalOpen} 
        onOpenChange={setModalOpen} 
        editing={editing} 
      />
    </div>
  );
};

export default SociosList;