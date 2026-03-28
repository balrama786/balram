import { Button } from "@/src/elements/ui/button";
import { CheckCircle2, RefreshCw } from "lucide-react";
import React from "react";
import { useUpdateChatStatusMutation } from "@/src/redux/api/chatApi";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ResolvedChatBannerProps {
  contactId: string;
  phoneNumberId: string;
}

const ResolvedChatBanner: React.FC<ResolvedChatBannerProps> = ({ contactId, phoneNumberId }) => {
  const [updateStatus, { isLoading }] = useUpdateChatStatusMutation();

  const handleReopen = async () => {
    try {
      await updateStatus({
        contact_id: contactId,
        whatsapp_phone_number_id: phoneNumberId,
        status: "open",
      }).unwrap();
      toast.success("Chat reopened successfully");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to reopen chat");
    }
  };

  return (
    <div className="p-4 px-6 dark:bg-(--table-hover) border-t border-gray-200 dark:border-(--card-border-color) flex-wrap flex items-center justify-between animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600">
          <CheckCircle2 size={24} />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900 dark:text-white">This chat has been marked as resolved.</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">To start chatting again, please reopen this conversation.</p>
        </div>
      </div>

      <Button onClick={handleReopen} disabled={isLoading} className="bg-primary text-white hover:bg-primary/90 flex items-center gap-2 px-6 h-10 rounded-md shadow-lg shadow-primary/20 transition-all active:scale-95">
        {isLoading ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
        <span className="text-xs font-medium tracking-widest">Reopen Chat</span>
      </Button>
    </div>
  );
};

export default ResolvedChatBanner;
