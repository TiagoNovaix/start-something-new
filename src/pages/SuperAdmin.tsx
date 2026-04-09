import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LogOut, ShieldCheck, Users, UserCheck, Crown, Plus, Pencil, Trash2, Loader2, FileCode, Copy, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const SUPERADMIN_KEY = "superadmin_session";
const VALID_EMAIL = "contato@soluv.com.br";
const VALID_PASSWORD = "W^25A@6T?:v_";
const PLANS = ["free", "basic", "pro", "enterprise"] as const;
type Plan = typeof PLANS[number];

const CREATE_USER_API_KEY = "sk_soluv_2026_f8a3c1d9e7b24056a1c3e5d7f9b0a2c4";

interface UserRow {
  id: string;
  email: string;
  full_name: string | null;
  plan: Plan;
  active: boolean;
  created_at: string;
}

const isAuthenticated = () => {
  try {
    const s = localStorage.getItem(SUPERADMIN_KEY);
    if (!s) return false;
    return JSON.parse(s)?.authenticated === true;
  } catch {
    return false;
  }
};

const getToken = () => localStorage.getItem(SUPERADMIN_KEY) || "";

async function apiCall(method: string, path = "", body?: any) {
  const baseUrl = import.meta.env.VITE_SUPABASE_URL;
  const res = await fetch(`${baseUrl}/functions/v1/superadmin-users/${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      "x-superadmin-token": getToken(),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error || "Request failed");
  }
  return res.json();
}

// ─── Login ───────────────────────────────────────────────
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
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="bg-[#0a0a0f] border-[#1e1e2e] text-[#e0e0e0] placeholder:text-[#444] focus-visible:ring-red-500/40"
                placeholder="admin@empresa.com" required />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[#999] text-xs">Senha</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="bg-[#0a0a0f] border-[#1e1e2e] text-[#e0e0e0] placeholder:text-[#444] focus-visible:ring-red-500/40"
                placeholder="••••••••" required />
            </div>
            {error && <p className="text-xs text-red-400">{error}</p>}
            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white">Entrar</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

// ─── User Form Dialog ────────────────────────────────────
const UserFormDialog = ({
  open, onOpenChange, user, onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  user: UserRow | null;
  onSaved: () => void;
}) => {
  const isEdit = !!user;
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [plan, setPlan] = useState<Plan>("free");
  const [active, setActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setFullName(user?.full_name || "");
      setEmail(user?.email || "");
      setPassword("");
      setPlan((user?.plan as Plan) || "free");
      setActive(user?.active ?? true);
      setError("");
    }
  }, [open, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (isEdit) {
        const body: any = { full_name: fullName, plan, active, email };
        if (password) body.password = password;
        await apiCall("PUT", user!.id, body);
      } else {
        if (!password) { setError("Senha é obrigatória"); setSaving(false); return; }
        await apiCall("POST", "", { email, password, full_name: fullName, plan });
      }
      onSaved();
      onOpenChange(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#12121a] border-[#1e1e2e] text-[#e0e0e0] sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar Usuário" : "Criar Usuário"}</DialogTitle>
          <DialogDescription className="text-[#666]">
            {isEdit ? "Altere os dados do usuário" : "Preencha os dados do novo usuário"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-[#999] text-xs">Nome Completo</Label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)}
              className="bg-[#0a0a0f] border-[#1e1e2e] text-[#e0e0e0]" required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[#999] text-xs">Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="bg-[#0a0a0f] border-[#1e1e2e] text-[#e0e0e0]" required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[#999] text-xs">Senha{isEdit ? " (deixe vazio para manter)" : ""}</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="bg-[#0a0a0f] border-[#1e1e2e] text-[#e0e0e0]"
              placeholder={isEdit ? "••••••••" : ""} required={!isEdit} minLength={6} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-[#999] text-xs">Plano</Label>
              <Select value={plan} onValueChange={(v) => setPlan(v as Plan)}>
                <SelectTrigger className="bg-[#0a0a0f] border-[#1e1e2e] text-[#e0e0e0]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#12121a] border-[#1e1e2e]">
                  {PLANS.map((p) => (
                    <SelectItem key={p} value={p} className="text-[#e0e0e0] capitalize">{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {isEdit && (
              <div className="space-y-1.5">
                <Label className="text-[#999] text-xs">Status</Label>
                <Select value={active ? "active" : "inactive"} onValueChange={(v) => setActive(v === "active")}>
                  <SelectTrigger className="bg-[#0a0a0f] border-[#1e1e2e] text-[#e0e0e0]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#12121a] border-[#1e1e2e]">
                    <SelectItem value="active" className="text-[#e0e0e0]">Ativo</SelectItem>
                    <SelectItem value="inactive" className="text-[#e0e0e0]">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="text-[#999]">Cancelar</Button>
            <Button type="submit" disabled={saving} className="bg-red-600 hover:bg-red-700 text-white">
              {saving && <Loader2 className="w-4 h-4 animate-spin mr-1" />}
              {isEdit ? "Salvar" : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// ─── API Docs Section ────────────────────────────────────
const ApiDocsSection = () => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const endpointUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-user`;

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success("Copiado!");
    setTimeout(() => setCopiedField(null), 2000);
  };

  const curlExample = `curl -X POST \\
  ${endpointUrl} \\
  -H 'Content-Type: application/json' \\
  -d '{
    "name": "João Silva",
    "email": "joao@empresa.com",
    "password": "senhaSegura123!",
    "plan": "pro",
    "api_key": "${CREATE_USER_API_KEY}"
  }'`;

  const jsonBody = `{
  "name": "string (required)",
  "email": "string (required)",
  "password": "string (required)",
  "plan": "free | basic | pro | enterprise",
  "api_key": "string (required)"
}`;

  const CopyButton = ({ text, field }: { text: string; field: string }) => (
    <Button
      variant="ghost"
      size="icon"
      className="h-7 w-7 text-[#666] hover:text-[#e0e0e0] shrink-0"
      onClick={() => copyToClipboard(text, field)}
    >
      {copiedField === field ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
    </Button>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-[#e0e0e0] mb-1">API de Criação de Usuários</h2>
        <p className="text-xs text-[#666]">Endpoint para criar usuários programaticamente via integração externa.</p>
      </div>

      {/* Endpoint */}
      <div className="space-y-2">
        <Label className="text-[#999] text-xs font-semibold uppercase tracking-wider">Endpoint</Label>
        <div className="flex items-center gap-2 bg-[#0a0a0f] border border-[#1e1e2e] rounded-md p-3">
          <Badge className="bg-green-500/20 text-green-400 text-[10px] shrink-0">POST</Badge>
          <code className="text-sm text-[#e0e0e0] font-mono break-all flex-1">{endpointUrl}</code>
          <CopyButton text={endpointUrl} field="endpoint" />
        </div>
      </div>

      {/* API Key */}
      <div className="space-y-2">
        <Label className="text-[#999] text-xs font-semibold uppercase tracking-wider">API Key</Label>
        <div className="flex items-center gap-2 bg-[#0a0a0f] border border-[#1e1e2e] rounded-md p-3">
          <code className="text-sm text-amber-300 font-mono break-all flex-1">{CREATE_USER_API_KEY}</code>
          <CopyButton text={CREATE_USER_API_KEY} field="apikey" />
        </div>
        <p className="text-[10px] text-[#555]">⚠️ A api_key pode ser rotacionada atualizando o valor no painel SuperAdmin e na Edge Function.</p>
      </div>

      {/* JSON Body */}
      <div className="space-y-2">
        <Label className="text-[#999] text-xs font-semibold uppercase tracking-wider">JSON Body</Label>
        <div className="relative bg-[#0a0a0f] border border-[#1e1e2e] rounded-md p-3">
          <pre className="text-xs text-[#c0c0c0] font-mono whitespace-pre overflow-x-auto">{jsonBody}</pre>
          <div className="absolute top-2 right-2">
            <CopyButton text={jsonBody} field="body" />
          </div>
        </div>
      </div>

      {/* Response */}
      <div className="space-y-2">
        <Label className="text-[#999] text-xs font-semibold uppercase tracking-wider">Resposta (201)</Label>
        <div className="bg-[#0a0a0f] border border-[#1e1e2e] rounded-md p-3">
          <pre className="text-xs text-[#c0c0c0] font-mono">{`{ "userId": "uuid", "email": "string", "plan": "string" }`}</pre>
        </div>
      </div>

      {/* Curl Example */}
      <div className="space-y-2">
        <Label className="text-[#999] text-xs font-semibold uppercase tracking-wider">Exemplo cURL</Label>
        <div className="relative bg-[#0a0a0f] border border-[#1e1e2e] rounded-md p-3">
          <pre className="text-xs text-[#c0c0c0] font-mono whitespace-pre overflow-x-auto">{curlExample}</pre>
          <div className="absolute top-2 right-2">
            <CopyButton text={curlExample} field="curl" />
          </div>
        </div>
      </div>

      {/* Errors */}
      <div className="space-y-2">
        <Label className="text-[#999] text-xs font-semibold uppercase tracking-wider">Códigos de Erro</Label>
        <div className="bg-[#0a0a0f] border border-[#1e1e2e] rounded-md overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#1e1e2e]">
                <th className="text-left p-2 text-[#666] font-medium">Status</th>
                <th className="text-left p-2 text-[#666] font-medium">Descrição</th>
              </tr>
            </thead>
            <tbody className="text-[#999]">
              <tr className="border-b border-[#1e1e2e]/50"><td className="p-2 font-mono">400</td><td className="p-2">Campos obrigatórios ausentes ou JSON inválido</td></tr>
              <tr className="border-b border-[#1e1e2e]/50"><td className="p-2 font-mono">401</td><td className="p-2">API key inválida ou ausente</td></tr>
              <tr><td className="p-2 font-mono">500</td><td className="p-2">Erro interno do servidor</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ─── Dashboard ───────────────────────────────────────────
const SuperAdminDashboard = ({ onLogout }: { onLogout: () => void }) => {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<UserRow | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState<"users" | "api">("users");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiCall("GET");
      setUsers(data.users || []);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await apiCall("DELETE", deleteTarget.id);
      setDeleteTarget(null);
      fetchUsers();
    } catch (err) {
      console.error("Delete failed", err);
    } finally {
      setDeleting(false);
    }
  };

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.active).length;
  const planCounts = PLANS.reduce((acc, p) => {
    acc[p] = users.filter((u) => u.plan === p).length;
    return acc;
  }, {} as Record<Plan, number>);

  const planColors: Record<Plan, string> = {
    free: "bg-[#333] text-[#aaa]",
    basic: "bg-blue-500/20 text-blue-300",
    pro: "bg-purple-500/20 text-purple-300",
    enterprise: "bg-amber-500/20 text-amber-300",
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e0e0e0] flex">
      {/* Sidebar */}
      <aside className="w-56 bg-[#12121a] border-r border-[#1e1e2e] flex flex-col shrink-0">
        <div className="h-14 flex items-center gap-2 px-4 border-b border-[#1e1e2e]">
          <ShieldCheck className="w-5 h-5 text-red-400" />
          <span className="font-semibold text-sm text-red-400">Super Admin</span>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          <button
            onClick={() => setActiveTab("users")}
            className={`w-full px-3 py-2 text-xs font-medium rounded-md flex items-center gap-2 transition-colors ${
              activeTab === "users"
                ? "text-red-400/80 bg-red-500/10"
                : "text-[#666] hover:text-[#999] hover:bg-[#1a1a24]"
            }`}
          >
            <Users className="w-3.5 h-3.5" /> Usuários
          </button>
          <button
            onClick={() => setActiveTab("api")}
            className={`w-full px-3 py-2 text-xs font-medium rounded-md flex items-center gap-2 transition-colors ${
              activeTab === "api"
                ? "text-red-400/80 bg-red-500/10"
                : "text-[#666] hover:text-[#999] hover:bg-[#1a1a24]"
            }`}
          >
            <FileCode className="w-3.5 h-3.5" /> API Docs
          </button>
        </nav>
        <div className="p-3 border-t border-[#1e1e2e]">
          <Button variant="ghost" size="sm" onClick={onLogout}
            className="w-full justify-start text-[#999] hover:text-red-400 hover:bg-red-500/10">
            <LogOut className="w-4 h-4 mr-2" /> Sair
          </Button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8 overflow-auto">
        {activeTab === "api" ? (
          <ApiDocsSection />
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-xl font-bold">Gestão de Usuários</h1>
              <Button onClick={() => { setEditingUser(null); setFormOpen(true); }}
                className="bg-red-600 hover:bg-red-700 text-white">
                <Plus className="w-4 h-4 mr-1" /> Novo Usuário
              </Button>
            </div>

            {/* Stats */}
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-6 mb-6">
              <Card className="bg-[#12121a] border-[#1e1e2e]">
                <CardContent className="p-4 flex items-center gap-3">
                  <Users className="w-5 h-5 text-[#666]" />
                  <div>
                    <p className="text-2xl font-bold">{totalUsers}</p>
                    <p className="text-[10px] text-[#666] uppercase tracking-wider">Total</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-[#12121a] border-[#1e1e2e]">
                <CardContent className="p-4 flex items-center gap-3">
                  <UserCheck className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-2xl font-bold">{activeUsers}</p>
                    <p className="text-[10px] text-[#666] uppercase tracking-wider">Ativos</p>
                  </div>
                </CardContent>
              </Card>
              {PLANS.map((p) => (
                <Card key={p} className="bg-[#12121a] border-[#1e1e2e]">
                  <CardContent className="p-4 flex items-center gap-3">
                    <Crown className="w-5 h-5 text-[#666]" />
                    <div>
                      <p className="text-2xl font-bold">{planCounts[p]}</p>
                      <p className="text-[10px] text-[#666] uppercase tracking-wider capitalize">{p}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Users Table */}
            <Card className="bg-[#12121a] border-[#1e1e2e]">
              <CardContent className="p-0">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-[#666]" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="border-[#1e1e2e] hover:bg-transparent">
                        <TableHead className="text-[#666]">Nome</TableHead>
                        <TableHead className="text-[#666]">Email</TableHead>
                        <TableHead className="text-[#666]">Plano</TableHead>
                        <TableHead className="text-[#666]">Status</TableHead>
                        <TableHead className="text-[#666]">Criação</TableHead>
                        <TableHead className="text-[#666] text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.length === 0 ? (
                        <TableRow className="border-[#1e1e2e]">
                          <TableCell colSpan={6} className="text-center py-8 text-[#666]">
                            Nenhum usuário encontrado
                          </TableCell>
                        </TableRow>
                      ) : (
                        users.map((u) => (
                          <TableRow key={u.id} className="border-[#1e1e2e] hover:bg-[#1a1a24]">
                            <TableCell className="font-medium">{u.full_name || "—"}</TableCell>
                            <TableCell className="text-[#999]">{u.email}</TableCell>
                            <TableCell>
                              <Badge variant="secondary" className={`capitalize text-[10px] ${planColors[u.plan] || planColors.free}`}>
                                {u.plan}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary" className={u.active
                                ? "bg-green-500/15 text-green-400 text-[10px]"
                                : "bg-red-500/15 text-red-400 text-[10px]"}>
                                {u.active ? "Ativo" : "Inativo"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-[#999] text-xs">
                              {new Date(u.created_at).toLocaleDateString("pt-BR")}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-[#666] hover:text-[#e0e0e0]"
                                onClick={() => { setEditingUser(u); setFormOpen(true); }}>
                                <Pencil className="w-3.5 h-3.5" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-[#666] hover:text-red-400"
                                onClick={() => setDeleteTarget(u)}>
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </main>

      {/* Form Dialog */}
      <UserFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        user={editingUser}
        onSaved={fetchUsers}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
        <AlertDialogContent className="bg-[#12121a] border-[#1e1e2e] text-[#e0e0e0]">
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir usuário</AlertDialogTitle>
            <AlertDialogDescription className="text-[#999]">
              Tem certeza que deseja excluir <strong>{deleteTarget?.full_name || deleteTarget?.email}</strong>?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-[#1e1e2e] text-[#999]">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting}
              className="bg-red-600 hover:bg-red-700 text-white">
              {deleting && <Loader2 className="w-4 h-4 animate-spin mr-1" />}
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

// ─── Root ────────────────────────────────────────────────
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
