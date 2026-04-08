import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCompany } from "@/hooks/useCompany";

export const useDashboardData = () => {
  const { companyId } = useCompany();

  // Main metrics from the view
  const metricsQuery = useQuery({
    queryKey: ["dashboard-metrics", companyId],
    enabled: !!companyId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vw_dashboard_resumo")
        .select("*")
        .eq("company_id", companyId!)
        .order("ano", { ascending: false })
        .order("mes", { ascending: false })
        .limit(2);
      if (error) throw error;
      return data || [];
    },
  });

  // Bank accounts total balance
  const caixaQuery = useQuery({
    queryKey: ["dashboard-caixa", companyId],
    enabled: !!companyId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contas")
        .select("saldo_atual")
        .eq("company_id", companyId!)
        .is("deleted_at", null)
        .eq("ativo", true);
      if (error) throw error;
      return (data || []).reduce((sum, c) => sum + (c.saldo_atual || 0), 0);
    },
  });

  // Reserves total
  const reservasQuery = useQuery({
    queryKey: ["dashboard-reservas", companyId],
    enabled: !!companyId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reservas")
        .select("saldo_atual")
        .eq("company_id", companyId!)
        .is("deleted_at", null)
        .eq("status", "ativa");
      if (error) throw error;
      return (data || []).reduce((sum, r) => sum + (r.saldo_atual || 0), 0);
    },
  });

  // Alerts: overdue + upcoming 7d + upcoming 30d
  const alertsQuery = useQuery({
    queryKey: ["dashboard-alerts", companyId],
    enabled: !!companyId,
    queryFn: async () => {
      const today = new Date().toISOString().split("T")[0];
      const d7 = new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0];
      const d30 = new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0];

      // Overdue
      const { data: overdue } = await supabase
        .from("lancamentos")
        .select("valor")
        .eq("company_id", companyId!)
        .eq("tipo_movimentacao", "Despesa")
        .eq("status", "pendente")
        .is("deleted_at", null)
        .lt("data_vencimento", today);

      // Next 7 days
      const { data: next7 } = await supabase
        .from("lancamentos")
        .select("valor")
        .eq("company_id", companyId!)
        .eq("tipo_movimentacao", "Despesa")
        .eq("status", "pendente")
        .is("deleted_at", null)
        .gte("data_vencimento", today)
        .lte("data_vencimento", d7);

      // Next 30 days
      const { data: next30 } = await supabase
        .from("lancamentos")
        .select("valor")
        .eq("company_id", companyId!)
        .eq("tipo_movimentacao", "Despesa")
        .eq("status", "pendente")
        .is("deleted_at", null)
        .gte("data_vencimento", today)
        .lte("data_vencimento", d30);

      const sum = (arr: any[] | null) => ({
        total: (arr || []).reduce((s, r) => s + (r.valor || 0), 0),
        count: (arr || []).length,
      });

      return {
        overdue: sum(overdue),
        next7: sum(next7),
        next30: sum(next30),
      };
    },
  });

  // Monthly revenue/expense for charts (last 6 months)
  const chartQuery = useQuery({
    queryKey: ["dashboard-chart", companyId],
    enabled: !!companyId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vw_dashboard_resumo")
        .select("ano, mes, receita_total, despesa_total, lucro_liquido_realizado")
        .eq("company_id", companyId!)
        .order("ano", { ascending: true })
        .order("mes", { ascending: true })
        .limit(12);
      if (error) throw error;
      return data || [];
    },
  });

  // Expense by category (current month)
  const catQuery = useQuery({
    queryKey: ["dashboard-categories", companyId],
    enabled: !!companyId,
    queryFn: async () => {
      const now = new Date();
      const startOfMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
      const { data, error } = await supabase
        .from("lancamentos")
        .select("valor, categorias (nome)")
        .eq("company_id", companyId!)
        .eq("tipo_movimentacao", "Despesa")
        .eq("status", "pago")
        .is("deleted_at", null)
        .gte("data", startOfMonth);
      if (error) throw error;

      const map: Record<string, number> = {};
      (data || []).forEach((l: any) => {
        const name = l.categorias?.nome || "Sem categoria";
        map[name] = (map[name] || 0) + (l.valor || 0);
      });
      return Object.entries(map)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 6);
    },
  });

  // Partners
  const sociosQuery = useQuery({
    queryKey: ["dashboard-socios", companyId],
    enabled: !!companyId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("socios")
        .select("nome, participacao")
        .eq("company_id", companyId!)
        .is("deleted_at", null)
        .eq("ativo", true);
      if (error) throw error;
      return data || [];
    },
  });

  // Last closing
  const closingQuery = useQuery({
    queryKey: ["dashboard-closing", companyId],
    enabled: !!companyId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("monthly_closings")
        .select("mes, ano, status")
        .eq("company_id", companyId!)
        .eq("status", "fechado")
        .is("deleted_at", null)
        .order("ano", { ascending: false })
        .order("mes", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const current = metricsQuery.data?.[0] || null;
  const previous = metricsQuery.data?.[1] || null;

  const pctChange = (curr: number, prev: number) => {
    if (!prev) return undefined;
    return Math.round(((curr - prev) / Math.abs(prev)) * 100);
  };

  const receita = current?.receita_total || 0;
  const despesa = current?.despesa_total || 0;
  const lucro = current?.lucro_liquido_realizado || 0;
  const caixa = caixaQuery.data || 0;
  const reservas = reservasQuery.data || 0;
  const disponivel = Math.max(lucro - reservas, 0);

  const receitaTrend = previous ? pctChange(receita, previous.receita_total || 0) : undefined;
  const despesaTrend = previous ? pctChange(despesa, previous.despesa_total || 0) : undefined;
  const lucroTrend = previous ? pctChange(lucro, previous.lucro_liquido_realizado || 0) : undefined;

  const isLoading = metricsQuery.isLoading || caixaQuery.isLoading;

  return {
    receita, despesa, lucro, caixa, reservas, disponivel,
    receitaTrend, despesaTrend, lucroTrend,
    alerts: alertsQuery.data || { overdue: { total: 0, count: 0 }, next7: { total: 0, count: 0 }, next30: { total: 0, count: 0 } },
    chartData: (chartQuery.data || []).map((r: any) => {
      const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
      return {
        m: months[(r.mes || 1) - 1],
        rec: Math.round((r.receita_total || 0) / 1000),
        desp: Math.round((r.despesa_total || 0) / 1000),
        lucro: Math.round((r.lucro_liquido_realizado || 0) / 1000),
      };
    }),
    catData: catQuery.data || [],
    socios: sociosQuery.data || [],
    lastClosing: closingQuery.data,
    isLoading,
    lucroPositive: lucro >= 0,
  };
};
