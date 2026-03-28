"use client";

import { API_DOCS } from "@/src/constants/api-docs";
import { cn } from "@/src/lib/utils";
import { AlertCircle, BadgeCheck, Check, Copy, Terminal } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import CodeBlock from "./CodeBlock";
import { toast } from "sonner";

interface ApiDocViewerProps {
  sectionId: string;
}

const ApiDocViewer: React.FC<ApiDocViewerProps> = ({ sectionId }) => {
  const { t } = useTranslation();
  const section = API_DOCS.find((s) => s.id === sectionId);

  const handleCopy = (e: React.MouseEvent, value: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(value);
    toast.success("Copied to clipboard");
  };

  if (!section) {
    if (sectionId === "dashboard") {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-6">
          <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-(--dark-body) flex items-center justify-center text-slate-400 dark:text-gray-600 shadow-inner">
            <AlertCircle size={48} />
          </div>
          <div className="max-w-md">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t("developer.api_dashboard")}</h3>
            <p className="text-slate-500 dark:text-gray-400 leading-relaxed">{t("developer.pending_desc")}</p>
          </div>
        </div>
      );
    }
    return <div className="p-8 text-center text-slate-500">{t("developer.no_data")}</div>;
  }

  return (
    <div className="p-4 md:p-8 pb-20 overflow-y-auto h-full space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 custom-scrollbar">
      <div className="space-y-4">
        <div className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-start gap-3 flex-wrap">
          <Terminal className="text-primary h-10 w-10 p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg shrink-0" />
          <div className="flex flex-col min-w-0">
            {section.title}
            <div className="text-sm text-slate-600 dark:text-gray-400 max-w-2xl font-normal">{section.description}</div>
          </div>
        </div>
      </div>

      <div className="space-y-16">
        {section.endpoints.map((endpoint, index) => (
          <div key={index} className="space-y-6 group">
            <div className="flex items-center gap-4 mb-3.5">
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-(--card-color) flex items-center justify-center text-slate-500 dark:text-gray-400 font-bold text-xs shadow-xs">{index + 1}</div>
              <h2 className="text-[17px] font-medium text-slate-800 dark:text-white transition-colors">{endpoint.title}</h2>
              {endpoint.description && <span className="text-xs font-medium px-2.5 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full border border-blue-100 dark:border-blue-500/20">{endpoint.description}</span>}
            </div>

            <div className="bg-white dark:bg-(--card-color) border border-slate-200 dark:border-(--card-border-color) rounded-xl md:rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-(--card-border-color) bg-slate-50/50 dark:bg-black/10 flex items-center gap-4 flex-wrap">
                <span className={cn("px-3 py-1 rounded-lg text-xs font-medium tracking-widest text-white shadow-sm", endpoint.method === "POST" ? "bg-primary shadow-emerald-500/20" : endpoint.method === "GET" ? "bg-blue-500 shadow-blue-500/20" : "bg-orange-500 shadow-orange-500/20")}>{endpoint.method}</span>
                <div className="flex-1 flex items-center gap-4">
                  <code className="text-sm font-bold text-slate-700 dark:text-gray-300 font-mono truncate">{endpoint.path}</code>
                  <button onClick={(e) => handleCopy(e, endpoint.path)} className="p-2 hover:bg-emerald-50 dark:hover:bg-(--table-hover) rounded-lg transition-all text-slate-400 hover:text-primary shrink-0" title="Copy api">
                    <Copy size={15} />
                  </button>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider">
                  <BadgeCheck size={14} className="text-emerald-500" />
                  Auth Required
                </div>
              </div>

              <div className="p-3 md:p-6 space-y-6 md:space-y-8">
                {endpoint.payload && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Terminal size={16} className="text-primary" /> Request Body
                    </h4>
                    <CodeBlock code={JSON.stringify(endpoint.payload, null, 2)} />
                  </div>
                )}

                {endpoint.response && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Check size={16} className="text-emerald-500" /> Example Response
                    </h4>
                    <CodeBlock code={JSON.stringify(endpoint.response, null, 2)} showCopy={false} />
                  </div>
                )}

                {endpoint.fields && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">Field Reference</h4>
                    <div className="border border-slate-200 dark:border-(--card-border-color) rounded-xl overflow-hidden shadow-xs">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 dark:bg-black/20 text-slate-500 dark:text-gray-400 uppercase text-[10px] font-black tracking-wider border-b border-slate-200 dark:border-(--card-border-color)">
                          <tr>
                            <th className="px-4 py-3">Field</th>
                            <th className="px-4 py-3">Type</th>
                            <th className="px-4 py-3">Req</th>
                            <th className="px-4 py-3">Info</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-(--card-border-color) dark:text-gray-300">
                          {endpoint.fields.map((field, fIdx) => (
                            <tr key={fIdx} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                              <td className="px-4 py-3 font-mono font-bold text-primary">{field.name}</td>
                              <td className="px-4 py-3 text-xs text-slate-500">{field.type}</td>
                              <td className="px-4 py-3">{field.required ? <span className="text-xs text-red-500 font-bold">YES</span> : <span className="text-xs text-slate-400">NO</span>}</td>
                              <td className="px-4 py-3 text-slate-600 dark:text-gray-400 italic">{field.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApiDocViewer;
