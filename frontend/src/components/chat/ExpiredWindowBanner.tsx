import { Button } from "@/src/elements/ui/button";
import { LayoutTemplate, Lock, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

interface ExpiredWindowBannerProps {
  contactId: string;
  isAgent: boolean;
  isNew?: boolean;
}

const ExpiredWindowBanner: React.FC<ExpiredWindowBannerProps> = ({ contactId, isAgent, isNew = false }) => {
  const router = useRouter();

  const handleRedirect = () => {
    if (isAgent) return;
    router.push(`/campaigns/create?contact_id=${contactId}`);
  };

  return (
    <div className="p-2 px-5 dark:bg-(--table-hover) border-t border-gray-200 dark:border-(--card-border-color) flex-wrap flex items-center justify-between animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="">
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 pb-1">
          {isNew ? <Sparkles size={16} className="text-primary" /> : <Lock size={16} />}
          <p className="text-sm font-medium">{isNew ? "Start a new conversation" : "The 24-hour service window has closed."}</p>
        </div>
        <p className="text-[11px] text-slate-400 dark:text-slate-500 max-w-md pb-2">
          {isNew ? "To begin chatting, you must first send a template message." : "To resume the conversation, you must send a template message."}
          {isAgent ? " Please contact an administrator to initiate a campaign." : " Select a template to re-engage with the customer."}
        </p>
      </div>

      {!isAgent ? (
        <Button onClick={handleRedirect} className="bg-primary text-white hover:bg-primary/90 flex items-center gap-2 px-6 h-10 rounded-md shadow-lg shadow-primary/20 transition-all active:scale-95">
          <LayoutTemplate size={18} />
          <span className="text-xs font-medium tracking-widest">Send Template</span>
        </Button>
      ) : (
        <div className="px-6 py-2.5 rounded-xl bg-slate-200 dark:bg-white/5 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest border border-slate-300 dark:border-white/10 opacity-70 cursor-not-allowed">Campaign Access Restricted</div>
      )}
    </div>
  );
};

export default ExpiredWindowBanner;
