import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { Plus, Receipt, Pencil, Trash2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import EmptyState from "@/components/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const fmt = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

const StatusPill = ({ status }: { status: string | null }) => {
  const map: Record<string, { label: string; cls: string }> = {
    pago: { label: "Pago", cls: "bg-positive/10 text-positive" },
    atrasado: { label: "Atrasado", cls: "bg-negative/10 text-negative" },
    pendente: { label: "Pendente", cls: "bg-warning/10 text-warning" },
  };
  const s = map[status || "pendente"] || map.pendente;
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium", s.cls)}>
      {s.label}
    </span>
  );
};

const Lancamentos = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const { data: lancamentos = [], isLoading } = useQuery({
    queryKey: ["lancamentos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lancamentos")
        .select(`*, categorias (nome), contas (nome), centros_custo (nome)`)
        .is("deleted_at", null)
        .order("data", { ascending: false })
        .limit(50);
      if (error) { console.error("Erro ao buscar lançamentos:", error); throw error; }
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-9 w-24" />
        </div>
        <div className="bg-card rounded-lg border border-border">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-12 border-b border-border px-5 flex items-center gap-6">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Lançamentos</h2>
        <Button size="sm" onClick={() => navigate("/lancamentos/novo")} className="bg-identity-gradient text-white hover:opacity-90">
          <Plus className="mr-1.5 h-4 w-4" /> Novo
        </Button>
      </div>

      {lancamentos.length === 0 ? (
        <Card className="border-none shadow-subtle">
          <CardContent className="p-0">
            <EmptyState
              icon={Receipt}
              title="Sem movimentações ainda"
              description="Comece registrando sua primeira entrada ou despesa"
              actionLabel="Adicionar lançamento"
              onAction={() => navigate("/lancamentos/novo")}
            />
          </CardContent>
        </Card>
      ) : isMobile ? (
        <div className="space-y-2">
          {lancamentos.map((item) => (
            <Card key={item.id} className="border border-border shadow-none">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{item.descricao}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {format(new Date(item.data), "dd MMM yyyy", { locale: ptBR })}
                      {/* @ts-ignore */}
                      {item.categorias?.nome && ` · ${item.categorias.nome}`}
                    </p>
                  </div>
                  <StatusPill status={item.status} />
                </div>
                <p className={cn(
                  "text-base font-mono font-semibold",
                  item.tipo_movimentacao === "Despesa" ? "text-negative" : "text-positive"
                )}>
                  {item.tipo_movimentacao === "Despesa" ? "−" : "+"} {fmt(item.valor)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Data</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Conta</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lancamentos.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="text-muted-foreground font-mono text-xs">
                    {format(new Date(item.data), "dd/MM/yy")}
                  </TableCell>
                  <TableCell className="font-medium">{item.descricao}</TableCell>
                  {/* @ts-ignore */}
                  <TableCell className="text-muted-foreground">{item.categorias?.nome || "—"}</TableCell>
                  {/* @ts-ignore */}
                  <TableCell className="text-muted-foreground">{item.contas?.nome || "—"}</TableCell>
                  <TableCell className={cn(
                    "text-right font-mono font-medium tabular-nums",
                    item.tipo_movimentacao === "Despesa" ? "text-negative" : "text-positive"
                  )}>
                    {item.tipo_movimentacao === "Despesa" ? "−" : "+"} {fmt(item.valor)}
                  </TableCell>
                  <TableCell><StatusPill status={item.status} /></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default Lancamentos;
