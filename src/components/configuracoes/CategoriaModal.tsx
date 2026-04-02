import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useCompany } from "@/hooks/useCompany";
import type { Categoria } from "./CategoriasDre";

const GRUPOS_DRE = [
  "Receita Bruta", "Deduções da Receita", "Receita Líquida", "Custo dos Serviços/Produtos",
  "Lucro Bruto", "Despesa Operacional", "Despesa Administrativa", "Despesa Comercial",
  "Despesa Financeira", "Receita Financeira", "Outras Receitas", "Outras Despesas",
  "Resultado Antes do IR", "Impostos sobre Lucro", "Lucro Líquido", "Despesa Variável", "Despesa Fixa",
];

type FormValues = {
  nome: string;
  tipo: string;
  classificacao_dre: string;
  subgrupo: string;
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoria: Categoria | null;
}

const CategoriaModal = ({ open, onOpenChange, categoria }: Props) => {
  const queryClient = useQueryClient();
  const { companyId } = useCompany();
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<FormValues>({
    defaultValues: { nome: "", tipo: "saida", classificacao_dre: "Despesa Variável", subgrupo: "" },
  });

  useEffect(() => {
    if (categoria) {
      reset({
        nome: categoria.nome, tipo: categoria.tipo,
        classificacao_dre: categoria.classificacao_dre || "Despesa Variável",
        subgrupo: categoria.subgrupo || "",
      });
    } else {
      reset({ nome: "", tipo: "saida", classificacao_dre: "Despesa Variável", subgrupo: "" });
    }
  }, [categoria, open, reset]);

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      if (!companyId) throw new Error("Usuário não vinculado a uma empresa");
      const payload = {
        nome: values.nome, tipo: values.tipo,
        classificacao_dre: values.classificacao_dre,
        subgrupo: values.subgrupo || null,
        company_id: companyId,
      };

      if (categoria) {
        const { error } = await supabase.from("categorias").update(payload).eq("id", categoria.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("categorias").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
      toast({ title: categoria ? "Categoria atualizada" : "Categoria criada" });
      onOpenChange(false);
    },
    onError: (err: any) => toast({ title: err.message || "Erro ao salvar categoria", variant: "destructive" }),
  });

  const tipoValue = watch("tipo");
  const grupoDreValue = watch("classificacao_dre");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{categoria ? "Editar Categoria" : "Nova Categoria"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome *</Label>
            <Input id="nome" {...register("nome", { required: true })} className={errors.nome ? "border-destructive" : ""} />
            {errors.nome && <p className="text-xs text-destructive">Campo obrigatório</p>}
          </div>

          <div className="space-y-2">
            <Label>Tipo</Label>
            <Select value={tipoValue} onValueChange={(v) => setValue("tipo", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="entrada">Entrada</SelectItem>
                <SelectItem value="saida">Saída</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Grupo DRE</Label>
            <Select value={grupoDreValue} onValueChange={(v) => setValue("classificacao_dre", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {GRUPOS_DRE.map((g) => (<SelectItem key={g} value={g}>{g}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subgrupo">Subgrupo</Label>
            <Input id="subgrupo" {...register("subgrupo")} />
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

export default CategoriaModal;
