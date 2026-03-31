import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { addMonths, format } from "date-fns";

export type TipoMovimentacao = "entrada" | "saida" | "transferencia";

const SUBTIPOS: Record<TipoMovimentacao, string[]> = {
  entrada: ["receita", "aporte", "reembolso", "rendimento"],
  saida: ["despesa", "pro_labore", "retirada", "imposto", "investimento"],
  transferencia: ["entre_contas"],
};

export interface TransactionFormData {
  tipo: TipoMovimentacao;
  subtipo: string;
  descricao: string;
  valor: string;
  dataCompetencia: Date;
  dataVencimento: Date | undefined;
  dataPagamento: Date | undefined;
  status: string;
  categoriaId: string;
  contaId: string;
  contaDestinoId: string;
  socioId: string;
  centroCustoId: string;
  observacoes: string;
  parcelado: boolean;
  numeroParcelas: number;
  recorrente: boolean;
  frequenciaRecorrencia: string;
  dataFimRecorrencia: Date | undefined;
}

const initialFormData: TransactionFormData = {
  tipo: "saida",
  subtipo: "despesa",
  descricao: "",
  valor: "",
  dataCompetencia: new Date(),
  dataVencimento: undefined,
  dataPagamento: undefined,
  status: "pendente",
  categoriaId: "",
  contaId: "",
  contaDestinoId: "",
  socioId: "",
  observacoes: "",
  parcelado: false,
  numeroParcelas: 2,
  recorrente: false,
  frequenciaRecorrencia: "mensal",
  dataFimRecorrencia: undefined,
};

export interface ReservaPreview {
  id: string;
  nome: string;
  percentual: number;
  valorProvisionado: number;
  cor: string;
}

