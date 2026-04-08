import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCompany } from "@/hooks/useCompany";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle2, Circle, Building2, Landmark, Users, Rocket, PartyPopper } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  key: string;
  label: string;
  description: string;
  icon: React.ElementType;
  done: boolean;
  href: string;
}

const OnboardingChecklist = () => {
  const { companyId } = useCompany();
  const queryClient = useQueryClient();
  const [dismissed, setDismissed] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["onboarding-status", companyId],
    enabled: !!companyId,
    refetchOnWindowFocus: true,
    staleTime: 0,
    queryFn: async () => {
      const [companyRes, contasRes, sociosRes] = await Promise.all([
        supabase
          .from("companies")
          .select("name, cnpj, tax_regime")
          .eq("id", companyId!)
          .single(),
        supabase
          .from("contas")
          .select("id")
          .eq("company_id", companyId!)
          .is("deleted_at", null)
          .limit(1),
        supabase
          .from("socios")
          .select("id")
          .eq("company_id", companyId!)
          .is("deleted_at", null)
          .eq("ativo", true)
          .limit(1),
      ]);

      const company = companyRes.data;
      const companyConfigured =
        !!company &&
        company.name !== "Minha Empresa" &&
        !!company.cnpj;

      return {
        companyDone: companyConfigured,
        contasDone: (contasRes.data?.length || 0) > 0,
        sociosDone: (sociosRes.data?.length || 0) > 0,
      };
    },
  });

  // Invalidate onboarding when related queries change
  useEffect(() => {
    const unsubContas = queryClient.getQueryCache().subscribe((event) => {
      if (
        event?.type === "updated" &&
        event.query.queryKey[0] &&
        ["contas", "socios", "company"].some((k) =>
          JSON.stringify(event.query.queryKey).includes(k)
        )
      ) {
        queryClient.invalidateQueries({ queryKey: ["onboarding-status"] });
      }
    });
    return () => unsubContas();
  }, [queryClient]);

  if (isLoading || !data || dismissed) return null;

  const steps: Step[] = [
    {
      key: "empresa",
      label: "Configurar empresa",
      description: "Preencha o nome, CNPJ e regime tributário",
      icon: Building2,
      done: data.companyDone,
      href: "/configuracoes",
    },
    {
      key: "conta",
      label: "Criar conta bancária",
      description: "Adicione pelo menos uma conta para registrar movimentações",
      icon: Landmark,
      done: data.contasDone,
      href: "/configuracoes",
    },
    {
      key: "socios",
      label: "Cadastrar sócios",
      description: "Registre os sócios e suas participações societárias",
      icon: Users,
      done: data.sociosDone,
      href: "/socios",
    },
  ];

  const completedCount = steps.filter((s) => s.done).length;
  const allDone = completedCount === steps.length;
  const progress = Math.round((completedCount / steps.length) * 100);

  if (allDone) {
    return (
      <Card className="border border-positive/30 bg-card-gradient shadow-subtle overflow-hidden">
        <CardContent className="pt-6 pb-6 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-positive/15 p-2 rounded-lg">
              <PartyPopper className="w-5 h-5 text-positive" />
            </div>
            <div>
              <h2 className="text-base font-semibold">Tudo pronto!</h2>
              <p className="text-xs text-muted-foreground">
                Configuração concluída. Você já pode usar todas as funcionalidades.
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setDismissed(true)}>
            Fechar
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-primary/20 bg-card-gradient shadow-subtle overflow-hidden">
      <CardContent className="pt-6 pb-6 px-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="bg-primary/15 p-2 rounded-lg">
            <Rocket className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-semibold">Primeiros passos</h2>
            <p className="text-xs text-muted-foreground">
              Complete {steps.length - completedCount} etapa{steps.length - completedCount > 1 ? "s" : ""} para começar a usar o sistema
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 mb-5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] text-muted-foreground font-medium">Progresso</span>
            <span className="text-[11px] font-mono text-primary font-semibold">{progress}%</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="space-y-3">
          {steps.map((step) => (
            <div
              key={step.key}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg transition-colors",
                step.done
                  ? "bg-positive/5"
                  : "bg-muted/30 hover:bg-muted/50"
              )}
            >
              {step.done ? (
                <CheckCircle2 className="w-5 h-5 text-positive shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground/40 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    "text-sm font-medium",
                    step.done && "line-through text-muted-foreground"
                  )}
                >
                  {step.label}
                </p>
                <p className="text-[11px] text-muted-foreground truncate">
                  {step.description}
                </p>
              </div>
              {!step.done && (
                <Button variant="outline" size="sm" asChild className="shrink-0">
                  <Link to={step.href}>Configurar</Link>
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default OnboardingChecklist;
