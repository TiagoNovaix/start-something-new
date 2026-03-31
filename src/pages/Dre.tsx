import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, TrendingDown, DollarSign, PieChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, TrendingDown, DollarSign, PieChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Dre = () => {
  const { data: dreData = [], isLoading } = useQuery({
    queryKey: ["dre-data"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vw_dre")
        .select("*")
        .order("classificacao_dre", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const formatCurrency = (value: number | null) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value || 0);
  };

  // Grouping by classification for the main metrics
  const groupedData = dreData.reduce((acc: any, item: any) => {
    const key = item.classificacao_dre || "Outros";
    if (!acc[key]) acc[key] = 0;
    acc[key] += item.valor_total;
    return acc;
  }, {});

  const totalReceita = dreData
    .filter((d: any) => d.tipo_movimentacao === "Receita")
    .reduce((acc: number, curr: any) => acc + curr.valor_total, 0);

  const totalDespesa = dreData
    .filter((d: any) => d.tipo_movimentacao === "Despesa")
    .reduce((acc: number, curr: any) => acc + curr.valor_total, 0);

  const lucroLiquido = totalReceita - totalDespesa;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-secondary animate-pulse font-medium">Gerando relatório DRE...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card shadow-subtle border-none">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs font-medium text-secondary uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" /> Faturamento
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold font-serif">
              {formatCurrency(totalReceita)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card shadow-subtle border-none">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs font-medium text-secondary uppercase tracking-wider flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-rose-500" /> Despesas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold font-serif text-negative">
              {formatCurrency(totalDespesa)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card shadow-subtle border-none">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs font-medium text-secondary uppercase tracking-wider flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-primary" /> Lucro Líquido
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className={`text-2xl font-bold font-serif ${lucroLiquido >= 0 ? "text-positive" : "text-negative"}`}>
              {formatCurrency(lucroLiquido)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-card rounded-lg border shadow-subtle p-6">
        <h2 className="text-xl font-medium mb-6">Demonstrativo de Resultados</h2>
        
        <div className="rounded-md border bg-white/5 overflow-hidden">
          <Table>
            <TableHeader className="bg-card">
              <TableRow>
                <TableHead>Grupo</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dreData.map((item: any, index: number) => (
                <TableRow key={index} className="hover:bg-muted/10">
                  <TableCell className="font-medium text-sm text-foreground">
                    {item.classificacao_dre || "Outros"}
                  </TableCell>
                  <TableCell className="text-sm text-secondary">
                    {item.categoria_nome}
                  </TableCell>
                  <TableCell className={`text-right font-serif text-sm ${item.tipo_movimentacao === "Despesa" ? "text-negative" : "text-positive"}`}>
                    {formatCurrency(item.valor_total)}
                  </TableCell>
                </TableRow>
              ))}
              {dreData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-secondary py-12">
                    Dados insuficientes para gerar o DRE.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Dre;