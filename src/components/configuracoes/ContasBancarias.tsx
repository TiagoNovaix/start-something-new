import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Ban, CheckCircle } from "lucide-react";
import { toastSuccess, toastError } from "@/hooks/useToast";
import ContaModal from "./ContaModal";

export type Conta = {
  id: string;
  nome: string;
  tipo: string | null;
  saldo_inicial: number | null;
  ativo: boolean | null;
  cor: string | null;
};

const TIPO_LABELS: Record<string, string> = {
  corrente: "Conta Corrente",
  poupanca: "Poupança",
  caixa: "Caixa",
  carteira: "Carteira",
};

const ContasBancarias = () => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);

  const { data: contas = [], isLoading } = useQuery({
    queryKey: ["contas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contas")
        .select("id, nome, tipo, saldo_inicial, ativo, cor")
        .order("nome");
      if (error) throw error;
      return data as Conta[];
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, ativo }: { id: string; ativo: boolean }) => {
      const { error } = await supabase.from("contas").update({ ativo }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contas"] });
      toastSuccess("Conta atualizada");
    },
    onError: () => toastError("Erro ao atualizar conta"),
  });

  const formatCurrency = (value: number | null) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value ?? 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Contas Bancárias</h2>
        <Button size="sm" onClick={() => setModalOpen(true)}>
          <Plus className="mr-1 h-4 w-4" /> Nova Conta
        </Button>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground text-sm">Carregando…</p>
      ) : contas.length === 0 ? (
        <div className="bg-card rounded-lg border p-8 text-center text-muted-foreground">
          Nenhuma conta cadastrada
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {contas.map((conta) => {
            const isActive = conta.ativo !== false;
            return (
              <Card key={conta.id} className={!isActive ? "opacity-50" : ""}>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-base font-medium">{conta.nome}</CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {TIPO_LABELS[conta.tipo || "corrente"] || conta.tipo}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Saldo inicial</p>
                    <p className="text-lg font-semibold">{formatCurrency(conta.saldo_inicial)}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => toggleMutation.mutate({ id: conta.id, ativo: !isActive })}
                  >
                    {isActive ? (
                      <><Ban className="mr-1 h-3 w-3" /> Inativar</>
                    ) : (
                      <><CheckCircle className="mr-1 h-3 w-3" /> Reativar</>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <ContaModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
};

export default ContasBancarias;
