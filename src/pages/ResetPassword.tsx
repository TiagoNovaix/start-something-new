import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toastSuccess, toastError } from "@/hooks/useToast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for recovery event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      }
    });

    // Also check hash for type=recovery
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setReady(true);
    }

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toastError("Senha deve ter no mínimo 6 caracteres");
      return;
    }
    if (password !== confirmPassword) {
      toastError("As senhas não conferem");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      toastError("Erro ao redefinir senha", error.message);
    } else {
      toastSuccess("Senha redefinida com sucesso!");
      navigate("/dashboard");
    }
  };

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="bg-card rounded-2xl p-8 border border-border shadow-lg max-w-[420px] w-full mx-4 text-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground text-sm">Verificando link de recuperação...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="bg-card rounded-2xl p-8 border border-border shadow-lg max-w-[420px] w-full mx-4">
        <h2 className="text-center text-lg font-semibold mb-1">Redefinir Senha</h2>
        <p className="text-sm text-muted-foreground text-center mb-6">Digite sua nova senha</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="Nova senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-muted/30 border-border"
          />
          <Input
            type="password"
            placeholder="Confirmar nova senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="bg-muted/30 border-border"
          />
          <Button type="submit" disabled={loading} className="w-full">
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Redefinir Senha
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
