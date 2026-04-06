import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, subMonths, startOfMonth, endOfMonth, getMonth, getYear } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Download, 
  Filter,
  ChevronUp,
  ChevronDown,
  Info,
  Lock,
  Unlock,
  CheckCircle2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { toastSuccess, toastError } from "@/hooks/useToast";

interface DREItem {
  label: string;
  value: number;
  prevValue?: number;
  pendente?: number;
  isSubtotal?: boolean;
  level?: number;
  type?: 'positive' | 'negative' | 'neutral';
}

const Dre = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [compareWithPrevious, setCompareWithPrevious] = useState(false);
  const [showPrevisto, setShowPrevisto] = useState(false);

  const currentMonth = getMonth(selectedDate) + 1;
  const currentYear = getYear(selectedDate);
  const prevDate = subMonths(selectedDate, 1);
  const prevMonth = getMonth(prevDate) + 1;
  const prevYear = getYear(prevDate);

  const queryClient = useQueryClient();

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ["dre-transactions", currentMonth, currentYear, compareWithPrevious, showPrevisto],
    queryFn: async () => {
      let query = supabase
        .from("lancamentos")
        .select(`
          *,
          categoria:categorias(nome, classificacao_dre, subgrupo)
        `)
        .is("deleted_at", null);

      const startDate = compareWithPrevious ? startOfMonth(prevDate) : startOfMonth(selectedDate);
      const endDate = endOfMonth(selectedDate);

      query = query.gte("data", format(startDate, "yyyy-MM-dd"));
      query = query.lte("data", format(endDate, "yyyy-MM-dd"));

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const { data: closingStatus, isLoading: isClosingLoading } = useQuery({
    queryKey: ["monthly-closing", currentMonth, currentYear],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("monthly_closings")
        .select("*")
        .eq("mes", currentMonth)
        .eq("ano", currentYear)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    }
  });

  const closeMonthMutation = useMutation({
    mutationFn: async ({ snapshot, justification }: { snapshot: any, justification: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("monthly_closings")
        .upsert({
          mes: currentMonth,
          ano: currentYear,
          status: 'fechado',
          snapshot_dre: snapshot as any,
          closed_at: new Date().toISOString(),
          closed_by: user.id,
          user_id: user.id,
          justification
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["monthly-closing"] });
      toastSuccess("Mês fechado", "Período travado com sucesso.");
    },
    onError: (error) => {
      console.error("Erro ao fechar mês:", error);
      toast.error("Erro ao fechar mês.");
    }
  });

  const handleCloseMonth = () => {
    const justification = prompt(`Deseja fechar o mês de ${format(selectedDate, "MMMM", { locale: ptBR })}? Isso salvará um snapshot dos dados atuais. Adicione uma justificativa (opcional):`);
    if (justification !== null) {
      closeMonthMutation.mutate({ snapshot: dreData, justification });
    }
  };

  const { data: isAdmin } = useQuery({
    queryKey: ["user-is-admin"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;
      const { data } = await supabase
        .from("users_companies")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      return !!data;
    }
  });

  const dreData = useMemo(() => {
    const filterByMonth = (items: any[], month: number, year: number, status?: string) => {
      return items.filter(item => {
        const itemDate = new Date(item.data);
        const matchesDate = (getMonth(itemDate) + 1) === month && getYear(itemDate) === year;
        if (!status) return matchesDate;
        return matchesDate && item.status === status;
      });
    };

    const calculateSum = (items: any[], filterFn: (item: any) => boolean) => {
      return items.filter(filterFn).reduce((acc, curr) => acc + (Number(curr.valor) || 0), 0);
    };

    const currentItems = filterByMonth(transactions, currentMonth, currentYear);
    const prevItems = compareWithPrevious ? filterByMonth(transactions, prevMonth, prevYear) : [];

    const getLineData = (
      label: string, 
      filterFn: (item: any) => boolean, 
      level = 0, 
      isSubtotal = false,
      type: 'positive' | 'negative' | 'neutral' = 'neutral'
    ): DREItem => {
      const value = calculateSum(currentItems, item => filterFn(item) && item.status === 'pago');
      const pendente = calculateSum(currentItems, item => filterFn(item) && item.status === 'pendente');
      const prevValue = compareWithPrevious 
        ? calculateSum(prevItems, item => filterFn(item) && item.status === 'pago')
        : undefined;

      return { label, value, prevValue, pendente, isSubtotal, level, type };
    };

    // Mapping logic
    const isReceitaBruta = (item: any) => item.categoria?.classificacao_dre === 'Receita';
    const isReceitaServicos = (item: any) => isReceitaBruta(item) && item.categoria?.subgrupo === 'Serviços';
    const isReceitaRecorrente = (item: any) => isReceitaBruta(item) && item.categoria?.subgrupo === 'Recorrente';
    
    const isDeducoes = (item: any) => item.categoria?.classificacao_dre === 'Dedução';
    const isCustosDiretos = (item: any) => item.categoria?.classificacao_dre === 'Custo Direto';
    
    const isDespesasOp = (item: any) => item.categoria?.classificacao_dre === 'Despesa Operacional';
    const isComercial = (item: any) => isDespesasOp(item) && item.categoria?.subgrupo === 'Comercial/Marketing';
    const isTecnologia = (item: any) => isDespesasOp(item) && item.categoria?.subgrupo === 'Tecnologia';
    const isAdministrativo = (item: any) => isDespesasOp(item) && item.categoria?.subgrupo === 'Administrativo';
    const isPessoal = (item: any) => isDespesasOp(item) && item.categoria?.subgrupo === 'Pessoal';

    const isImpostos = (item: any) => item.categoria?.classificacao_dre === 'Imposto';
    const isFinanceiro = (item: any) => item.categoria?.classificacao_dre === 'Financeiro';
    
    const isProLabore = (item: any) => item.subtipo === 'pro_labore';
    const isDistribuicao = (item: any) => item.subtipo === 'distribuicao_lucro';

    // Lines
    const rb = getLineData("Receita Bruta", isReceitaBruta, 0, true, 'positive');
    const rs = getLineData("→ Receita de Serviços", isReceitaServicos, 1);
    const rr = getLineData("→ Receita Recorrente", isReceitaRecorrente, 1);
    
    const ded = getLineData("(-) Deduções", isDeducoes, 0, false, 'negative');
    
    const rlValue = rb.value - ded.value;
    const rlPrevValue = rb.prevValue !== undefined ? rb.prevValue - (ded.prevValue || 0) : undefined;
    const rlPendente = rb.pendente! - ded.pendente!;
    const rl = { label: "(=) Receita Líquida", value: rlValue, prevValue: rlPrevValue, pendente: rlPendente, isSubtotal: true, level: 0, type: 'positive' as const };

    const cd = getLineData("(-) Custos Diretos", isCustosDiretos, 0, false, 'negative');
    
    const lbValue = rl.value - cd.value;
    const lbPrevValue = rl.prevValue !== undefined ? rl.prevValue - (cd.prevValue || 0) : undefined;
    const lbPendente = rl.pendente! - cd.pendente!;
    const lb = { label: "(=) Lucro Bruto", value: lbValue, prevValue: lbPrevValue, pendente: lbPendente, isSubtotal: true, level: 0, type: 'positive' as const };

    const do_ = getLineData("(-) Despesas Operacionais", isDespesasOp, 0, false, 'negative');
    const d_com = getLineData("→ Comercial/Marketing", isComercial, 1);
    const d_tec = getLineData("→ Tecnologia", isTecnologia, 1);
    const d_adm = getLineData("→ Administrativo", isAdministrativo, 1);
    const d_pes = getLineData("→ Pessoal", isPessoal, 1);

    const ebitdaValue = lb.value - do_.value;
    const ebitdaPrevValue = lb.prevValue !== undefined ? lb.prevValue - (do_.prevValue || 0) : undefined;
    const ebitdaPendente = lb.pendente! - do_.pendente!;
    const ebitda = { label: "(=) EBITDA", value: ebitdaValue, prevValue: ebitdaPrevValue, pendente: ebitdaPendente, isSubtotal: true, level: 0, type: 'positive' as const };

    const imp = getLineData("(-) Impostos", isImpostos, 0, false, 'negative');
    const fin = getLineData("(-) Financeiro", isFinanceiro, 0, false, 'negative');

    const llValue = ebitda.value - imp.value - fin.value;
    const llPrevValue = ebitda.prevValue !== undefined ? ebitda.prevValue - (imp.prevValue || 0) - (fin.prevValue || 0) : undefined;
    const llPendente = ebitda.pendente! - imp.pendente! - fin.pendente!;
    const ll = { label: "(=) Lucro Líquido", value: llValue, prevValue: llPrevValue, pendente: llPendente, isSubtotal: true, level: 0, type: 'positive' as const };

    const pl = getLineData("(-) Pró-labore", isProLabore, 0, false, 'negative');
    const dist = getLineData("(-) Distribuição", isDistribuicao, 0, false, 'negative');

    const rfValue = ll.value - pl.value - dist.value;
    const rfPrevValue = ll.prevValue !== undefined ? ll.prevValue - (pl.prevValue || 0) - (dist.prevValue || 0) : undefined;
    const rfPendente = ll.pendente! - pl.pendente! - dist.pendente!;
    const rf = { label: "(=) Resultado Final", value: rfValue, prevValue: rfPrevValue, pendente: rfPendente, isSubtotal: true, level: 0, type: 'positive' as const };

    return [
      rb, rs, rr,
      ded,
      rl,
      cd,
      lb,
      do_, d_com, d_tec, d_adm, d_pes,
      ebitda,
      imp,
      fin,
      ll,
      pl,
      dist,
      rf
    ];
  }, [transactions, currentMonth, currentYear, prevMonth, prevYear, compareWithPrevious]);

  const formatCurrency = (value: number | undefined) => {
    if (value === undefined) return "-";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const calculateVar = (current: number, prev: number | undefined) => {
    if (prev === undefined || prev === 0) return null;
    return ((current - prev) / Math.abs(prev)) * 100;
  };

  const handleExport = () => {
    try {
      const headers = ["Linha", "Valor (Pago)"];
      if (showPrevisto) headers.push("Pendente");
      if (compareWithPrevious) headers.push("Mês Anterior", "Var %");

      const rows = dreData.map(item => {
        const row = [item.label, item.value];
        if (showPrevisto) row.push(item.pendente || 0);
        if (compareWithPrevious) {
          const v = calculateVar(item.value, item.prevValue);
          row.push(item.prevValue || 0);
          row.push(v !== null ? `${v.toFixed(2)}%` : "-");
        }
        return row.join(";");
      });

      const csvContent = "\uFEFF" + [headers.join(";"), ...rows].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `DRE_${format(selectedDate, "yyyy-MM")}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("DRE exportada com sucesso!");
    } catch (error) {
      console.error("Erro ao exportar DRE:", error);
      toast.error("Erro ao exportar DRE.");
    }
  };

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i.toString(),
    label: format(new Date(2024, i, 1), "MMMM", { locale: ptBR }),
  }));

  const years = Array.from({ length: 3 }, (_, i) => {
    const year = new Date().getFullYear() - 1 + i;
    return { value: year.toString(), label: year.toString() };
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gradient">DRE Gerencial</h1>
          <p className="text-secondary mt-1">Demonstrativo do Resultado do Exercício</p>
        </div>
        <div className="flex items-center gap-2">
          {isAdmin && (
            closingStatus?.status === 'fechado' ? (
              <Badge variant="outline" className="bg-positive/10 text-positive border-positive/20 px-3 py-1 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Mês Fechado
              </Badge>
            ) : closingStatus?.status === 'em_conferencia' ? (
              <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20 px-3 py-1 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Em Conferência
              </Badge>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                onClick={handleCloseMonth}
                disabled={closeMonthMutation.isPending || isLoading}
              >
                {closeMonthMutation.isPending ? (
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <Lock className="w-4 h-4 mr-2" />
                )}
                Fechar Mês
              </Button>
            )
          )}
          
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-card border-white/5 hover:bg-white/10"
            onClick={handleExport}
          >
            <Download className="w-4 h-4 mr-2" /> Exportar
          </Button>
        </div>
      </div>

      <Card className="bg-card shadow-subtle border-white/5">
        <CardHeader className="p-4 border-b border-white/5 flex flex-row items-center justify-between space-y-0">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <Label className="text-xs text-secondary uppercase tracking-wider">Referência</Label>
              <div className="flex items-center gap-1">
                <Select 
                  value={getMonth(selectedDate).toString()} 
                  onValueChange={(val) => {
                    const newDate = new Date(selectedDate);
                    newDate.setMonth(parseInt(val));
                    setSelectedDate(newDate);
                  }}
                >
                  <SelectTrigger className="w-[130px] h-9 bg-muted border-none">
                    <SelectValue placeholder="Mês" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map(m => (
                      <SelectItem key={m.value} value={m.value} className="capitalize">{m.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select 
                  value={getYear(selectedDate).toString()} 
                  onValueChange={(val) => {
                    const newDate = new Date(selectedDate);
                    newDate.setFullYear(parseInt(val));
                    setSelectedDate(newDate);
                  }}
                >
                  <SelectTrigger className="w-[100px] h-9 bg-muted border-none">
                    <SelectValue placeholder="Ano" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map(y => (
                      <SelectItem key={y.value} value={y.value}>{y.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="compare" 
                  checked={compareWithPrevious} 
                  onCheckedChange={setCompareWithPrevious} 
                />
                <Label htmlFor="compare" className="text-sm font-medium cursor-pointer">Comparar mês anterior</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="previsto" 
                  checked={showPrevisto} 
                  onCheckedChange={setShowPrevisto} 
                />
                <Label htmlFor="previsto" className="text-sm font-medium cursor-pointer">Previsto vs Realizado</Label>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-4">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-secondary animate-pulse">Calculando demonstrativo...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow className="hover:bg-transparent border-white/5">
                    <TableHead className="w-[300px] py-4">Linha</TableHead>
                    <TableHead className="text-right py-4">Realizado (Pago)</TableHead>
                    {showPrevisto && <TableHead className="text-right py-4">Pendente</TableHead>}
                    {compareWithPrevious && (
                      <>
                        <TableHead className="text-right py-4">Anterior ({format(prevDate, "MMM/yy", { locale: ptBR })})</TableHead>
                        <TableHead className="text-right py-4">Var %</TableHead>
                      </>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dreData.map((item, index) => {
                    const variance = calculateVar(item.value, item.prevValue);
                    
                    return (
                      <TableRow 
                        key={index} 
                        className={cn(
                          "hover:bg-white/[0.02] border-white/5 transition-colors",
                          item.isSubtotal && "bg-white/[0.04] font-bold"
                        )}
                      >
                        <TableCell 
                          className={cn(
                            "py-3",
                            item.level === 1 && "pl-8 text-secondary text-sm"
                          )}
                        >
                          {item.label}
                        </TableCell>
                        <TableCell 
                          className={cn(
                            "text-right font-mono",
                            item.type === 'positive' && item.value > 0 && "text-positive",
                            item.type === 'negative' && item.value > 0 && "text-negative"
                          )}
                        >
                          {formatCurrency(item.value)}
                        </TableCell>
                        {showPrevisto && (
                          <TableCell className="text-right font-mono text-warning/80">
                            {formatCurrency(item.pendente)}
                          </TableCell>
                        )}
                        {compareWithPrevious && (
                          <>
                            <TableCell className="text-right font-mono text-secondary">
                              {formatCurrency(item.prevValue)}
                            </TableCell>
                            <TableCell className="text-right font-mono">
                              {variance !== null ? (
                                <div className={cn(
                                  "flex items-center justify-end gap-1",
                                  variance > 0 ? "text-positive" : variance < 0 ? "text-negative" : "text-secondary"
                                )}>
                                  {variance > 0 ? <ChevronUp className="w-3 h-3" /> : variance < 0 ? <ChevronDown className="w-3 h-3" /> : null}
                                  {Math.abs(variance).toFixed(1)}%
                                </div>
                              ) : "-"}
                            </TableCell>
                          </>
                        )}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card/50 border-white/5 shadow-subtle">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-secondary flex items-center gap-2">
              <Info className="w-4 h-4" /> Notas Explicativas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-xs text-secondary/70 space-y-2 list-disc pl-4">
              <li>A DRE utiliza o regime de competência baseado na data informada no lançamento.</li>
              <li>"Realizado" contempla apenas lançamentos com status "Pago".</li>
              <li>"Previsto" mostra lançamentos com status "Pendente" para o período.</li>
              <li>O EBITDA desconsidera impostos sobre o lucro e resultado financeiro.</li>
            </ul>
          </CardContent>
        </Card>
        
        <div className="flex flex-col justify-center items-end space-y-2">
          <p className="text-xs text-secondary/40 italic">Gerado em {format(new Date(), "dd/MM/yyyy 'às' HH:mm")}</p>
        </div>
      </div>
    </div>
  );
};

export default Dre;
