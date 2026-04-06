import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toastSuccess, toastError } from "@/hooks/useToast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type AuthMode = "login" | "register" | "forgot";

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!email) e.email = "E-mail é obrigatório";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "E-mail inválido";

    if (mode !== "forgot") {
      if (!password) e.password = "Senha é obrigatória";
      else if (password.length < 6) e.password = "Mínimo 6 caracteres";
    }

    if (mode === "register") {
      if (!name.trim()) e.name = "Nome é obrigatório";
      if (password !== confirmPassword) e.confirmPassword = "Senhas não conferem";
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
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          const msg =
            error.message === "Invalid login credentials"
              ? "E-mail ou senha incorretos"
              : error.message === "Email not confirmed"
              ? "Confirme seu e-mail antes de entrar"
              : error.message;
           toastError(msg);
        }
      } else if (mode === "register") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: name },
          },
        });

        if (error) {
          const msg =
            error.message.includes("already registered")
              ? "Este e-mail já está cadastrado"
              : error.message;
          toastError(msg);
        } else if (data.user) {

          if (data.session) {
            toastSuccess("Conta criada com sucesso!");
          } else {
            toastSuccess("Conta criada!", "Verifique seu e-mail para confirmar.");
            setMode("login");
          }
        }
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) {
          toast.error(error.message);
        } else {
          toast.success("E-mail de recuperação enviado!");
          setMode("login");
        }
      }
    } catch (err) {
      toast.error("Erro inesperado. Tente novamente.");
    }

    setLoading(false);
  };

  const clearField = (field: string) => setErrors((p) => ({ ...p, [field]: undefined }));

  const titles: Record<AuthMode, string> = {
    login: "Entrar",
    register: "Criar conta",
    forgot: "Recuperar senha",
  };

  const subtitles: Record<AuthMode, string> = {
    login: "Acesse sua conta para continuar",
    register: "Preencha os dados para começar",
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
            {mode === "register" && (
              <div>
                <Input
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => { setName(e.target.value); clearField("name"); }}
                  className={cn(
                    "bg-muted/30 border-border focus-visible:ring-primary/40 focus-visible:border-primary",
                    errors.name && "border-destructive"
                  )}
                />
                {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
              </div>
            )}

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

            {mode !== "forgot" && (
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

            {mode === "register" && (
              <div>
                <Input
                  type="password"
                  placeholder="Confirmar senha"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); clearField("confirmPassword"); }}
                  className={cn(
                    "bg-muted/30 border-border focus-visible:ring-primary/40 focus-visible:border-primary",
                    errors.confirmPassword && "border-destructive"
                  )}
                />
                {errors.confirmPassword && <p className="text-xs text-destructive mt-1">{errors.confirmPassword}</p>}
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
              <>
                <p>
                  Não tem conta?{" "}
                  <button type="button" onClick={() => { setMode("register"); setErrors({}); }} className="text-primary hover:underline font-medium">
                    Criar conta
                  </button>
                </p>
                <p>
                  <button type="button" onClick={() => { setMode("forgot"); setErrors({}); }} className="text-primary hover:underline font-medium">
                    Esqueci minha senha
                  </button>
                </p>
              </>
            )}
            {mode === "register" && (
              <p>
                Já tem conta?{" "}
                <button type="button" onClick={() => { setMode("login"); setErrors({}); }} className="text-primary hover:underline font-medium">
                  Entrar
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
