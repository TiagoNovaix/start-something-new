import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logoSoluv from "@/assets/logo-soluv.jpg";
import {
  LayoutDashboard,
  Receipt,
  FileBarChart,
  CalendarDays,
  Users,
  Lock,
  Settings,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronDown,
  LogOut,
  User,
} from "lucide-react";
import UserAvatar from "@/components/UserAvatar";
import { useProfile } from "@/hooks/useProfile";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Receipt, label: "Lançamentos", path: "/lancamentos" },
  { icon: FileBarChart, label: "DRE", path: "/dre" },
  { icon: CalendarDays, label: "Reservas", path: "/reservas" },
  { icon: Users, label: "Sócios", path: "/socios" },
  { icon: Lock, label: "Fechamento", path: "/fechamento" },
  { icon: Settings, label: "Configurações", path: "/configuracoes" },
];

const SIDEBAR_KEY = "soluv-sidebar-collapsed";

const SidebarItem = ({
  icon: Icon, label, path, active, collapsed, onClick,
}: {
  icon: any; label: string; path: string; active: boolean; collapsed: boolean; onClick?: () => void;
}) => {
  const content = (
    <Link
      to={path}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-md mx-2 transition-all duration-200 border-l-2",
        active
          ? "bg-[rgba(139,92,246,0.12)] border-primary text-foreground"
          : "border-transparent text-muted-foreground hover:bg-[rgba(255,255,255,0.04)] hover:text-foreground",
        collapsed && "justify-center px-0 mx-1"
      )}
    >
      <Icon className={cn("w-5 h-5 shrink-0", active && "text-primary")} />
      {!collapsed && <span className="truncate">{label}</span>}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right" className="font-medium">{label}</TooltipContent>
      </Tooltip>
    );
  }
  return content;
};

const SidebarNav = ({ pathname, collapsed, onItemClick }: { pathname: string; collapsed: boolean; onItemClick?: () => void }) => (
  <nav className="flex-1 mt-2 space-y-1">
    {menuItems.map((item) => (
      <SidebarItem key={item.path} {...item} active={pathname === item.path} collapsed={collapsed} onClick={onItemClick} />
    ))}
  </nav>
);

const UserDropdown = ({ user, signOut }: { user: any; signOut: () => void }) => {
  const navigate = useNavigate();
  const initials = user?.email?.slice(0, 2).toUpperCase() || "SF";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
          <Avatar className="w-8 h-8">
            <AvatarImage src="" />
            <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <div className="px-3 py-2">
          <p className="text-sm font-medium truncate">{user?.email || "Usuário"}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate("/perfil")}>
          <User className="w-4 h-4 mr-2" /> Perfil
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/configuracoes")}>
          <Settings className="w-4 h-4 mr-2" /> Configurações
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut} className="text-destructive focus:text-destructive">
          <LogOut className="w-4 h-4 mr-2" /> Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { user, signOut } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem(SIDEBAR_KEY) === "true"; } catch { return false; }
  });

  const currentItem = menuItems.find((item) => item.path === location.pathname);
  const title = currentItem?.label || "Página";

  useEffect(() => {
    document.title = `Financeiro Soluv — ${title}`;
  }, [title]);

  const toggleCollapse = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try { localStorage.setItem(SIDEBAR_KEY, String(next)); } catch {}
      return next;
    });
  };

  const Header = ({ showMenuButton }: { showMenuButton?: boolean }) => (
    <header className="h-14 border-b border-border bg-[#171923]/80 backdrop-blur-md flex items-center justify-between px-4 md:px-6 shrink-0">
      <div className="flex items-center gap-3">
        {showMenuButton && (
          <Button variant="ghost" size="icon" onClick={() => setDrawerOpen(true)} className="text-muted-foreground hover:text-foreground">
            <Menu className="w-5 h-5" />
          </Button>
        )}
        <span className="font-semibold text-sm text-foreground">{title}</span>
      </div>
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-xs font-medium text-muted-foreground hover:bg-[rgba(255,255,255,0.04)] transition-colors capitalize">
          {new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
        <UserDropdown user={user} signOut={signOut} />
      </div>
    </header>
  );

  if (isMobile) {
    return (
      <div className="flex flex-col h-screen w-full bg-background overflow-hidden">
        <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
          <SheetContent side="left" className="w-[260px] p-0 bg-card border-r border-border">
            <div className="p-5 pb-2">
              <img src={logoSoluv} alt="Soluv Financeiro" className="h-8 object-contain" />
            </div>
            <SidebarNav pathname={location.pathname} collapsed={false} onItemClick={() => setDrawerOpen(false)} />
          </SheetContent>
        </Sheet>
        <Header showMenuButton />
        <main className="flex-1 overflow-auto p-4 bg-background">{children}</main>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <aside className={cn(
        "bg-card border-r border-border flex flex-col shrink-0 transition-all duration-200 ease-in-out",
        collapsed ? "w-[72px]" : "w-[240px]"
      )}>
        <div className={cn("flex items-center h-14 border-b border-border shrink-0", collapsed ? "justify-center px-2" : "justify-between px-5")}>
          {!collapsed && <img src={logoSoluv} alt="Soluv Financeiro" className="h-7 object-contain" />}
          <Button variant="ghost" size="icon" onClick={toggleCollapse} className="text-muted-foreground hover:text-foreground h-8 w-8">
            {collapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </Button>
        </div>
        <SidebarNav pathname={location.pathname} collapsed={collapsed} />
        <div className={cn("border-t border-border p-3 flex items-center gap-3", collapsed && "justify-center")}>
          <Avatar className="w-8 h-8 shrink-0">
            <AvatarImage src="" />
            <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
              {user?.email?.slice(0, 2).toUpperCase() || "SF"}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{user?.email || "Usuário"}</p>
              <p className="text-xs text-muted-foreground truncate">admin</p>
            </div>
          )}
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-auto p-6 bg-background">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
