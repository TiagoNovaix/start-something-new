import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";

const Dashboard = () => {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ["dashboard-metrics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vw_dashboard_resumo")
        .select("*")
        .order("ano", { ascending: false })
        .order("mes", { ascending: false })
        .limit(1)
        .maybeSingle();

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
        <p className="text-secondary animate-pulse">Carregando métricas...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card shadow-subtle">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-secondary">Receita Total</CardTitle>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-serif">{formatCurrency(metrics?.receita_total || 0)}</div>
            <p className="text-xs text-muted-foreground mt-1">Este mês</p>
          </CardContent>
        </Card>

        <Card className="bg-card shadow-subtle">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-secondary">Despesas</CardTitle>
            <TrendingDown className="w-4 h-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-serif text-negative">{formatCurrency(metrics?.despesa_total || 0)}</div>
            <p className="text-xs text-muted-foreground mt-1">Este mês</p>
          </CardContent>
        </Card>

        <Card className="bg-card shadow-subtle">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-secondary">Lucro Líquido</CardTitle>
            <DollarSign className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold font-serif ${(metrics?.lucro_liquido_realizado || 0) >= 0 ? "text-positive" : "text-negative"}`}>
              {formatCurrency(metrics?.lucro_liquido_realizado || 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Realizado este mês</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="h-[400px] flex items-center justify-center bg-card shadow-subtle">
          <CardContent className="text-center">
            <p className="text-sm font-medium text-secondary mb-2">Fluxo de Caixa</p>
            <p className="text-xs text-muted-foreground">Gráfico em desenvolvimento</p>
          </CardContent>
        </Card>

        <Card className="h-[400px] flex items-center justify-center bg-card shadow-subtle">
          <CardContent className="text-center">
            <p className="text-sm font-medium text-secondary mb-2">Despesas por Categoria</p>
            <p className="text-xs text-muted-foreground">Gráfico em desenvolvimento</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;