import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState = ({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-20 px-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
    <div className="w-20 h-20 rounded-full bg-accent/60 flex items-center justify-center mb-6 animate-in zoom-in-50 duration-700">
      <Icon className="w-10 h-10 text-primary/70" />
    </div>
    <h3 className="text-xl font-semibold mb-2 text-foreground">{title}</h3>
    {description && <p className="text-sm text-muted-foreground mb-6 text-center max-w-xs leading-relaxed">{description}</p>}
    {actionLabel && onAction && (
      <Button size="default" onClick={onAction} className="bg-identity-gradient text-white hover:opacity-90 mt-1">{actionLabel}</Button>
    )}
  </div>
);

export default EmptyState;
