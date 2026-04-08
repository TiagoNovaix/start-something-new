import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil } from "lucide-react";
import { toastSuccess, toastError } from "@/hooks/useToast";
import CentroCustoModal from "./CentroCustoModal";
import { useCompany } from "@/hooks/useCompany";

export type CentroCusto = {
  id: string;
  nome: string;
  descricao: string | null;
  ativo: boolean | null;
};

const CentrosCusto = () => {
  const queryClient = useQueryClient();
  const { companyId } = useCompany();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CentroCusto | null>(null);

  const { data: centros = [], isLoading } = useQuery({
    queryKey: ["centros_custo", companyId],
    enabled: !!companyId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("centros_custo")
        .select("id, nome, descricao, ativo")
        .eq("company_id", companyId!)
        .is("deleted_at", null)
        .order("nome");
      if (error) throw error;
      return data as CentroCusto[];
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, ativo }: { id: string; ativo: boolean }) => {
      const { error } = await supabase.from("centros_custo").update({ ativo }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["centros_custo"] });
      toastSuccess("Status atualizado");
    },
    onError: () => toastError("Erro ao atualizar status"),
  });

  return (
    <div className="bg-card rounded-lg border p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium">Centros de Custo</h2>
          <p className="text-sm text-muted-foreground">Gerencie os centros de custo para organizar seus lançamentos</p>
        </div>
        <Button size="sm" onClick={() => { setEditing(null); setModalOpen(true); }}>
          <Plus className="mr-1 h-4 w-4" /> Novo Centro de Custo
        </Button>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground text-sm">Carregando…</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {centros.map((cc) => (
              <TableRow key={cc.id}>
                <TableCell className="font-medium">{cc.nome}</TableCell>
                <TableCell className="text-muted-foreground">{cc.descricao || "—"}</TableCell>
                <TableCell>
                  <Switch
                    checked={cc.ativo !== false}
                    onCheckedChange={(checked) => toggleMutation.mutate({ id: cc.id, ativo: checked })}
                  />
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => { setEditing(cc); setModalOpen(true); }}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {centros.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  Nenhum centro de custo cadastrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      <CentroCustoModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        centroCusto={editing}
      />
    </div>
  );
};

export default CentrosCusto;
