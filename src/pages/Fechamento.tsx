import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, History, Calculator, Lock, Unlock, CheckCircle2, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const Fechamento = () => {
  const [activeTab, setActiveTab] = useState<"history" | "new">("history");

  const { data: monthlyClosings = [], isLoading: isClosingsLoading } = useQuery({
    queryKey: ["monthly-closings-history"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("monthly_closings")
        .select("*")
        .order("ano", { ascending: false })
        .order("mes", { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'fechado':
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Fechado
          </Badge>
        );
      case 'em_conferencia':
        return (
          <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">
            <AlertCircle className="w-3 h-3 mr-1" /> Em Conferência
          </Badge>
        );
      case 'reaberto':
        return (
          <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">
            <Unlock className="w-3 h-3 mr-1" /> Reaberto
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-500/10 text-gray-600 border-gray-500/20">
            Aberto
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Gestão de Fechamentos</h1>
          <p className="text-secondary">Controle de períodos fiscais e snapshots de DRE</p>
        </div>
        <Button 
          className="bg-primary hover:bg-primary/90"
          onClick={() => window.location.href = '/dre'}
        >
          <Lock className="mr-2 h-4 w-4" /> Novo Fechamento
        </Button>
      </div>

      <Card className="bg-card border-none shadow-subtle overflow-hidden">
        <CardHeader className="border-b bg-card/50">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <History className="w-5 h-5 text-primary" />
            Histórico de Fechamentos
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isClosingsLoading ? (
            <div className="p-12 text-center text-secondary">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              Carregando histórico...
            </div>
          ) : monthlyClosings.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mês/Ano</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data de Fechamento</TableHead>
                  <TableHead>Justificativa</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {monthlyClosings.map((c) => (
                  <TableRow key={c.id} className="hover:bg-muted/5">
                    <TableCell className="font-medium capitalize">
                      {format(new Date(c.ano, c.mes - 1, 1), "MMMM yyyy", { locale: ptBR })}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(c.status || 'aberto')}
                    </TableCell>
                    <TableCell className="text-secondary text-sm">
                      {c.closed_at ? format(new Date(c.closed_at), "dd/MM/yyyy HH:mm") : "—"}
                    </TableCell>
                    <TableCell className="text-secondary text-sm max-w-[200px] truncate">
                      {c.justification || "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary">
                        Visualizar Snapshot
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-20 text-center text-secondary">
              <Calculator className="w-16 h-16 mx-auto mb-6 opacity-20" />
              <h3 className="text-xl font-medium mb-2">Nenhum fechamento registrado</h3>
              <p className="max-w-md mx-auto mb-8 text-sm">
                Os fechamentos mensais permitem congelar os dados financeiros de um período para auditoria e conferência.
              </p>
              <Button variant="outline" onClick={() => window.location.href = '/dre'}>
                Ir para DRE e fechar mês
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Fechamento;
