import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Lancamentos from "./pages/Lancamentos";
import Dre from "./pages/Dre";
import Reservas from "./pages/Reservas";
import Socios from "./pages/Socios";
import Fechamento from "./pages/Fechamento";
import Configuracoes from "./pages/Configuracoes";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/dashboard"
            element={
              <Layout>
                <Dashboard />
              </Layout>
            }
          />
          <Route
            path="/lancamentos"
            element={
              <Layout>
                <Lancamentos />
              </Layout>
            }
          />
          <Route
            path="/dre"
            element={
              <Layout>
                <Dre />
              </Layout>
            }
          />
          <Route
            path="/reservas"
            element={
              <Layout>
                <Reservas />
              </Layout>
            }
          />
          <Route
            path="/socios"
            element={
              <Layout>
                <Socios />
              </Layout>
            }
          />
          <Route
            path="/fechamento"
            element={
              <Layout>
                <Fechamento />
              </Route>
            }
          />
          <Route
            path="/configuracoes"
            element={
              <Layout>
                <Configuracoes />
              </Layout>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;