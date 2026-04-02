import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  Clock,
  Calendar,
  ChevronRight,
  Users,
  TrendingUp,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const fmt = (v: number | null) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v || 0);

const tooltipStyle = {
  backgroundColor: "#171923",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: "8px",
  fontSize: "12px",
  fontFamily: "IBM Plex Mono",
};

// ── KPI Card ──
const KPI = ({ label, value, trend, positive, large }: {
  label: string; value: number; trend?: number; positive?: boolean; large?: boolean;
}) => (
  <Card className={cn(
    "border-none shadow-subtle transition-transform duration-200 hover:scale-[1.005]",
    large && "md:col-span-1 ring-1 ring-primary/20"
  )}>
    <CardContent className={cn("pt-5 pb-5", large ? "px-6" : "px-5")}>
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">{label}</p>
      <p className={cn(
        "font-mono font-semibold tracking-tight",
        large ? "text-3xl md:text-4xl" : "text-2xl",
        positive === true && "text-positive",
        positive === false && "text-negative",
        positive === undefined && "text-foreground",
      )}>
        {fmt(value)}
      </p>
      {trend !== undefined && (
        <div className="flex items-center gap-1.5 mt-2">
          {positive ? (
            <ArrowUpRight className="w-3.5 h-3.5 text-positive" />
          ) : (
            <ArrowDownRight className="w-3.5 h-3.5 text-negative" />
          )}
          <span className={cn("text-xs font-mono font-medium", positive ? "text-positive" : "text-negative")}>
            {trend}%
          </span>
          <span className="text-[10px] text-muted-foreground ml-0.5">vs mês anterior</span>
        </div>
      )}
    </CardContent>
  </Card>
);

// ── Alert Card ──
const Alert = ({ label, value, count, icon: Icon, color }: {
  label: string; value: number; count: number; icon: any; color: string;
}) => (
  <Card className="border-none shadow-subtle">
    <CardContent className="pt-5 pb-5 px-5 flex items-start justify-between">
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
        <p className="text-xl font-mono font-semibold">{fmt(value)}</p>
        <p className="text-[11px] text-muted-foreground mt-1">{count} lançamentos</p>
      </div>
      <div className={cn("p-2 rounded-lg", color)}>
        <Icon className="w-4 h-4" />
      </div>
    </CardContent>
  </Card>
);

// ── Chart wrapper ──
const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Card className="border-none shadow-subtle">
    <CardContent className="pt-5 pb-4 px-5">
      <p className="text-sm font-medium text-foreground mb-4">{title}</p>
      <div className="h-[240px]">{children}</div>
    </CardContent>
  </Card>
);

// ── Data ──
const revenueData = [
  { m: "Jan", rec: 45, desp: 32 },
  { m: "Fev", rec: 52, desp: 34 },
  { m: "Mar", rec: 48, desp: 31 },
  { m: "Abr", rec: 61, desp: 38 },
  { m: "Mai", rec: 55, desp: 36 },
  { m: "Jun", rec: 68, desp: 41 },
];
const profitData = [
  { m: "Jan", v: 13 }, { m: "Fev", v: 18 }, { m: "Mar", v: 17 },
  { m: "Abr", v: 23 }, { m: "Mai", v: 19 }, { m: "Jun", v: 27 },
];
const catData = [
  { name: "Pessoal", value: 15000, color: "#8B5CF6" },
  { name: "Operacional", value: 12000, color: "#6366F1" },
  { name: "Impostos", value: 8000, color: "#EF4444" },
  { name: "Marketing", value: 6000, color: "#F59E0B" },
];
const partners = [
  { name: "Sócio A", pct: 40, value: 10800 },
  { name: "Sócio B", pct: 30, value: 8100 },
  { name: "Sócio C", pct: 30, value: 8100 },
];

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
      if (error) { console.error(error); return null; }
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="border-none shadow-subtle">
              <CardContent className="pt-5 pb-5 px-5 space-y-3">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-3 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const lucro = metrics?.lucro_liquido_realizado || 27000;
  const lucroPositive = lucro >= 0;

  return (
    <div className="space-y-6">
      {/* L1 — Primary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPI label="Receita Bruta" value={metrics?.receita_total || 68000} trend={12} positive />
        <KPI label="Despesas" value={metrics?.despesa_total || 41000} trend={5} positive={false} />
        <KPI label="Lucro Líquido" value={lucro} trend={18} positive={lucroPositive} large />
      </div>

      {/* L2 — Secondary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPI label="Caixa Atual" value={145000} />
        <KPI label="Total em Reservas" value={100000} />
        <KPI label="Disponível p/ Distribuição" value={32400} />
      </div>

      {/* L3 — Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Alert label="A pagar (7 dias)" value={8500} count={12} icon={Clock} color="bg-warning/10 text-warning" />
        <Alert label="Atrasados" value={1200} count={3} icon={AlertCircle} color="bg-negative/10 text-negative" />
        <Alert label="A pagar (30 dias)" value={24300} count={45} icon={Calendar} color="bg-primary/10 text-primary" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Receita vs Despesas">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData} barGap={4}>
              <XAxis dataKey="m" stroke="rgba(255,255,255,0.2)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="rgba(255,255,255,0.2)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}k`} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(255,255,255,0.02)" }} formatter={(v: number) => [`R$ ${v}k`, ""]} />
              <Bar dataKey="rec" fill="#22C55E" radius={[4, 4, 0, 0]} name="Receita" />
              <Bar dataKey="desp" fill="#EF4444" radius={[4, 4, 0, 0]} name="Despesas" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Evolução do Lucro">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={profitData}>
              <defs>
                <linearGradient id="gLucro" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="m" stroke="rgba(255,255,255,0.2)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="rgba(255,255,255,0.2)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}k`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`R$ ${v}k`, "Lucro"]} />
              <Area type="monotone" dataKey="v" stroke="#8B5CF6" strokeWidth={2} fill="url(#gLucro)" name="Lucro" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Despesas por Categoria">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={catData} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={4} dataKey="value">
                {catData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [fmt(v), ""]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 mt-2 justify-center">
            {catData.map((c) => (
              <div key={c.name} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                {c.name}
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Partners */}
        <Card className="border-none shadow-subtle">
          <CardContent className="pt-5 pb-5 px-5">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-primary" />
              <p className="text-sm font-medium">Distribuição por Sócio</p>
            </div>
            <div className="space-y-3">
              {partners.map((p) => (
                <div key={p.name} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.pct}% participação</p>
                  </div>
                  <p className="font-mono text-sm font-semibold">{fmt(p.value)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Closing CTA */}
      <Card className="bg-identity-gradient border-none p-[1px] rounded-lg">
        <div className="bg-card rounded-[11px] p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-primary/15 p-2.5 rounded-lg">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold">Último Fechamento</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="bg-positive/15 text-positive hover:bg-positive/20 border-none text-[11px]">
                  Junho/2024 Concluído
                </Badge>
              </div>
            </div>
          </div>
          <Link to="/fechamento" className="flex items-center gap-1.5 text-primary hover:text-primary/80 text-sm font-medium group">
            Ver detalhes
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
