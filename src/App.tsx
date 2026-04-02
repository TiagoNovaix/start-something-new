import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Lancamentos from "./pages/Lancamentos";
import Dre from "./pages/Dre";
import Reservas from "./pages/Reservas";
import Socios from "./pages/Socios";
import Fechamento from "./pages/Fechamento";
import Configuracoes from "./pages/Configuracoes";
import NovoLancamento from "./pages/lancamentos/novo";
import Auth from "./pages/Auth";
import Perfil from "./pages/Perfil";
import NotFound from "./pages/NotFound";
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
};

const AuthRoute = () => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }
  if (user) return <Navigate to="/dashboard" replace />;
  return <Auth />;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route path="/auth" element={<AuthRoute />} />
    <Route path="/login" element={<AuthRoute />} />
    <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
    <Route path="/lancamentos" element={<ProtectedRoute><Layout><Lancamentos /></Layout></ProtectedRoute>} />
    <Route path="/lancamentos/novo" element={<ProtectedRoute><NovoLancamento /></ProtectedRoute>} />
    <Route path="/dre" element={<ProtectedRoute><Layout><Dre /></Layout></ProtectedRoute>} />
    <Route path="/reservas" element={<ProtectedRoute><Layout><Reservas /></Layout></ProtectedRoute>} />
    <Route path="/socios" element={<ProtectedRoute><Layout><Socios /></Layout></ProtectedRoute>} />
    <Route path="/fechamento" element={<ProtectedRoute><Layout><Fechamento /></Layout></ProtectedRoute>} />
    <Route path="/configuracoes" element={<ProtectedRoute><Layout><Configuracoes /></Layout></ProtectedRoute>} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
