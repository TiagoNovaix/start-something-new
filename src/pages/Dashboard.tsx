import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowUpRight, ArrowDownRight, AlertCircle, Clock,
  Calendar, ChevronRight, Users, TrendingUp,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useDashboardData } from "@/hooks/useDashboardData";

const fmt = (v: number | null) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v || 0);

const tooltipStyle = {
  backgroundColor: "#171923",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: "8px",
  fontSize: "12px",
  fontFamily: "IBM Plex Mono",
};

const PIE_COLORS = ["#8B5CF6", "#6366F1", "#EF4444", "#F59E0B", "#22C55E", "#3B82F6"];

const KPI = ({ label, value, trend, positive, large }: {
  label: string; value: number; trend?: number; positive?: boolean; large?: boolean;
}) => (
  <Card className={cn(
    "border-none shadow-subtle transition-all duration-200 hover:scale-[1.005]",
    large
      ? "md:col-span-2 ring-1 ring-primary/25 shadow-[0_0_24px_-6px_hsl(var(--primary)/0.15)] bg-card-gradient-accent"
      : "bg-card-gradient"
  )}>
    <CardContent className={cn("pt-6 pb-6", large ? "px-8" : "px-5")}>
      <p className={cn(
        "font-medium text-muted-foreground/70 uppercase tracking-widest",
        large ? "text-sm mb-5" : "text-[11px] mb-4"
      )}>{label}</p>
      <p className={cn(
        "font-mono font-semibold tracking-tight",
        large ? "text-[40px] md:text-[48px] leading-none" : "text-[28px] md:text-[32px] leading-none",
        positive === true && "text-positive",
        positive === false && "text-negative",
        positive === undefined && "text-foreground",
      )}>
        {fmt(value)}
      </p>
      {trend !== undefined && (
        <div className="flex items-center gap-1.5 mt-4">
          {(trend >= 0) ? (
            <ArrowUpRight className={cn("text-positive", large ? "w-4 h-4" : "w-3.5 h-3.5")} />
          ) : (
            <ArrowDownRight className={cn("text-negative", large ? "w-4 h-4" : "w-3.5 h-3.5")} />
          )}
          <span className={cn("font-mono font-medium", large ? "text-sm" : "text-xs", trend >= 0 ? "text-positive/90" : "text-negative/90")}>
            {Math.abs(trend)}%
          </span>
          <span className={cn("text-muted-foreground/50 ml-0.5", large ? "text-xs" : "text-[10px]")}>vs mês anterior</span>
        </div>
      )}
    </CardContent>
  </Card>
);

const AlertCard = ({ label, value, count, icon: Icon, color }: {
  label: string; value: number; count: number; icon: any; color: string;
}) => (
  <Card className="border-none shadow-subtle bg-card-alt">
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

const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Card className="border-none shadow-subtle bg-card-gradient">
    <CardContent className="pt-5 pb-4 px-5">
      <p className="text-sm font-medium text-foreground mb-4">{title}</p>
      <div className="h-[240px]">{children}</div>
    </CardContent>
  </Card>
);

const MONTHS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

const Dashboard = () => {
  const {
    receita, despesa, lucro, caixa, reservas, disponivel,
    receitaTrend, despesaTrend, lucroTrend,
    alerts, chartData, catData, socios, lastClosing,
    isLoading, lucroPositive,
  } = useDashboardData();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className={cn("border-none shadow-subtle", i === 3 && "md:col-span-2")}>
              <CardContent className="pt-5 pb-5 px-5 space-y-3">
                <Skeleton className="h-3 w-20" /><Skeleton className="h-8 w-32" /><Skeleton className="h-3 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const closingLabel = lastClosing
    ? `${MONTHS[lastClosing.mes - 1]}/${lastClosing.ano} Concluído`
    : "Nenhum fechamento";

  const partnerDistribution = socios.map((s: any) => ({
    name: s.nome,
    pct: s.participacao,
    value: disponivel * (s.participacao / 100),
  }));

  return (
    <div className="space-y-6">
      {/* L1 — Primary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPI label="Receita Bruta" value={receita} trend={receitaTrend} positive={receitaTrend !== undefined ? receitaTrend >= 0 : undefined} />
        <KPI label="Despesas" value={despesa} trend={despesaTrend} positive={despesaTrend !== undefined ? despesaTrend <= 0 : undefined} />
        <KPI label="Lucro Líquido" value={lucro} trend={lucroTrend} positive={lucroPositive} large />
      </div>

      {/* L2 — Secondary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPI label="Caixa Atual" value={caixa} />
        <KPI label="Total em Reservas" value={reservas} />
        <KPI label="Disponível p/ Distribuição" value={disponivel} />
      </div>

      {/* L3 — Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AlertCard label="A pagar (7 dias)" value={alerts.next7.total} count={alerts.next7.count} icon={Clock} color="bg-warning/10 text-warning" />
        <AlertCard label="Atrasados" value={alerts.overdue.total} count={alerts.overdue.count} icon={AlertCircle} color="bg-negative/10 text-negative" />
        <AlertCard label="A pagar (30 dias)" value={alerts.next30.total} count={alerts.next30.count} icon={Calendar} color="bg-primary/10 text-primary" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {chartData.length > 0 && (
          <>
            <ChartCard title="Receita vs Despesas">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barGap={4}>
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
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="gLucro" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="m" stroke="rgba(255,255,255,0.2)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.2)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}k`} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`R$ ${v}k`, "Lucro"]} />
                  <Area type="monotone" dataKey="lucro" stroke="#8B5CF6" strokeWidth={2} fill="url(#gLucro)" name="Lucro" />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>
          </>
        )}

        {catData.length > 0 && (
          <ChartCard title="Despesas por Categoria">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={catData} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={4} dataKey="value">
                  {catData.map((_: any, i: number) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [fmt(v), ""]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-3 mt-2 justify-center">
              {catData.map((c: any, i: number) => (
                <div key={c.name} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                  {c.name}
                </div>
              ))}
            </div>
          </ChartCard>
        )}

        {partnerDistribution.length > 0 && (
          <Card className="border-none shadow-subtle">
            <CardContent className="pt-5 pb-5 px-5">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-4 h-4 text-primary" />
                <p className="text-sm font-medium">Distribuição por Sócio</p>
              </div>
              <div className="space-y-3">
                {partnerDistribution.map((p: any) => (
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
        )}
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
                <Badge className={cn(
                  "border-none text-[11px]",
                  lastClosing ? "bg-positive/15 text-positive hover:bg-positive/20" : "bg-muted text-muted-foreground"
                )}>
                  {closingLabel}
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
