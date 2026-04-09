import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toastSuccess, toastError } from "@/hooks/useToast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type AuthMode = "login" | "forgot";

const SALES_PAGE_URL = "https://sell-financeiro.lovable.app";
const SUPERADMIN_EMAIL = "contato@soluv.com.br";

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!email) e.email = "E-mail é obrigatório";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "E-mail inválido";

    if (mode === "login") {
      if (!password) e.password = "Senha é obrigatória";
      else if (password.length < 6) e.password = "Mínimo 6 caracteres";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      if (mode === "login") {
        const normalizedEmail = email.trim().toLowerCase();
        const { error } = await supabase.auth.signInWithPassword({ email: normalizedEmail, password });

        if (error) {
          if (error.message === "Invalid login credentials") {
            if (normalizedEmail === SUPERADMIN_EMAIL) {
              window.location.href = "/superadmin";
              return;
            }

            try {
              const baseUrl = import.meta.env.VITE_SUPABASE_URL || "https://zmnsgflueklvqibjwhko.supabase.co";
              const res = await fetch(`${baseUrl}/functions/v1/check-user-exists`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  apikey:
                    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
                    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InptbnNnZmx1ZWtsdnFpYmp3aGtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MjE0NTEsImV4cCI6MjA2MDM5NzQ1MX0.yNMiHetgYclNyarhUbu3VV1tINSbdTdUqQ589sM1_3k",
                },
                body: JSON.stringify({ email: normalizedEmail }),
              });
              const data = await res.json();

              if (data.exists) {
                toastError("Senha incorreta. Tente novamente.");
              } else {
                window.location.href = SALES_PAGE_URL;
                return;
              }
            } catch {
              toastError("E-mail ou senha incorretos");
            }
          } else if (error.message === "Email not confirmed") {
            toastError("Confirme seu e-mail antes de entrar");
          } else {
            toastError(error.message);
          }
        }
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) {
          toastError(error.message);
        } else {
          toastSuccess("E-mail de recuperação enviado!");
          setMode("login");
        }
      }
    } catch {
      toastError("Erro inesperado. Tente novamente.");
    }

    setLoading(false);
  };

  const clearField = (field: string) => setErrors((p) => ({ ...p, [field]: undefined }));

  const titles: Record<AuthMode, string> = {
    login: "Entrar",
    forgot: "Recuperar senha",
  };

  const subtitles: Record<AuthMode, string> = {
    login: "Acesse sua conta para continuar",
    forgot: "Informe seu e-mail para redefinir a senha",
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-primary/5 blur-[120px]" />

      <div className="relative z-10 w-full max-w-[420px] mx-4">
        <div className="bg-card rounded-2xl p-8 border border-border shadow-lg">
          <div className="flex justify-center mb-6">
            <span className="text-xl font-bold text-primary">Soluv Financeiro</span>
          </div>

          <h2 className="text-center text-lg font-semibold mb-1">{titles[mode]}</h2>
          <p className="text-sm text-muted-foreground text-center mb-6">{subtitles[mode]}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); clearField("email"); }}
                className={cn(
                  "bg-muted/30 border-border focus-visible:ring-primary/40 focus-visible:border-primary",
                  errors.email && "border-destructive"
                )}
              />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
            </div>

            {mode === "login" && (
              <div>
                <Input
                  type="password"
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); clearField("password"); }}
                  className={cn(
                    "bg-muted/30 border-border focus-visible:ring-primary/40 focus-visible:border-primary",
                    errors.password && "border-destructive"
                  )}
                />
                {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 transition-all text-primary-foreground font-medium"
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {titles[mode]}
            </Button>
          </form>

          <div className="text-sm text-muted-foreground text-center mt-6 space-y-2">
            {mode === "login" && (
              <p>
                <button type="button" onClick={() => { setMode("forgot"); setErrors({}); }} className="text-primary hover:underline font-medium">
                  Esqueci minha senha
                </button>
              </p>
            )}
            {mode === "forgot" && (
              <p>
                <button type="button" onClick={() => { setMode("login"); setErrors({}); }} className="text-primary hover:underline font-medium">
                  Voltar para login
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
