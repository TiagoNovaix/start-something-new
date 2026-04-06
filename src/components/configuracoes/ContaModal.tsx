import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toastSuccess, toastError } from "@/hooks/useToast";
import { useCompany } from "@/hooks/useCompany";

type FormValues = {
  nome: string;
  tipo: string;
  saldo_inicial: string;
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ContaModal = ({ open, onOpenChange }: Props) => {
  const queryClient = useQueryClient();
  const { companyId } = useCompany();
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<FormValues>({
    defaultValues: { nome: "", tipo: "corrente", saldo_inicial: "0" },
  });

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      if (!companyId) throw new Error("Usuário não vinculado a uma empresa");
      const { error } = await supabase.from("contas").insert({
        nome: values.nome,
        tipo: values.tipo,
        saldo_inicial: parseFloat(values.saldo_inicial) || 0,
        company_id: companyId,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contas"] });
      toastSuccess("Conta salva", "Conta bancária adicionada.");
      reset();
      onOpenChange(false);
    },
    onError: (err: any) => toastError("Erro ao criar conta", err.message),
  });

  const tipoValue = watch("tipo");

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) reset(); onOpenChange(v); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nova Conta Bancária</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="conta-nome">Nome *</Label>
            <Input id="conta-nome" {...register("nome", { required: true })} className={errors.nome ? "border-destructive" : ""} />
            {errors.nome && <p className="text-xs text-destructive">Campo obrigatório</p>}
          </div>

          <div className="space-y-2">
            <Label>Tipo</Label>
            <Select value={tipoValue} onValueChange={(v) => setValue("tipo", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="corrente">Conta Corrente</SelectItem>
                <SelectItem value="poupanca">Poupança</SelectItem>
                <SelectItem value="caixa">Caixa</SelectItem>
                <SelectItem value="carteira">Carteira</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="saldo-inicial">Saldo Inicial</Label>
            <Input id="saldo-inicial" type="number" step="0.01" {...register("saldo_inicial")} />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => { reset(); onOpenChange(false); }}>Cancelar</Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Salvando…" : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContaModal;
