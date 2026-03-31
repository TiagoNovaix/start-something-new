import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const Lancamentos = () => {
  const { data: lancamentos = [], isLoading } = useQuery({
    queryKey: ["lancamentos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lancamentos")
        .select(`
          *,
          categorias (nome),
          contas (nome),
          centros_custo (nome)
        `)
        .order("data", { ascending: false })
        .limit(20);

      if (error) throw error;
      return data;
    },
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-secondary animate-pulse">Carregando lançamentos...</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border shadow-subtle p-6 min-h-[400px]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-medium">Lançamentos Recentes</h2>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Centro de Custo</TableHead>
            <TableHead>Conta</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lancamentos.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="text-sm">
                {format(new Date(item.data), "dd/MM/yyyy", { locale: ptBR })}
              </TableCell>
              <TableCell className="font-medium text-sm">{item.descricao}</TableCell>
              <TableCell className="text-sm text-secondary">
                {/* @ts-ignore */}
                {item.categorias?.nome || "—"}
              </TableCell>
              <TableCell className="text-sm text-secondary">
                {/* @ts-ignore */}
                {item.contas?.nome || "—"}
              </TableCell>
              <TableCell className={`text-sm font-medium ${item.tipo_movimentacao === "Despesa" ? "text-negative" : "text-positive"}`}>
                {item.tipo_movimentacao === "Despesa" ? "-" : "+"} {formatCurrency(item.valor)}
              </TableCell>
              <TableCell>
                <Badge 
                  variant="secondary"
                  className={
                    item.status === "pago" 
                      ? "bg-emerald-500/10 text-emerald-600 border-none" 
                      : "bg-amber-500/10 text-amber-600 border-none"
                  }
                >
                  {item.status === "pago" ? "Pago" : "Pendente"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
          {lancamentos.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-secondary py-12">
                Nenhum lançamento encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default Lancamentos;