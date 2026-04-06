import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil } from "lucide-react";
import { toastSuccess, toastError } from "@/hooks/useToast";
import CategoriaModal from "./CategoriaModal";

export type Categoria = {
  id: string;
  nome: string;
  tipo: string;
  classificacao_dre: string | null;
  subgrupo: string | null;
  ativo: boolean | null;
};

const CategoriasDre = () => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Categoria | null>(null);

  const { data: categorias = [], isLoading } = useQuery({
    queryKey: ["categorias"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categorias")
        .select("id, nome, tipo, classificacao_dre, subgrupo, ativo")
        .order("nome");
      if (error) throw error;
      return data as Categoria[];
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, ativo }: { id: string; ativo: boolean }) => {
      const { error } = await supabase.from("categorias").update({ ativo }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
      toast({ title: "Status atualizado" });
    },
    onError: () => toast({ title: "Erro ao atualizar status", variant: "destructive" }),
  });

  return (
    <div className="bg-card rounded-lg border p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Categorias DRE</h2>
        <Button size="sm" onClick={() => { setEditing(null); setModalOpen(true); }}>
          <Plus className="mr-1 h-4 w-4" /> Nova Categoria
        </Button>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground text-sm">Carregando…</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Grupo DRE</TableHead>
              <TableHead>Subgrupo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categorias.map((cat) => (
              <TableRow key={cat.id}>
                <TableCell className="font-medium">{cat.nome}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={cat.tipo === "entrada" ? "border-emerald-500/40 text-emerald-400" : "border-rose-500/40 text-rose-400"}>
                    {cat.tipo === "entrada" ? "Entrada" : "Saída"}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{cat.classificacao_dre || "—"}</TableCell>
                <TableCell className="text-muted-foreground">{cat.subgrupo || "—"}</TableCell>
                <TableCell>
                  <Switch
                    checked={cat.ativo !== false}
                    onCheckedChange={(checked) => toggleMutation.mutate({ id: cat.id, ativo: checked })}
                  />
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => { setEditing(cat); setModalOpen(true); }}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {categorias.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  Nenhuma categoria cadastrada
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      <CategoriaModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        categoria={editing}
      />
    </div>
  );
};

export default CategoriasDre;
