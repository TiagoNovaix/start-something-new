import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, ShieldCheck } from "lucide-react";

const SUPERADMIN_KEY = "superadmin_session";
const VALID_EMAIL = "contato@soluv.com.br";
const VALID_PASSWORD = "W^25A@6T?:v_";

const isAuthenticated = () => {
  try {
    const s = localStorage.getItem(SUPERADMIN_KEY);
    if (!s) return false;
    const parsed = JSON.parse(s);
    return parsed?.authenticated === true;
  } catch {
    return false;
  }
};

const SuperAdminLogin = ({ onLogin }: { onLogin: () => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
      localStorage.setItem(SUPERADMIN_KEY, JSON.stringify({ authenticated: true, ts: Date.now() }));
      onLogin();
    } else {
      setError("Credenciais inválidas.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
      <Card className="w-full max-w-sm border-[#1e1e2e] bg-[#12121a] shadow-2xl">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-red-400" />
          </div>
          <CardTitle className="text-lg text-[#e0e0e0]">Super Admin</CardTitle>
          <p className="text-xs text-[#666]">Acesso restrito</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-[#999] text-xs">Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#0a0a0f] border-[#1e1e2e] text-[#e0e0e0] placeholder:text-[#444] focus-visible:ring-red-500/40"
                placeholder="admin@empresa.com"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[#999] text-xs">Senha</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#0a0a0f] border-[#1e1e2e] text-[#e0e0e0] placeholder:text-[#444] focus-visible:ring-red-500/40"
                placeholder="••••••••"
                required
              />
            </div>
            {error && <p className="text-xs text-red-400">{error}</p>}
            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white">
              Entrar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

const SuperAdminDashboard = ({ onLogout }: { onLogout: () => void }) => (
  <div className="min-h-screen bg-[#0a0a0f] text-[#e0e0e0] flex">
    {/* Sidebar */}
    <aside className="w-56 bg-[#12121a] border-r border-[#1e1e2e] flex flex-col shrink-0">
      <div className="h-14 flex items-center gap-2 px-4 border-b border-[#1e1e2e]">
        <ShieldCheck className="w-5 h-5 text-red-400" />
        <span className="font-semibold text-sm text-red-400">Super Admin</span>
      </div>
      <nav className="flex-1 p-2">
        <div className="px-3 py-2 text-xs font-medium text-red-400/80 bg-red-500/10 rounded-md">
          Dashboard
        </div>
      </nav>
      <div className="p-3 border-t border-[#1e1e2e]">
        <Button variant="ghost" size="sm" onClick={onLogout} className="w-full justify-start text-[#999] hover:text-red-400 hover:bg-red-500/10">
          <LogOut className="w-4 h-4 mr-2" /> Sair
        </Button>
      </div>
    </aside>

    {/* Content */}
    <main className="flex-1 p-8">
      <h1 className="text-xl font-bold mb-6">Painel Super Admin</h1>
      <div className="grid gap-4 md:grid-cols-3">
        {["Empresas", "Usuários", "Sistema"].map((label) => (
          <Card key={label} className="bg-[#12121a] border-[#1e1e2e]">
            <CardHeader>
              <CardTitle className="text-sm text-[#e0e0e0]">{label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-[#666]">Em breve</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  </div>
);

const SuperAdmin = () => {
  const [authed, setAuthed] = useState(isAuthenticated);

  const handleLogout = () => {
    localStorage.removeItem(SUPERADMIN_KEY);
    setAuthed(false);
  };

  if (!authed) return <SuperAdminLogin onLogin={() => setAuthed(true)} />;
  return <SuperAdminDashboard onLogout={handleLogout} />;
};

export default SuperAdmin;
