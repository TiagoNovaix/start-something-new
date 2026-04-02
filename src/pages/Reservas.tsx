import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PiggyBank, Target } from "lucide-react";
import EmptyState from "@/components/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";

const Reservas = () => {
  const { data: reservas = [], isLoading } = useQuery({
    queryKey: ["reservas"],
    queryFn: async () => {
      const { data, error } = await supabase.from("reservas").select("*").order("nome");
      if (error) throw error;
      return data;
    },
  });

  const formatCurrency = (value: number | null) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value || 0);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="bg-card shadow-subtle border">
            <CardHeader className="pb-2"><Skeleton className="h-5 w-32" /></CardHeader>
            <CardContent className="space-y-4"><Skeleton className="h-8 w-24" /><Skeleton className="h-2 w-full" /></CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {reservas.map((reserva) => {
          const percentage = reserva.meta ? Math.min(100, (reserva.saldo_atual / reserva.meta) * 100) : 0;
          return (
            <Card key={reserva.id} className="bg-card shadow-subtle border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${reserva.cor || "#a400b6"}20`, color: reserva.cor || "#a400b6" }}>
                    <PiggyBank className="w-5 h-5" />
                  </div>
                  <CardTitle className="text-base font-semibold">{reserva.nome}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 mt-2">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs text-secondary font-medium uppercase tracking-wider">Saldo Atual</p>
                    <p className="text-xl font-bold font-serif">{formatCurrency(reserva.saldo_atual)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-secondary font-medium uppercase tracking-wider">Meta</p>
                    <p className="text-sm font-medium">{formatCurrency(reserva.meta)}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-secondary">Progresso</span>
                    <span className="text-primary">{percentage.toFixed(1)}%</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      {reservas.length === 0 && (
        <EmptyState icon={Target} title="Nenhuma reserva configurada" description="Crie reservas para monitorar seus objetivos financeiros." />
      )}
    </div>
  );
};

export default Reservas;
