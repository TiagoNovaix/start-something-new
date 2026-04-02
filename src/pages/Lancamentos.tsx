import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { Plus, Receipt } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import EmptyState from "@/components/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";

const Lancamentos = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const { data: lancamentos = [], isLoading } = useQuery({
    queryKey: ["lancamentos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lancamentos")
        .select(`*, categorias (nome), contas (nome), centros_custo (nome)`)
        .order("data", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data;
    },
  });

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

  if (isLoading) {
    return (
      <div className="bg-card rounded-lg border shadow-subtle p-6 space-y-4">
        <Skeleton className="h-6 w-48" />
        {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
      </div>
    );
  }

  const statusBadge = (status: string | null) => {
    const cls = status === "pago" ? "bg-positive/10 text-positive" : status === "atrasado" ? "bg-negative/10 text-negative" : "bg-warning/10 text-warning";
    const label = status === "pago" ? "Pago" : status === "atrasado" ? "Atrasado" : "Pendente";
    return <Badge variant="secondary" className={`${cls} border-none`}>{label}</Badge>;
  };

  return (
    <div className="bg-card rounded-lg border shadow-subtle p-4 md:p-6 min-h-[400px]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg md:text-xl font-medium">Lançamentos Recentes</h2>
        <Button size="sm" onClick={() => navigate("/lancamentos/novo")}>
          <Plus className="mr-1 h-4 w-4" /> Novo
        </Button>
      </div>

      {lancamentos.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="Nenhum lançamento encontrado"
          description="Comece registrando sua primeira receita ou despesa."
          actionLabel="Novo Lançamento"
          onAction={() => navigate("/lancamentos/novo")}
        />
      ) : isMobile ? (
        <div className="space-y-3">
          {lancamentos.map((item) => (
            <Card key={item.id} className="bg-background border">
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{item.descricao}</span>
                  {statusBadge(item.status)}
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{format(new Date(item.data), "dd/MM/yyyy", { locale: ptBR })}</span>
                  {/* @ts-ignore */}
                  <span>{item.categorias?.nome || "—"}</span>
                </div>
                <div className={`text-sm font-semibold ${item.tipo_movimentacao === "Despesa" ? "text-negative" : "text-positive"}`}>
                  {item.tipo_movimentacao === "Despesa" ? "-" : "+"} {formatCurrency(item.valor)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Conta</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lancamentos.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="text-sm">{format(new Date(item.data), "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                <TableCell className="font-medium text-sm">{item.descricao}</TableCell>
                {/* @ts-ignore */}
                <TableCell className="text-sm text-secondary">{item.categorias?.nome || "—"}</TableCell>
                {/* @ts-ignore */}
                <TableCell className="text-sm text-secondary">{item.contas?.nome || "—"}</TableCell>
                <TableCell className={`text-sm font-medium ${item.tipo_movimentacao === "Despesa" ? "text-negative" : "text-positive"}`}>
                  {item.tipo_movimentacao === "Despesa" ? "-" : "+"} {formatCurrency(item.valor)}
                </TableCell>
                <TableCell>{statusBadge(item.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default Lancamentos;
