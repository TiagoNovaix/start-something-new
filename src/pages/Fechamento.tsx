import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, History, Calculator } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const Fechamento = () => {
  const [activeTab, setActiveTab] = useState<"history" | "new">("history");

  const { data: distribuicoes = [], isLoading } = useQuery({
    queryKey: ["distribuicoes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("distribuicoes_lucro")
        .select("*")
        .order("mes_referencia", { ascending: false });
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Fechamento Mensal</h1>
        <Button onClick={() => setActiveTab(activeTab === "history" ? "new" : "history")}>
          {activeTab === "history" ? (
            <><Plus className="mr-2 h-4 w-4" /> Novo Fechamento</>
          ) : (
            <><History className="mr-2 h-4 w-4" /> Ver Histórico</>
          )}
        </Button>
      </div>

      {activeTab === "history" ? (
        <Card className="bg-card border-none shadow-subtle overflow-hidden">
          <CardHeader className="border-b bg-card/50">
            <CardTitle className="text-lg font-medium">Histórico de Distribuições</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 text-center text-secondary">Carregando histórico...</div>
            ) : distribuicoes.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mês Referência</TableHead>
                    <TableHead>Receita Bruta</TableHead>
                    <TableHead>Lucro Líquido</TableHead>
                    <TableHead>Total Distribuído</TableHead>
                    <TableHead>Data Processamento</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {distribuicoes.map((d) => (
                    <TableRow key={d.id} className="hover:bg-muted/5">
                      <TableCell className="font-medium capitalize">
                        {format(new Date(d.mes_referencia + "T12:00:00"), "MMMM yyyy", { locale: ptBR })}
                      </TableCell>
                      <TableCell>{formatCurrency(d.receita_bruta)}</TableCell>
                      <TableCell className="text-positive font-medium">{formatCurrency(d.lucro_liquido)}</TableCell>
                      <TableCell className="text-primary font-bold">{formatCurrency(d.total_distribuido)}</TableCell>
                      <TableCell className="text-secondary text-sm">
                        {format(new Date(d.created_at), "dd/MM/yyyy HH:mm")}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Detalhes</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="p-12 text-center text-secondary">
                <Calculator className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>Nenhum fechamento realizado ainda.</p>
                <p className="text-sm">Inicie um novo fechamento para processar os resultados do mês.</p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-card border-none shadow-subtle p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
             <Calculator className="w-16 h-16 text-primary mb-6 opacity-20" />
             <h2 className="text-xl font-medium mb-2">Assistente de Fechamento</h2>
             <p className="text-secondary mb-8 max-w-sm">
               O assistente irá consolidar as receitas, despesas e impostos do mês selecionado para calcular a distribuição de lucros.
             </p>
             <Badge variant="outline" className="mb-8 border-primary/20 text-primary">Em breve</Badge>
             <Button variant="outline" onClick={() => setActiveTab("history")}>Voltar ao Histórico</Button>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Fechamento;