export function useTransactionForm() {
  const [formData, setFormData] = useState<TransactionFormData>(initialFormData);
  const [saving, setSaving] = useState(false);
  const [reservaPreviews, setReservaPreviews] = useState<ReservaPreview[]>([]);
  const [showReservaDialog, setShowReservaDialog] = useState(false);
  const [pendingLancamentoId, setPendingLancamentoId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const subtipos = SUBTIPOS[formData.tipo] ?? [];

  function updateField<K extends keyof TransactionFormData>(key: K, value: TransactionFormData[K]) {
    setFormData((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "tipo") {
        const newTipo = value as TipoMovimentacao;
        next.subtipo = SUBTIPOS[newTipo][0];
        next.categoriaId = "";
      }
      return next;
    });
  }

  const showSocio = ["pro_labore", "retirada"].includes(formData.subtipo);
  const showContaDestino = formData.tipo === "transferencia";

  function parseValor(): number {
    const cleaned = formData.valor.replace(/[^\d,.-]/g, "").replace(",", ".");
    return parseFloat(cleaned) || 0;
  }

  function validate(): string | null {
    if (!formData.descricao.trim()) return "Descrição é obrigatória";
    if (parseValor() <= 0) return "Valor deve ser maior que zero";
    if (!formData.contaId) return "Selecione uma conta";
    if (formData.tipo === "transferencia" && !formData.contaDestinoId) return "Selecione a conta destino";
    if (formData.parcelado && formData.numeroParcelas < 2) return "Mínimo de 2 parcelas";
    return null;
  }

  async function checkReservas(lancamentoId: string, valor: number) {
    const { data: reservas } = await supabase
      .from("reservas")
      .select("*")
      .eq("automatico", true)
      .eq("status", "ativa");

    if (!reservas || reservas.length === 0) {
      navigate("/lancamentos");
      toast({ title: "Lançamento salvo com sucesso!" });
      return;
    }

    const previews: ReservaPreview[] = reservas
      .filter((r) => r.percentual && r.percentual > 0)
      .map((r) => ({
        id: r.id,
        nome: r.nome,
        percentual: Number(r.percentual),
        valorProvisionado: Math.round(valor * (Number(r.percentual) / 100) * 100) / 100,
        cor: r.cor ?? "#8B5CF6",
      }));

    if (previews.length === 0) {
      navigate("/lancamentos");
      toast({ title: "Lançamento salvo com sucesso!" });
      return;
    }

    setPendingLancamentoId(lancamentoId);
    setReservaPreviews(previews);
    setShowReservaDialog(true);
  }

  async function confirmReservas() {
    if (!pendingLancamentoId) return;
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Não autenticado");

      for (const r of reservaPreviews) {
        await supabase.from("movimentacoes_reservas").insert({
          reserva_id: r.id,
          transacao_id: pendingLancamentoId,
          tipo: "entrada",
          valor: r.valorProvisionado,
          user_id: user.id,
        });
        await supabase
          .from("reservas")
          .update({ saldo_atual: undefined as any })
          .eq("id", r.id);
        // Increment saldo_atual via RPC would be ideal; for now we read and update
        const { data: reserva } = await supabase.from("reservas").select("saldo_atual").eq("id", r.id).single();
        if (reserva) {
          await supabase
            .from("reservas")
            .update({ saldo_atual: Number(reserva.saldo_atual) + r.valorProvisionado })
            .eq("id", r.id);
        }
      }

      const totalProvisionado = reservaPreviews.reduce((s, r) => s + r.valorProvisionado, 0);
      setShowReservaDialog(false);
      navigate("/lancamentos");
      toast({
        title: "Lançamento salvo!",
        description: `R$ ${totalProvisionado.toFixed(2)} provisionado nas caixinhas.`,
      });
    } catch (err: any) {
      toast({ title: "Erro ao provisionar caixinhas", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  function skipReservas() {
    setShowReservaDialog(false);
    navigate("/lancamentos");
    toast({ title: "Lançamento salvo com sucesso!" });
  }

  async function handleSubmit() {
    const error = validate();
    if (error) {
      toast({ title: error, variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const valor = parseValor();
      const tipoDb = formData.tipo === "entrada" ? "Receita" : formData.tipo === "saida" ? "Despesa" : "Transferência";

      // --- PARCELAMENTO ---
      if (formData.parcelado && !formData.recorrente) {
        const { data: grupo, error: grupoErr } = await supabase
          .from("grupos_parcelas")
          .insert({
            user_id: user.id,
            total_parcelas: formData.numeroParcelas,
            valor_total: valor,
            descricao: formData.descricao,
          })
          .select()
          .single();
        if (grupoErr) throw grupoErr;

        const parcelas = Array.from({ length: formData.numeroParcelas }, (_, i) => {
          const venc = formData.dataVencimento
            ? addMonths(formData.dataVencimento, i)
            : addMonths(formData.dataCompetencia, i);
          return {
            descricao: `${formData.descricao} (${i + 1}/${formData.numeroParcelas})`,
            valor: Math.round((valor / formData.numeroParcelas) * 100) / 100,
            data: format(formData.dataCompetencia, "yyyy-MM-dd"),
            tipo_movimentacao: tipoDb,
            subtipo: formData.subtipo,
            status: i === 0 ? formData.status : "pendente",
            categoria_id: formData.categoriaId || null,
            conta_id: formData.contaId || null,
            conta_destino_id: formData.contaDestinoId || null,
            socio_id: formData.socioId || null,
            observacoes: formData.observacoes || null,
            data_pagamento: i === 0 && formData.dataPagamento ? format(formData.dataPagamento, "yyyy-MM-dd") : null,
            parcelado: true,
            numero_parcela: i + 1,
            total_parcelas: formData.numeroParcelas,
            grupo_parcelas_id: grupo.id,
          };
        });

        const { error: insErr } = await supabase.from("lancamentos").insert(parcelas);
        if (insErr) throw insErr;

        navigate("/lancamentos");
        toast({ title: `${formData.numeroParcelas} parcelas criadas com sucesso!` });
        return;
      }

      // --- RECORRÊNCIA ---
      if (formData.recorrente) {
        const { data: regra, error: regraErr } = await supabase
          .from("regras_recorrencia")
          .insert({
            user_id: user.id,
            frequencia: formData.frequenciaRecorrencia,
            data_inicio: format(formData.dataCompetencia, "yyyy-MM-dd"),
            data_fim: formData.dataFimRecorrencia ? format(formData.dataFimRecorrencia, "yyyy-MM-dd") : null,
            valor,
            categoria_id: formData.categoriaId || null,
            conta_id: formData.contaId || null,
            descricao: formData.descricao,
          })
          .select()
          .single();
        if (regraErr) throw regraErr;

        const freqMonths = formData.frequenciaRecorrencia === "semanal" ? 0.25
          : formData.frequenciaRecorrencia === "quinzenal" ? 0.5
          : formData.frequenciaRecorrencia === "mensal" ? 1
          : formData.frequenciaRecorrencia === "bimestral" ? 2
          : formData.frequenciaRecorrencia === "trimestral" ? 3
          : formData.frequenciaRecorrencia === "semestral" ? 6
          : 12;

        const instances = [];
        for (let i = 0; i < 12; i++) {
          const dt = addMonths(formData.dataCompetencia, Math.round(i * freqMonths));
          if (formData.dataFimRecorrencia && dt > formData.dataFimRecorrencia) break;
          instances.push({
            descricao: formData.descricao,
            valor,
            data: format(dt, "yyyy-MM-dd"),
            tipo_movimentacao: tipoDb,
            subtipo: formData.subtipo,
            status: "pendente",
            categoria_id: formData.categoriaId || null,
            conta_id: formData.contaId || null,
            socio_id: formData.socioId || null,
            observacoes: formData.observacoes || null,
            recorrente: true,
            frequencia_recorrencia: formData.frequenciaRecorrencia,
            regra_recorrencia_id: regra.id,
          });
        }

        const { error: insErr } = await supabase.from("lancamentos").insert(instances);
        if (insErr) throw insErr;

        navigate("/lancamentos");
        toast({ title: `${instances.length} lançamentos recorrentes criados!` });
        return;
      }

      // --- LANÇAMENTO SIMPLES ---
      const { data: lancamento, error: lancErr } = await supabase
        .from("lancamentos")
        .insert({
          descricao: formData.descricao,
          valor,
          data: format(formData.dataCompetencia, "yyyy-MM-dd"),
          tipo_movimentacao: tipoDb,
          subtipo: formData.subtipo,
          status: formData.status,
          categoria_id: formData.categoriaId || null,
          conta_id: formData.contaId || null,
          conta_destino_id: formData.contaDestinoId || null,
          socio_id: formData.socioId || null,
          observacoes: formData.observacoes || null,
          data_pagamento: formData.dataPagamento ? format(formData.dataPagamento, "yyyy-MM-dd") : null,
        })
        .select()
        .single();
      if (lancErr) throw lancErr;

      // Gatilho caixinhas: entrada + pago
      if (formData.tipo === "entrada" && formData.status === "pago") {
        await checkReservas(lancamento.id, valor);
        return;
      }

      navigate("/lancamentos");
      toast({ title: "Lançamento salvo com sucesso!" });
    } catch (err: any) {
      toast({ title: "Erro ao salvar", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  return {
    formData,
    updateField,
    subtipos,
    showSocio,
    showContaDestino,
    saving,
    handleSubmit,
    reservaPreviews,
    showReservaDialog,
    setShowReservaDialog,
    confirmReservas,
    skipReservas,
  };
}
