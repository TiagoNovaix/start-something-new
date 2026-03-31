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
        .order("ordem", { ascending: true });

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-secondary animate-pulse font-medium">Gerando relatório DRE...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card shadow-subtle border-none">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs font-medium text-secondary uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" /> Faturamento
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xl font-bold font-serif">
              {formatCurrency(dreData.find(d => d.descricao === "RECEITA BRUTA")?.valor || 0)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card shadow-subtle border-none">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs font-medium text-secondary uppercase tracking-wider flex items-center gap-2">
              <PieChart className="w-4 h-4 text-amber-500" /> Custos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xl font-bold font-serif text-negative">
              {formatCurrency(dreData.find(d => d.descricao === "CUSTO DAS MERCADORIAS/SERVIÇOS VENDIDOS")?.valor || 0)}
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
            <div className="text-xl font-bold font-serif text-negative">
              {formatCurrency(dreData.find(d => d.descricao === "DESPESAS OPERACIONAIS")?.valor || 0)}
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
            <div className="text-xl font-bold font-serif text-positive">
              {formatCurrency(dreData.find(d => d.descricao === "LUCRO/PREJUÍZO LÍQUIDO DO EXERCÍCIO")?.valor || 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-card rounded-lg border shadow-subtle p-6">
        <h2 className="text-xl font-medium mb-6">Relatório de Resultados (DRE)</h2>
        
        <div className="rounded-md border bg-white/5 overflow-hidden">
          <Table>
            <TableHeader className="bg-card">
              <TableRow>
                <TableHead className="w-1/2">Descrição</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dreData.map((item, index) => {
                const isHeading = item.descricao.toUpperCase() === item.descricao;
                const isPositive = item.valor > 0;
                
                return (
                  <TableRow 
                    key={index} 
                    className={isHeading ? "bg-muted/30 font-bold" : "hover:bg-muted/10"}
                  >
                    <TableCell className={isHeading ? "text-foreground" : "text-secondary pl-8"}>
                      {item.descricao}
                    </TableCell>
                    <TableCell className={`text-right font-serif ${isHeading ? "text-foreground" : isPositive ? "text-positive" : "text-negative"}`}>
                      {formatCurrency(item.valor)}
                    </TableCell>
                  </TableRow>
                );
              })}
              {dreData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-secondary py-12">
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