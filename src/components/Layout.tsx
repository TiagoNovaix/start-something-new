import React, { useEffect } from "react";
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
  Menu,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Receipt, label: "Lançamentos", path: "/lancamentos" },
  { icon: FileBarChart, label: "DRE", path: "/dre" },
  { icon: CalendarDays, label: "Reservas", path: "/reservas" },
  { icon: Users, label: "Sócios", path: "/socios" },
  { icon: Lock, label: "Fechamento", path: "/fechamento" },
  { icon: Settings, label: "Configurações", path: "/configuracoes" },
];

const SidebarItem = ({ icon: Icon, label, path, active, onClick }: { icon: any; label: string; path: string; active: boolean; onClick?: () => void }) => (
  <Link
    to={path}
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors border-l-2 ${
      active
        ? "bg-accent border-primary text-foreground"
        : "border-transparent text-secondary hover:bg-accent/50"
    }`}
  >
    <Icon className="w-5 h-5" />
    <span>{label}</span>
  </Link>
);

const SidebarContent = ({ pathname, onItemClick }: { pathname: string; onItemClick?: () => void }) => (
  <>
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
          active={pathname === item.path}
          onClick={onItemClick}
        />
      ))}
    </nav>
  </>
);

const Header = ({ title, showMenuButton, onMenuClick }: { title: string; showMenuButton?: boolean; onMenuClick?: () => void }) => (
  <header className="h-[56px] border-b bg-card flex items-center justify-between px-4 md:px-6 shrink-0">
    <div className="flex items-center gap-2">
      {showMenuButton && (
        <Button variant="ghost" size="icon" onClick={onMenuClick} className="md:hidden">
          <Menu className="w-5 h-5" />
        </Button>
      )}
      <h1 className="font-bold text-foreground text-sm md:text-base">{title}</h1>
    </div>
    <div className="flex items-center gap-2 md:gap-4">
      <button className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1.5 rounded-md border text-xs md:text-sm font-medium text-secondary hover:bg-accent/50">
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

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const currentItem = menuItems.find((item) => item.path === location.pathname);
  const title = currentItem?.label || "Página";

  useEffect(() => {
    document.title = `Control Tower — ${title}`;
  }, [title]);

  if (isMobile) {
    return (
      <div className="flex flex-col h-screen w-full bg-background overflow-hidden">
        <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
          <SheetContent side="left" className="w-[240px] p-0 bg-card border-r">
            <SidebarContent pathname={location.pathname} onItemClick={() => setDrawerOpen(false)} />
          </SheetContent>
        </Sheet>
        <Header title={title} showMenuButton onMenuClick={() => setDrawerOpen(true)} />
        <main className="flex-1 overflow-auto p-4 bg-background">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <aside className="w-[240px] bg-card border-r flex flex-col shrink-0">
        <SidebarContent pathname={location.pathname} />
      </aside>
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
