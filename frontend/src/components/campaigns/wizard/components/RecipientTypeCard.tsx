import { cn } from "@/src/lib/utils";
import { ReactNode } from "react";

interface RecipientTypeCardProps {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  isSelected: boolean;
  onClick: () => void;
}

export const RecipientTypeCard = ({ id, title, description, icon, isSelected, onClick }: RecipientTypeCardProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group p-6 rounded-lg border transition-all duration-300 cursor-pointer text-center space-y-3 relative overflow-hidden",
        isSelected
          ? "bg-primary/5 border-primary shadow-lg shadow-primary/10"
          : "bg-white dark:bg-(--dark-sidebar) border-slate-100 dark:border-(--card-border-color) dark:hover:border-(--card-border-color) hover:border-slate-200"
      )}
    >
      <div
        className={cn(
          "mx-auto w-12 h-12 sm:w-14 sm:h-14 rounded-lg flex items-center justify-center transition-all duration-300",
          isSelected ? "bg-primary text-white scale-110" : "bg-slate-50 dark:bg-(--dark-body) text-slate-400 dark:group-hover:bg-(--dark-sidebar) group-hover:bg-slate-100"
        )}
      >
        {icon}
      </div>
      <h3 className={cn("font-bold text-sm uppercase tracking-wider truncate", isSelected ? "text-primary" : "text-slate-600 dark:text-gray-400")}>{title}</h3>
      <p className="text-[10px] text-slate-400 leading-relaxed truncate">{description}</p>
    </div>
  );
};
