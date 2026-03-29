import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Receipt,
  FileBarChart,
  CalendarDays,
  Users,
  Lock,
  Settings,
  ChevronDown,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Receipt, label: "Lançamentos", path: "/lancamentos" },
  { icon: FileBarChart, label: "DRE", path: "/dre" },
  { icon: CalendarDays, label: "Reservas", path: "/reservas" },
  { icon: Users, label: "Sócios", path: "/socios" },
  { icon: Lock, label: "Fechamento", path: "/fechamento" },
  { icon: Settings, label: "Configurações", path: "/configuracoes" },
];

const SidebarItem = ({ icon: Icon, label, path, active }: { icon: any; label: string; path: string; active: boolean }) => {
  return (
    <Link
      to={path}
      className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors border-l-2 ${
        active
          ? "bg-[#a400b6]/15 border-[#a400b6] text-foreground"
          : "border-transparent text-secondary hover:bg-white/5"
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </Link>
  );
};

const Header = ({ title }: { title: string }) => {
  return (
    <header className="h-[56px] border-b bg-card flex items-center justify-between px-6 shrink-0">
      <h1 className="font-bold text-foreground">{title}</h1>
      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm font-medium text-secondary hover:bg-white/5">
          Jan 2024
          <ChevronDown className="w-4 h-4" />
        </button>
        <Avatar className="w-8 h-8">
          <AvatarImage src="" />
          <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">CT</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const currentItem = menuItems.find((item) => item.path === location.pathname);
  const title = currentItem?.label || "Página";

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[240px] bg-card border-r flex flex-col shrink-0">
        <div className="p-6">
          <Link to="/dashboard" className="text-2xl font-serif text-gradient">
            Control Tower
          </Link>
        </div>
        <nav className="flex-1 mt-4">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.path}
              {...item}
              active={location.pathname === item.path}
            />
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header title={title} />
        <main className="flex-1 overflow-auto p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;