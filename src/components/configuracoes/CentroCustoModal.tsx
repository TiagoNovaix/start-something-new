import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toastSuccess, toastError } from "@/hooks/useToast";
import { useCompany } from "@/hooks/useCompany";
import type { CentroCusto } from "./CentrosCusto";

type FormValues = {
  nome: string;
  descricao: string;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  centroCusto: CentroCusto | null;
};

const CentroCustoModal = ({ open, onOpenChange, centroCusto }: Props) => {
  const queryClient = useQueryClient();
  const { companyId } = useCompany();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    defaultValues: { nome: "", descricao: "" },
  });

  useEffect(() => {
    if (open) {
      reset({
        nome: centroCusto?.nome || "",
        descricao: centroCusto?.descricao || "",
      });
    }
  }, [open, centroCusto, reset]);

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Não autenticado");
      if (!companyId) throw new Error("Empresa não encontrada");

      if (centroCusto) {
        const { error } = await supabase
          .from("centros_custo")
          .update({ nome: values.nome, descricao: values.descricao || null })
          .eq("id", centroCusto.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("centros_custo").insert({
          nome: values.nome,
          descricao: values.descricao || null,
          user_id: user.id,
          company_id: companyId,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["centros_custo"] });
      toastSuccess(centroCusto ? "Centro de custo atualizado" : "Centro de custo criado");
      onOpenChange(false);
    },
    onError: (err: any) => toastError("Erro ao salvar", err.message),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{centroCusto ? "Editar Centro de Custo" : "Novo Centro de Custo"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cc-nome">Nome *</Label>
            <Input id="cc-nome" {...register("nome", { required: true })} className={errors.nome ? "border-destructive" : ""} />
            {errors.nome && <p className="text-xs text-destructive">Campo obrigatório</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="cc-descricao">Descrição</Label>
            <Textarea id="cc-descricao" {...register("descricao")} rows={3} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Salvando…" : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CentroCustoModal;
