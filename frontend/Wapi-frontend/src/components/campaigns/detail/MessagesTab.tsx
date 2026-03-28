import { Badge } from "@/src/elements/ui/badge";
import { TabsContent } from "@/src/elements/ui/tabs";
import { useAppSelector } from "@/src/redux/hooks";
import { Recipient } from "@/src/types/components";
import { cn } from "@/src/utils";
import { maskSensitiveData } from "@/src/utils/masking";
import { FileText } from "lucide-react";

export const MessagesTab = ({ recipients, active }: { recipients: Recipient[]; active: boolean }) => {
  const { is_demo_mode } = useAppSelector((state) => state.setting);

  return (
    <TabsContent active={active} className="space-y-4 mt-0 focus:outline-none min-h-52">
      <div className="bg-white dark:bg-(--card-color) rounded-lg border border-slate-200 dark:border-(--card-border-color) overflow-hidden shadow-sm">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-150">
            <thead className="bg-slate-50 dark:bg-(--dark-sidebar) border-b border-slate-100 dark:border-(--card-border-color)">
              <tr>
                <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-wider">Recipient</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-wider text-center [@media(max-width:750px)]:min-w-25">Sent At</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-wider text-center">Delivered</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-wider text-center">Read</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-wider text-right whitespace-nowrap">Error Info</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-(--card-border-color)">
              {recipients?.map((rec, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-(--table-hover) transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{maskSensitiveData(rec.phone_number, "phone", is_demo_mode) || "Unknown"}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Mobile</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className={cn("uppercase text-[10px] font-black py-0.5 px-2 border-2", rec.status === "sent" ? "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-950/30 dark:border-blue-900/50" : rec.status === "delivered" ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/30 dark:border-emerald-900/50" : rec.status === "read" ? "bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-950/30 dark:border-purple-900/50" : rec.status === "failed" ? "bg-red-50 text-red-600 border-red-100 dark:bg-red-950/30 dark:border-red-900/50" : "bg-slate-50 text-slate-600 dark:text-gray-400 border-slate-100 dark:bg-(--page-body-bg) dark:border-(--card-border-color)")}>
                      {rec.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500 font-bold text-center">{rec.sent_at ? new Date(rec.sent_at).toLocaleTimeString() : "-"}</td>
                  <td className="px-6 py-4 text-xs text-slate-500 font-bold text-center">{rec.delivered_at ? new Date(rec.delivered_at).toLocaleTimeString() : "-"}</td>
                  <td className="px-6 py-4 text-xs text-slate-500 font-bold text-center">{rec.read_at ? new Date(rec.read_at).toLocaleTimeString() : "-"}</td>
                  <td className="px-6 py-4 text-right">{rec.failure_reason ? <div className="inline-flex items-center gap-1.5 px-2 py-1 text-red-600 text-[10px] font-bold max-w-40">{rec.failure_reason}</div> : <span className="text-slate-300">-</span>}</td>
                </tr>
              ))}
              {(!recipients || recipients.length === 0) && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3 opacity-50">
                      <FileText size={32} className="text-slate-300" />
                      <p className="text-slate-500 font-bold text-sm">No message logs found for this campaign.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </TabsContent>
  );
};
