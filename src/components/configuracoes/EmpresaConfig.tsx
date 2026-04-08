import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toastSuccess, toastError } from "@/hooks/useToast";
import { useCompany } from "@/hooks/useCompany";
import { useCompanyData } from "@/hooks/useCompanyData";
import { Loader2, Upload, X, ImageIcon } from "lucide-react";

type FormValues = {
  empresa_nome: string;
  cnpj: string;
  regime_tributario: string;
  caixa_operacional_minimo_meses: number;
};

const LogoUpload = () => {
  const queryClient = useQueryClient();
  const { companyId } = useCompany();
  const { logoUrl } = useCompanyData();
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback(async (file: File) => {
    if (!companyId) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toastError("Formato inválido", "Use PNG, JPG ou WebP.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toastError("Arquivo muito grande", "O tamanho máximo é 2MB.");
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${companyId}/logo.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("company-logos")
        .upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("company-logos")
        .getPublicUrl(path);

      // Add cache-busting param
      const urlWithCacheBust = `${publicUrl}?t=${Date.now()}`;

      const { error: updateError } = await supabase
        .from("companies")
        .update({ logo_url: urlWithCacheBust } as any)
        .eq("id", companyId);
      if (updateError) throw updateError;

      queryClient.invalidateQueries({ queryKey: ["company"] });
      toastSuccess("Logo atualizada com sucesso!");
    } catch (err: any) {
      toastError("Erro no upload", err?.message || "Tente novamente.");
    } finally {
      setUploading(false);
    }
  }, [companyId, queryClient]);

  const handleRemoveLogo = async () => {
    if (!companyId) return;
    setUploading(true);
    try {
      const { error } = await supabase
        .from("companies")
        .update({ logo_url: null } as any)
        .eq("id", companyId);
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["company"] });
      toastSuccess("Logo removida");
    } catch (err: any) {
      toastError("Erro ao remover logo", err?.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  return (
    <div className="space-y-3">
      <Label>Logo da Empresa</Label>
      {logoUrl ? (
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-lg border border-border bg-muted/30 flex items-center justify-center overflow-hidden">
            <img
              src={logoUrl}
              alt="Logo da empresa"
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="cursor-pointer">
              <span className="text-sm text-primary hover:underline">Trocar logo</span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                disabled={uploading}
              />
            </label>
            <button
              onClick={handleRemoveLogo}
              className="text-sm text-destructive hover:underline text-left"
              disabled={uploading}
            >
              Remover logo
            </button>
          </div>
          {uploading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragOver ? "border-primary bg-primary/5" : "border-border"
          }`}
        >
          <label className="cursor-pointer flex flex-col items-center gap-2">
            {uploading ? (
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            ) : (
              <>
                <ImageIcon className="w-8 h-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Arraste uma imagem ou <span className="text-primary">clique para enviar</span>
                </span>
                <span className="text-xs text-muted-foreground">PNG, JPG ou WebP • Máx 2MB</span>
              </>
            )}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              disabled={uploading}
            />
          </label>
        </div>
      )}
    </div>
  );
};

const EmpresaConfig = () => {
  const queryClient = useQueryClient();
  const { companyId } = useCompany();

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
      if (!companyId) throw new Error("Usuário não vinculado a uma empresa");

      const payload = {
        empresa_nome: values.empresa_nome || null,
        cnpj: values.cnpj || null,
        regime_tributario: values.regime_tributario || null,
        caixa_operacional_minimo_meses: values.caixa_operacional_minimo_meses || 1,
        user_id: user.id,
        company_id: companyId,
      };

      // Update configuracoes
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

      // Also sync to companies table
      const companyUpdate: Record<string, any> = {};
      if (values.empresa_nome) companyUpdate.name = values.empresa_nome;
      if (values.cnpj) companyUpdate.cnpj = values.cnpj;
      if (values.regime_tributario) companyUpdate.tax_regime = values.regime_tributario;

      if (Object.keys(companyUpdate).length > 0) {
        const { error } = await supabase
          .from("companies")
          .update(companyUpdate)
          .eq("id", companyId);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["configuracoes"] });
      queryClient.invalidateQueries({ queryKey: ["company"] });
      queryClient.invalidateQueries({ queryKey: ["onboarding-status"] });
      toastSuccess("Configurações salvas");
    },
    onError: (err: any) => toastError("Erro ao salvar configurações", err.message),
  });

  const regimeValue = watch("regime_tributario");

  if (isLoading) return <p className="text-muted-foreground text-sm p-6">Carregando…</p>;

  return (
    <div className="bg-card rounded-lg border p-6 max-w-lg">
      <h2 className="text-lg font-medium mb-4">Dados da Empresa</h2>

      <div className="space-y-6">
        <LogoUpload />

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
    </div>
  );
};

export default EmpresaConfig;
