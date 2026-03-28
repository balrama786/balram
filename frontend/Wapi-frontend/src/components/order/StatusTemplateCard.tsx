/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useUpsertStatusTemplateMutation, StatusTemplate } from "@/src/redux/api/orderTemplateApi";
import { useState, useRef, useEffect, useCallback } from "react";
import { Switch } from "@/src/elements/ui/switch";
import { Button } from "@/src/elements/ui/button";
import { toast } from "sonner";
import { Check, ChevronDown, ChevronUp, Info } from "lucide-react";
import { cn } from "@/src/lib/utils";

const TEMPLATE_VARIABLES = [
  { key: "customer_name", label: "Customer Name", description: "Contact's full name" },
  { key: "wa_order_id", label: "WhatsApp Order ID", description: "The WhatsApp-assigned order ID" },
  { key: "status", label: "Order Status", description: "Current status of the order" },
  { key: "items_summary", label: "Items Summary", description: "Short text of ordered items & qty" },
  { key: "total_price", label: "Total Price", description: "Total value of the order" },
  { key: "currency", label: "Currency", description: "Order currency (e.g. INR, USD)" },
];

interface ParsedSegment {
  text: string;
  isVariable: boolean;
}

function parseTemplate(template: string): ParsedSegment[] {
  const segments: ParsedSegment[] = [];
  const regex = /\{\{(.*?)\}\}/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(template)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ text: template.slice(lastIndex, match.index), isVariable: false });
    }
    segments.push({ text: match[1].trim(), isVariable: true });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < template.length) {
    segments.push({ text: template.slice(lastIndex), isVariable: false });
  }

  return segments;
}

interface StatusTemplateCardProps {
  index: number;
  statusKey: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  existing?: StatusTemplate;
}

