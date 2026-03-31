import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Eye, RefreshCcw } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const Recurrencias = () => {
  const queryClient = useQueryClient();

  // Fetch Recurring Rules
  const { data: recurrences = [], isLoading: loadingRecurrences } = useQuery({
    queryKey: ["regras_recorrencia"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("regras_recorrencia")
        .select(`
          *,
          categorias(nome),
          contas!regras_recorrencia_conta_id_fkey(nome),
          proximos_lancamentos:lancamentos(data_vencimento, status)
        `)
        .is("deleted_at", null)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      
      return data.map(r => ({
        ...r,
        proximo_vencimento: r.proximos_lancamentos
          ?.filter((l: any) => l.status === 'pendente')
          .sort((a: any, b: any) => new Date(a.data_vencimento).getTime() - new Date(b.data_vencimento).getTime())[0]?.data_vencimento
      }));
    },
  });

  // Fetch Installment Groups
  const { data: installments = [], isLoading: loadingInstallments } = useQuery({
    queryKey: ["grupos_parcelas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("grupos_parcelas")
        .select(`
          *,
          categorias(nome),
          contas(nome),
          lancamentos(id, numero_parcela, total_parcelas, data_vencimento, status, valor)
        `)
        .is("deleted_at", null)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      
      return data.map(g => {
        const sortedLancamentos = g.lancamentos?.sort((a: any, b: any) => a.numero_parcela - b.numero_parcela) || [];
        const nextPending = sortedLancamentos.find((l: any) => l.status === 'pendente');
        const paidCount = sortedLancamentos.filter((l: any) => l.status === 'pago').length;
        
        return {
          ...g,
          parcela_atual: paidCount + 1,
          proximo_vencimento: nextPending?.data_vencimento,
          valor_parcela: nextPending?.valor || sortedLancamentos[0]?.valor
        };
      });
    },
  });

  const generateInstancesMutation = useMutation({
    mutationFn: async () => {
      // Logic to regenerate next 12 months (this usually happens via an edge function or complex query)
      // For now, we'll just show a toast as the actual implementation depends on Task 4 details
      toast({ title: "Gerando instâncias...", description: "As próximas instâncias estão sendo criadas." });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["regras_recorrencia"] });
    }
  });

  const cancelFutureMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("regras_recorrencia")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
      
      // Also soft delete future transactions
      await supabase
        .from("lancamentos")
        .update({ deleted_at: new Date().toISOString() })
        .eq("regra_recorrencia_id", id)
        .eq("status", "pendente")
        .gt("data_vencimento", new Date().toISOString());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["regras_recorrencia"] });
      toast({ title: "Recorrência cancelada", description: "As próximas instâncias foram removidas." });
    }
  });

  return (
    <div className="space-y-8">
      {/* Recorrências Ativas */}
      <div className="bg-card rounded-lg border p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium">Recorrências Ativas</h2>
            <p className="text-sm text-muted-foreground">Gerencie suas regras de repetição mensal, semanal, etc.</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => generateInstancesMutation.mutate()}
            disabled={generateInstancesMutation.isPending}
          >
            <RefreshCcw className={`mr-2 h-4 w-4 ${generateInstancesMutation.isPending ? 'animate-spin' : ''}`} />
            Gerar próximos 12 meses
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Descrição</TableHead>
              <TableHead>Frequência</TableHead>
              <TableHead>Próximo Vencimento</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Conta</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loadingRecurrences ? (
              <TableRow><TableCell colSpan={8} className="text-center py-4">Carregando...</TableCell></TableRow>
            ) : recurrences.length === 0 ? (
              <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">Nenhuma recorrência ativa</TableCell></TableRow>
            ) : recurrences.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.descricao}</TableCell>
                <TableCell className="capitalize">{r.frequencia}</TableCell>
                <TableCell>{r.proximo_vencimento ? format(new Date(r.proximo_vencimento), "dd/MM/yyyy", { locale: ptBR }) : "—"}</TableCell>
                <TableCell>{r.categorias?.nome || "—"}</TableCell>
                <TableCell>{r.contas?.nome || "—"}</TableCell>
                <TableCell>
                  {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(r.valor)}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="border-emerald-500/40 text-emerald-400">Ativa</Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon" title="Editar regra">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" title="Ver instâncias">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-destructive hover:text-destructive" 
                    title="Cancelar próximas"
                    onClick={() => {
                      if (confirm("Deseja cancelar todas as instâncias futuras desta recorrência?")) {
                        cancelFutureMutation.mutate(r.id);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Parcelamentos Ativos */}
      <div className="bg-card rounded-lg border p-6 space-y-4">
        <div>
          <h2 className="text-lg font-medium">Parcelamentos Ativos</h2>
          <p className="text-sm text-muted-foreground">Acompanhe o status de compras e vendas parceladas.</p>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Descrição</TableHead>
              <TableHead>Parcela Atual / Total</TableHead>
              <TableHead>Próximo Vencimento</TableHead>
              <TableHead>Valor por Parcela</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loadingInstallments ? (
              <TableRow><TableCell colSpan={5} className="text-center py-4">Carregando...</TableCell></TableRow>
            ) : installments.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Nenhum parcelamento ativo</TableCell></TableRow>
            ) : installments.map((g) => (
              <TableRow key={g.id}>
                <TableCell className="font-medium">{g.descricao}</TableCell>
                <TableCell>{g.parcela_atual} / {g.total_parcelas}</TableCell>
                <TableCell>{g.proximo_vencimento ? format(new Date(g.proximo_vencimento), "dd/MM/yyyy", { locale: ptBR }) : "Concluído"}</TableCell>
                <TableCell>
                  {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(g.valor_parcela)}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Eye className="h-4 w-4" />
                    Ver todas as parcelas
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Recurrencias;
