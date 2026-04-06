import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toastSuccess, toastError } from "@/hooks/useToast";
import { useCompany } from "@/hooks/useCompany";

type FormValues = {
  nome: string;
  email: string;
  participacao: number;
  percentual_lucro: number;
};

interface SocioModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing?: any | null;
}

const SocioModal = ({ open, onOpenChange, editing }: SocioModalProps) => {
  const queryClient = useQueryClient();
  const { companyId } = useCompany();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    defaultValues: { nome: "", email: "", participacao: 0, percentual_lucro: 0 },
  });

  useEffect(() => {
    if (editing) {
      reset({ nome: editing.nome, email: editing.email || "", participacao: editing.participacao || 0, pro_labore: editing.pro_labore || 0 });
    } else {
      reset({ nome: "", email: "", participacao: 0, pro_labore: 0 });
    }
  }, [editing, reset, open]);

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      if (!companyId) throw new Error("Usuário não vinculado a uma empresa");
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Não autenticado");
      const payload = { ...values, user_id: user.id, company_id: companyId };
      if (editing) {
        const { error } = await supabase.from("socios").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("socios").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["socios"] });
      toastSuccess("Sócio atualizado", "Dados salvos com sucesso.");
      onOpenChange(false);
    },
    onError: (error: any) => {
      toastError("Erro ao salvar sócio", error.message);
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editing ? "Editar Sócio" : "Novo Sócio"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome *</Label>
            <Input id="nome" {...register("nome", { required: "Nome é obrigatório" })} />
            {errors.nome && <p className="text-xs text-destructive">{errors.nome.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="participacao">Participação (%)</Label>
              <Input id="participacao" type="number" step="0.01" {...register("participacao", { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pro_labore">Pró-labore (R$)</Label>
              <Input id="pro_labore" type="number" step="0.01" {...register("pro_labore", { valueAsNumber: true })} />
            </div>
          </div>
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SocioModal;