const StatusTemplateCard = ({ index, statusKey, label, description, icon, color, existing }: StatusTemplateCardProps) => {
  const [isExpanded, setIsExpanded] = useState(index === 0);
  const [isActive, setIsActive] = useState(existing?.is_active ?? false);
  const [messageTemplate, setMessageTemplate] = useState(existing?.message_template ?? "");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [caretPos, setCaretPos] = useState(0);
  const [filterText, setFilterText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [upsert, { isLoading: isSaving }] = useUpsertStatusTemplateMutation();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsActive(existing?.is_active ?? false);
    setMessageTemplate(existing?.message_template ?? "");
  }, [existing]);

  const detectSuggestionTrigger = useCallback((value: string, pos: number) => {
    const before = value.slice(0, pos);
    const lastOpen = before.lastIndexOf("{{");
    if (lastOpen === -1) {
      setShowSuggestions(false);
      return;
    }

    const afterOpen = before.slice(lastOpen + 2);
    if (afterOpen.includes("}}")) {
      setShowSuggestions(false);
      return;
    }

    setFilterText(afterOpen.toLowerCase());
    setShowSuggestions(true);
  }, []);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    const pos = e.target.selectionStart ?? val.length;
    setMessageTemplate(val);
    setCaretPos(pos);
    detectSuggestionTrigger(val, pos);
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const pos = textareaRef.current?.selectionStart ?? 0;
    setCaretPos(pos);
    detectSuggestionTrigger(messageTemplate, pos);
  };

  const insertVariable = (varKey: string) => {
    const before = messageTemplate.slice(0, caretPos);
    const lastOpen = before.lastIndexOf("{{");
    const newBefore = before.slice(0, lastOpen) + `{{${varKey}}}`;
    const after = messageTemplate.slice(caretPos);
    const newValue = newBefore + after;
    setMessageTemplate(newValue);
    setShowSuggestions(false);

    setTimeout(() => {
      textareaRef.current?.focus();
      const newPos = newBefore.length;
      textareaRef.current?.setSelectionRange(newPos, newPos);
    }, 0);
  };

  const handleSave = async () => {
    try {
      const res = await upsert({
        status: statusKey,
        message_template: messageTemplate,
        is_active: isActive,
      }).unwrap();

      if (res.success) {
        toast.success(`Template for "${label}" saved!`);
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save template");
    }
  };

  const filteredVars = TEMPLATE_VARIABLES.filter((v) => v.key.includes(filterText) || v.label.toLowerCase().includes(filterText));

  const previewSegments = parseTemplate(messageTemplate);

  return (
    <div className={cn("rounded-lg border bg-white dark:bg-(--card-color) shadow-sm transition-all duration-300", isExpanded ? "border-primary/30 dark:border-primary/20 shadow-primary/10 shadow-md" : "border-slate-100 dark:border-(--card-border-color)")}>
      <div className="flex items-center justify-between flex-wrap p-5 cursor-pointer select-none hover:bg-slate-50/70 dark:hover:bg-white/5 transition-colors" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
          <div>
            <h3 className="text-sm font-black text-slate-800 dark:text-white">{label}</h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">{description}</p>
          </div>
        </div>
        <div className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-2.5">
            <Switch checked={isActive} onCheckedChange={setIsActive} className="data-[state=checked]:bg-primary" />
            <span className={cn("text-xs font-bold", isActive ? "text-primary" : "text-slate-400")}>{isActive ? "Active" : "Inactive"}</span>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full w-8 h-8 text-slate-400" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-slate-100 dark:border-(--card-border-color) p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-start gap-2 mb-5 p-3.5 bg-primary/5 dark:bg-primary/10 rounded-xl border border-primary/10">
                <Info size={15} className="text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Write your message template below. Use <code className="bg-primary/10 text-primary px-1 py-0.5 rounded font-mono text-[11px]">{"{{variable}}"}</code> for dynamic values. Type <kbd className="bg-slate-100 dark:bg-(--dark-body) px-1.5 py-0.5 rounded text-[11px] font-mono border border-slate-200 dark:border-(--card-border-color)">{`{{`}</kbd> to see suggestions.
                </p>
              </div>
              <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Message Template</label>
              <div className="relative">
                <textarea ref={textareaRef} value={messageTemplate} onChange={handleTextareaChange} onKeyUp={handleKeyUp} onBlur={() => setTimeout(() => setShowSuggestions(false), 150)} placeholder={`Hi {{customer_name}}, your order {{wa_order_id}} is now ${statusKey.replace(/_/g, " ")}...`} rows={5} className="w-full resize-none rounded-xl bg-(--input-color) dark:bg-(--page-body-bg) border border-slate-200 dark:border-(--card-border-color) p-4 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-primary dark:focus:border-primary transition-colors font-mono leading-relaxed placeholder:text-slate-300 dark:placeholder:text-slate-600" />

                {showSuggestions && filteredVars.length > 0 && (
                  <div className="absolute bottom-full custom-scrollbar max-h-50 overflow-auto left-0 right-0 mb-2 bg-white dark:bg-(--card-color) rounded-xl border border-slate-200 dark:border-(--card-border-color) shadow-2xl z-50">
                    <div className="p-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 mb-1">Insert variable</p>
                      {filteredVars.map((v) => (
                        <button key={v.key} onMouseDown={() => insertVariable(v.key)} className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors flex items-center justify-between group">
                          <div>
                            <span className="text-xs font-black text-primary font-mono">{`{{${v.key}}}`}</span>
                            <p className="text-[11px] text-slate-400 mt-0.5">{v.description}</p>
                          </div>
                          <Check size={14} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5">
                {TEMPLATE_VARIABLES.map((v) => (
                  <button
                    key={v.key}
                    onClick={() => {
                      const pos = textareaRef.current?.selectionStart ?? messageTemplate.length;
                      const before = messageTemplate.slice(0, pos);
                      const after = messageTemplate.slice(pos);
                      setMessageTemplate(before + `{{${v.key}}}` + after);
                      setTimeout(() => textareaRef.current?.focus(), 0);
                    }}
                    className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg bg-primary/8 dark:bg-primary/15 text-primary hover:bg-primary/15 transition-colors border border-primary/15"
                  >
                    {`{{${v.key}}}`}
                  </button>
                ))}
              </div>

              <Button onClick={handleSave} disabled={isSaving || !messageTemplate.trim()} className="w-full mt-12 h-11 bg-primary text-white font-bold rounded-xl shadow-sm shadow-primary/20 active:scale-95 transition-all">
                {isSaving ? "Saving..." : "Save Template"}
              </Button>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Live Preview</label>
              <div className="flex justify-center p-4 bg-slate-50 dark:bg-black/20 rounded-2xl">
                <div className="w-60 h-full bg-slate-200 dark:bg-(--card-color) rounded-lg p-3 shadow-xl border border-slate-300 dark:border-(--card-border-color)">
                  <div className="flex items-center justify-between px-2 mb-2">
                    <span className="text-[8px] font-bold text-slate-600 dark:text-slate-300">9:41</span>
                    <div className="flex gap-1">
                      <div className="w-3 h-1.5 rounded-sm bg-slate-500 dark:bg-slate-400"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-500 dark:bg-slate-400"></div>
                    </div>
                  </div>
                  <div className="bg-primary rounded-t-lg px-3 py-2 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-white/30 flex items-center justify-center text-white text-[9px] font-bold">W</div>
                    <div>
                      <p className="text-white text-[10px] font-bold leading-none">Customer</p>
                      <p className="text-white/70 text-[8px]">online</p>
                    </div>
                  </div>
                  <div className="bg-[#ECE5DD] dark:bg-(--dark-body) rounded-b-lg p-3 pb-0 min-h-62.5 h-62.5 overflow-auto custom-scrollbar">
                    {messageTemplate.trim() ? (
                      <div className="bg-white dark:bg-(--page-body-bg) rounded-lg rounded-tl-none px-3 py-2 shadow-sm max-w-full">
                        <p className="text-[11px] text-slate-700 dark:text-slate-200 leading-relaxed wrap-break-word">
                          {previewSegments.map((seg, i) =>
                            seg.isVariable ? (
                              <span key={i} className="font-black text-primary text-[11px]">
                                [{seg.text}]
                              </span>
                            ) : (
                              <span key={i}>{seg.text}</span>
                            )
                          )}
                        </p>
                        <p className="text-[9px] text-slate-400 text-right mt-1">9:41 ✓</p>
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-400 text-center mt-8 italic">Template preview will appear here...</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusTemplateCard;
