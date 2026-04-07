import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTransactionForm, TipoMovimentacao } from "@/hooks/useTransactionForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { CalendarIcon, Loader2, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface LookupItem { id: string; nome: string; }

export default function TransactionForm() {
  const navigate = useNavigate();
  const {
    formData, updateField, subtipos, showSocio, showContaDestino,
    saving, handleSubmit, reservaPreviews, showReservaDialog,
    setShowReservaDialog, confirmReservas, skipReservas,
  } = useTransactionForm();

  const [categorias, setCategorias] = useState<LookupItem[]>([]);
  const [contas, setContas] = useState<LookupItem[]>([]);
  const [socios, setSocios] = useState<LookupItem[]>([]);
  const [centrosCusto, setCentrosCusto] = useState<LookupItem[]>([]);

  useEffect(() => {
    supabase.from("contas").select("id, nome").eq("ativo", true).is("deleted_at", null).then(({ data }) => setContas(data ?? []));
    supabase.from("socios").select("id, nome").eq("ativo", true).is("deleted_at", null).then(({ data }) => setSocios(data ?? []));
    supabase.from("centros_custo").select("id, nome").eq("ativo", true).is("deleted_at", null).then(({ data }) => setCentrosCusto(data ?? []));
  }, []);

  useEffect(() => {
    const tipoCategoria = formData.tipo === "entrada" ? "entrada" : "saida";
    supabase
      .from("categorias")
      .select("id, nome")
      .eq("tipo", tipoCategoria)
      .eq("ativo", true)
      .then(({ data }) => setCategorias(data ?? []));
  }, [formData.tipo]);

  const DatePicker = ({ value, onChange, label }: { value: Date | undefined; onChange: (d: Date | undefined) => void; label: string }) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !value && "text-muted-foreground")}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, "dd/MM/yyyy") : "Selecionar"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={value} onSelect={onChange} locale={ptBR} className="p-3 pointer-events-auto" />
        </PopoverContent>
      </Popover>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/lancamentos")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Novo Lançamento</h1>
      </div>

      <div className="bg-card rounded-lg border p-6 space-y-6">
        {/* Tipo */}
        <Tabs value={formData.tipo} onValueChange={(v) => updateField("tipo", v as TipoMovimentacao)}>
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="entrada" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-foreground">Entrada</TabsTrigger>
            <TabsTrigger value="saida" className="data-[state=active]:bg-destructive data-[state=active]:text-foreground">Saída</TabsTrigger>
            <TabsTrigger value="transferencia" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Transferência</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Subtipo */}
        <div className="space-y-2">
          <Label>Subtipo</Label>
          <Select value={formData.subtipo} onValueChange={(v) => updateField("subtipo", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {subtipos.map((s) => (
                <SelectItem key={s} value={s}>{s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Descrição + Valor */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Descrição *</Label>
            <Input value={formData.descricao} onChange={(e) => updateField("descricao", e.target.value)} placeholder="Ex: Aluguel escritório" />
          </div>
          <div className="space-y-2">
            <Label>Valor (R$) *</Label>
            <Input value={formData.valor} onChange={(e) => updateField("valor", e.target.value)} placeholder="0,00" />
          </div>
        </div>

        {/* Datas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DatePicker value={formData.dataCompetencia} onChange={(d) => updateField("dataCompetencia", d ?? new Date())} label="Data Competência *" />
          <DatePicker value={formData.dataVencimento} onChange={(d) => updateField("dataVencimento", d)} label="Vencimento" />
          <DatePicker value={formData.dataPagamento} onChange={(d) => updateField("dataPagamento", d)} label="Pagamento" />
        </div>

        {/* Status + Categoria + Conta */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={formData.status} onValueChange={(v) => updateField("status", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="pago">Pago</SelectItem>
                <SelectItem value="atrasado">Atrasado</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Categoria</Label>
            <Select value={formData.categoriaId} onValueChange={(v) => updateField("categoriaId", v)}>
              <SelectTrigger><SelectValue placeholder="Selecionar" /></SelectTrigger>
              <SelectContent>
                {categorias.map((c) => <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Conta *</Label>
            <Select value={formData.contaId} onValueChange={(v) => updateField("contaId", v)}>
              <SelectTrigger><SelectValue placeholder="Selecionar" /></SelectTrigger>
              <SelectContent>
                {contas.map((c) => <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Centro de Custo</Label>
            <Select value={formData.centroCustoId} onValueChange={(v) => updateField("centroCustoId", v)}>
              <SelectTrigger><SelectValue placeholder="Selecionar" /></SelectTrigger>
              <SelectContent>
                {centrosCusto.map((c) => <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Conta destino (transferência) */}
        {showContaDestino && (
          <div className="space-y-2">
            <Label>Conta Destino *</Label>
            <Select value={formData.contaDestinoId} onValueChange={(v) => updateField("contaDestinoId", v)}>
              <SelectTrigger><SelectValue placeholder="Selecionar" /></SelectTrigger>
              <SelectContent>
                {contas.filter((c) => c.id !== formData.contaId).map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Sócio */}
        {showSocio && (
          <div className="space-y-2">
            <Label>Sócio</Label>
            <Select value={formData.socioId} onValueChange={(v) => updateField("socioId", v)}>
              <SelectTrigger><SelectValue placeholder="Selecionar" /></SelectTrigger>
              <SelectContent>
                {socios.map((s) => <SelectItem key={s.id} value={s.id}>{s.nome}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Observações */}
        <div className="space-y-2">
          <Label>Observações</Label>
          <Textarea value={formData.observacoes} onChange={(e) => updateField("observacoes", e.target.value)} placeholder="Notas adicionais..." rows={3} />
        </div>

        {/* Parcelamento */}
        {formData.tipo !== "transferencia" && (
          <div className="space-y-3 rounded-lg border p-4">
            <div className="flex items-center gap-2">
              <Checkbox id="parcelado" checked={formData.parcelado} onCheckedChange={(c) => { updateField("parcelado", !!c); if (c) updateField("recorrente", false); }} />
              <Label htmlFor="parcelado">Parcelado</Label>
            </div>
            {formData.parcelado && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <Label>Nº de parcelas</Label>
                  <Input type="number" min={2} value={formData.numeroParcelas} onChange={(e) => updateField("numeroParcelas", parseInt(e.target.value) || 2)} />
                </div>
                <DatePicker value={formData.dataVencimento} onChange={(d) => updateField("dataVencimento", d)} label="1º vencimento" />
              </div>
            )}
          </div>
        )}

        {/* Recorrência */}
        {formData.tipo !== "transferencia" && (
          <div className="space-y-3 rounded-lg border p-4">
            <div className="flex items-center gap-2">
              <Checkbox id="recorrente" checked={formData.recorrente} onCheckedChange={(c) => { updateField("recorrente", !!c); if (c) updateField("parcelado", false); }} />
              <Label htmlFor="recorrente">Recorrente</Label>
            </div>
            {formData.recorrente && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <Label>Frequência</Label>
                  <Select value={formData.frequenciaRecorrencia} onValueChange={(v) => updateField("frequenciaRecorrencia", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="semanal">Semanal</SelectItem>
                      <SelectItem value="quinzenal">Quinzenal</SelectItem>
                      <SelectItem value="mensal">Mensal</SelectItem>
                      <SelectItem value="bimestral">Bimestral</SelectItem>
                      <SelectItem value="trimestral">Trimestral</SelectItem>
                      <SelectItem value="semestral">Semestral</SelectItem>
                      <SelectItem value="anual">Anual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <DatePicker value={formData.dataFimRecorrencia} onChange={(d) => updateField("dataFimRecorrencia", d)} label="Data fim (opcional)" />
              </div>
            )}
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={() => navigate("/lancamentos")}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Salvar Lançamento
          </Button>
        </div>
      </div>

      {/* Dialog preview caixinhas */}
      <Dialog open={showReservaDialog} onOpenChange={setShowReservaDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Provisionar Caixinhas</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Reservas automáticas encontradas. Deseja provisionar?</p>
          <div className="space-y-3 my-4">
            {reservaPreviews.map((r) => (
              <div key={r.id} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: r.cor }} />
                  <span className="font-medium">{r.nome}</span>
                  <span className="text-muted-foreground text-sm">({r.percentual}%)</span>
                </div>
                <span className="font-semibold">R$ {r.valorProvisionado.toFixed(2)}</span>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={skipReservas}>Pular</Button>
            <Button onClick={confirmReservas} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
