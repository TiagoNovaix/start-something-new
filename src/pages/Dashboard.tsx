import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight,
  AlertCircle,
  Clock,
  Calendar,
  ChevronRight,
  Users
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const Dashboard = () => {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ["dashboard-metrics"],
    queryFn: async () => {
      // In a real app, we would fetch all this data from Supabase
      // For now, we'll use some existing data and mock the rest to match the requirements
      const { data: resumo } = await supabase
        .from("vw_dashboard_resumo")
        .select("*")
        .order("ano", { ascending: false })
        .order("mes", { ascending: false })
        .limit(1)
        .maybeSingle();

      return resumo;
    },
  });

  const formatCurrency = (value: number | null) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value || 0);
  };

  // Mock data for charts
  const revenueData = [
    { name: "Jan", receita: 45000, despesas: 32000 },
    { name: "Fev", receita: 52000, despesas: 34000 },
    { name: "Mar", receita: 48000, despesas: 31000 },
    { name: "Abr", receita: 61000, despesas: 38000 },
    { name: "Mai", receita: 55000, despesas: 36000 },
    { name: "Jun", receita: 68000, despesas: 41000 },
  ];

  const profitData = [
    { name: "Jan", lucro: 13000 },
    { name: "Fev", lucro: 18000 },
    { name: "Mar", lucro: 17000 },
    { name: "Abr", lucro: 23000 },
    { name: "Mai", lucro: 19000 },
    { name: "Jun", lucro: 27000 },
  ];

  const categoryData = [
    { name: "Pessoal", value: 15000, color: "#9e11cd" },
    { name: "Operacional", value: 12000, color: "#e20055" },
    { name: "Impostos", value: 8000, color: "#a400b6" },
    { name: "Marketing", value: 6000, color: "#6366f1" },
  ];

  const reservesData = [
    { name: "Emergência", saldo: 45000 },
    { name: "Expansão", saldo: 32000 },
    { name: "Equipamentos", saldo: 15000 },
    { name: "Treinamento", saldo: 8000 },
  ];

  const partners = [
    { name: "Sócio A", percent: 40, value: 10800 },
    { name: "Sócio B", percent: 30, value: 8100 },
    { name: "Sócio C", percent: 30, value: 8100 },
  ];

  const KPICard = ({ title, value, trend, isPositive, highlight = false }: any) => (
    <Card className={cn(
      "bg-card border-none shadow-subtle relative overflow-hidden group pt-0.5",
      highlight && "ring-1 ring-primary/30"
    )}>
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-identity-gradient" />
      <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0 pt-4">
        <CardTitle className="text-sm font-medium text-secondary">{title}</CardTitle>
        {isPositive !== undefined && (
          isPositive ? <ArrowUpRight className="w-4 h-4 text-positive" /> : <ArrowDownRight className="w-4 h-4 text-negative" />
        )}
      </CardHeader>
      <CardContent>
...
    </Card>
  );

  const AlertCard = ({ title, value, count, icon: Icon, colorClass }: any) => (
    <Card className="bg-card shadow-subtle border-none">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-secondary">{title}</p>
            <div className="text-2xl font-serif">{formatCurrency(value)}</div>
            <p className="text-xs text-muted-foreground">{count} lançamentos</p>
          </div>
          <div className={cn("p-2 rounded-full", colorClass)}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-secondary animate-pulse font-mono uppercase tracking-widest">Carregando Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* KPI Cards Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <KPICard title="Receita Bruta" value={68000} trend={12} isPositive={true} />
        <KPICard title="Despesas Totais" value={41000} trend={5} isPositive={false} />
        <KPICard title="Lucro Líquido" value={27000} trend={18} isPositive={true} highlight={true} />
        <KPICard title="Caixa Atual" value={145000} />
        <KPICard title="Disp. Distribuição" value={32400} />
        <KPICard title="Total em Reservas" value={100000} />
      </div>

      {/* Alert Cards Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AlertCard 
          title="Contas a pagar (7 dias)" 
          value={8500} 
          count={12} 
          icon={Clock} 
          colorClass="bg-warning/10 text-warning"
        />
        <AlertCard 
          title="Contas a pagar (30 dias)" 
          value={24300} 
          count={45} 
          icon={Calendar} 
          colorClass="bg-primary/10 text-primary"
        />
        <AlertCard 
          title="Lançamentos atrasados" 
          value={1200} 
          count={3} 
          icon={AlertCircle} 
          colorClass="bg-negative/10 text-negative"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-none shadow-subtle">
          <CardHeader>
            <CardTitle className="text-base font-medium">Receita vs Despesas (6 meses)</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$ ${value/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#141720", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
                  itemStyle={{ fontFamily: "IBM Plex Mono", fontSize: "12px" }}
                  cursor={{ fill: "rgba(255,255,255,0.05)" }}
                />
                <Legend verticalAlign="top" height={36}/>
                <Bar dataKey="receita" fill="#10B981" radius={[4, 4, 0, 0]} name="Receita" />
                <Bar dataKey="despesas" fill="#e20055" radius={[4, 4, 0, 0]} name="Despesas" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card border-none shadow-subtle">
          <CardHeader>
            <CardTitle className="text-base font-medium">Evolução do Lucro Líquido</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={profitData}>
                <defs>
                  <linearGradient id="colorLucro" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a400b6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#a400b6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$ ${value/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#141720", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
                  itemStyle={{ fontFamily: "IBM Plex Mono", fontSize: "12px" }}
                />
                <Area type="monotone" dataKey="lucro" stroke="#a400b6" fillOpacity={1} fill="url(#colorLucro)" name="Lucro" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card border-none shadow-subtle">
          <CardHeader>
            <CardTitle className="text-base font-medium">Despesas por Grupo DRE (mês)</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: "#141720", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
                  itemStyle={{ fontFamily: "IBM Plex Mono", fontSize: "12px" }}
                />
                <Legend layout="vertical" align="right" verticalAlign="middle" />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card border-none shadow-subtle">
          <CardHeader>
            <CardTitle className="text-base font-medium">Saldo das Caixinhas (Reservas)</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reservesData} layout="vertical" margin={{ left: 40, right: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.5)" fontSize={11} width={80} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#141720", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
                  itemStyle={{ fontFamily: "IBM Plex Mono", fontSize: "12px" }}
                  cursor={{ fill: "rgba(255,255,255,0.05)" }}
                />
                <Bar dataKey="saldo" fill="#9e11cd" radius={[0, 4, 4, 0]} name="Saldo" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Distribution Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <Users className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold tracking-tight">Distribuição disponível por sócio</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {partners.map((partner, i) => (
            <Card key={i} className="bg-card/50 border-none shadow-sm">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{partner.name}</p>
                  <p className="text-lg font-serif">{formatCurrency(partner.value)}</p>
                </div>
                <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">
                  {partner.percent}%
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Last Closing Section */}
      <Card className="bg-identity-gradient border-none p-[1px] rounded-lg">
        <div className="bg-[#141720] rounded-[7px] p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-primary/20 p-3 rounded-full">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Último Fechamento</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="bg-positive/20 text-positive hover:bg-positive/30 border-none">
                  Junho/2024 Concluído
                </Badge>
                <span className="text-xs text-muted-foreground">Status do mês atual em processamento</span>
              </div>
            </div>
          </div>
          <Link 
            to="/fechamento" 
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium text-sm group"
          >
            Ver detalhes do fechamento
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;