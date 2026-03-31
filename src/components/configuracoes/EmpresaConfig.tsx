import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

type FormValues = {
  empresa_nome: string;
  cnpj: string;
  regime_tributario: string;
  caixa_operacional_minimo_meses: number;
};

const EmpresaConfig = () => {
  const queryClient = useQueryClient();

  const { data: config, isLoading } = useQuery({
    queryKey: ["configuracoes"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Não autenticado");

      const { data, error } = await supabase
        .from("configuracoes")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<FormValues>({
    defaultValues: { empresa_nome: "", cnpj: "", regime_tributario: "", caixa_operacional_minimo_meses: 1 },
  });

  useEffect(() => {
    if (config) {
      reset({
        empresa_nome: config.empresa_nome || "",
        cnpj: (config as any).cnpj || "",
        regime_tributario: (config as any).regime_tributario || "",
        caixa_operacional_minimo_meses: config.caixa_operacional_minimo_meses || 1,
      });
    }
  }, [config, reset]);

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Não autenticado");

      const payload = {
        empresa_nome: values.empresa_nome || null,
        cnpj: values.cnpj || null,
        regime_tributario: values.regime_tributario || null,
        caixa_operacional_minimo_meses: values.caixa_operacional_minimo_meses || 1,
        user_id: user.id,
      };

      if (config) {
        const { error } = await supabase
          .from("configuracoes")
          .update(payload)
          .eq("id", config.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("configuracoes").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["configuracoes"] });
      toast({ title: "Configurações salvas" });
    },
    onError: () => toast({ title: "Erro ao salvar configurações", variant: "destructive" }),
  });

  const regimeValue = watch("regime_tributario");

  if (isLoading) return <p className="text-muted-foreground text-sm p-6">Carregando…</p>;

  return (
    <div className="bg-card rounded-lg border p-6 max-w-lg">
      <h2 className="text-lg font-medium mb-4">Dados da Empresa</h2>
      <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="empresa-nome">Nome da Empresa *</Label>
          <Input
            id="empresa-nome"
            {...register("empresa_nome", { required: true })}
            className={errors.empresa_nome ? "border-destructive" : ""}
          />
          {errors.empresa_nome && <p className="text-xs text-destructive">Campo obrigatório</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="cnpj">CNPJ</Label>
          <Input id="cnpj" {...register("cnpj")} placeholder="00.000.000/0000-00" />
        </div>

        <div className="space-y-2">
          <Label>Regime Tributário</Label>
          <Select value={regimeValue} onValueChange={(v) => setValue("regime_tributario", v)}>
            <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="simples_nacional">Simples Nacional</SelectItem>
              <SelectItem value="lucro_presumido">Lucro Presumido</SelectItem>
              <SelectItem value="lucro_real">Lucro Real</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="caixa-operacional">Meses de Caixa Operacional Mínimo</Label>
          <Input 
            id="caixa-operacional" 
            type="number" 
            {...register("caixa_operacional_minimo_meses", { valueAsNumber: true })} 
            min={1} 
          />
          <p className="text-xs text-muted-foreground">Utilizado no cálculo de reserva operacional</p>
        </div>

        <div className="pt-2">
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Salvando…" : "Salvar"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EmpresaConfig;
