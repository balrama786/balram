"use client";

import { Button } from "@/src/elements/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/elements/ui/dialog";
import { cn } from "@/src/lib/utils";
import { InteractiveMessageModalProps } from "@/src/types/components/chat";
import { AlertCircle, List, MessageSquare, Send, X } from "lucide-react";
import React, { useRef, useState } from "react";
import ButtonForm, { ButtonFormHandle } from "./interactive/ButtonForm";
import ListForm, { ListFormHandle } from "./interactive/ListForm";

const InteractiveMessageModal = ({ isOpen, onClose, type, onSend }: InteractiveMessageModalProps) => {
  const [isSending, setIsSending] = useState(false);

  // Refs for forms to trigger submission
  const buttonFormRef = useRef<ButtonFormHandle>(null);
  const listFormRef = useRef<ListFormHandle>(null);

  const handleSendTrigger = async () => {
    if (type === "button") {
      await buttonFormRef.current?.submit();
    } else {
      await listFormRef.current?.submit();
    }
    // onClose() is called inside the form's submit handler if successful
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="w-[95vw] 
  max-w-[calc(100%-2rem)]
  sm:w-full 
  p-0! 
  gap-0 
  overflow-hidden 
  border-none 
  shadow-2xl 
  bg-white 
  dark:bg-(--card-color)"
      >
        <div className={cn("h-1.5 w-full", type === "button" ? "bg-primary" : "bg-primary")} />

        <DialogHeader className="px-6 pt-6 pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn("p-2 rounded-lg", type === "button" ? "bg-emerald-50 dark:bg-emerald-500/10 text-primary" : "bg-blue-50 dark:bg-emerald-500/10 text-primary")}>{type === "button" ? <MessageSquare size={24} /> : <List size={24} />}</div>
              <div>
                <DialogTitle className="text-xl text-left font-bold tracking-tight text-slate-900 dark:text-white">{type === "button" ? "Button Message" : "List Message"}</DialogTitle>
                <p className="sm:text-sm text-xs text-left text-slate-500 dark:text-gray-500">Create an interactive {type} message for WhatsApp</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-lg hover:bg-slate-100 dark:hover:bg-(--table-hover) transition-colors">
              <X size={20} />
            </Button>
          </div>
        </DialogHeader>

        <div className="px-6 py-4 max-h-[70vh] overflow-y-auto custom-scrollbar">{type === "button" ? <ButtonForm ref={buttonFormRef} onSend={onSend} setIsSending={setIsSending} /> : <ListForm ref={listFormRef} onSend={onSend} setIsSending={setIsSending} />}</div>

        <div className="p-6 bg-slate-50 flex-wrap dark:bg-(--card-color) flex gap-3 items-center justify-between border-t border-slate-100 dark:border-(--card-border-color)">
          <div className="flex items-center gap-2 text-slate-500">
            <AlertCircle size={16} />
            <span className="text-[11px] font-medium leading-none text-slate-500 dark:text-gray-500">{type === "button" ? "Max 3 buttons. Text limit 20 chars per button." : "Max 10 sections with 10 rows each. Titles limit 24 chars."}</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={onClose} disabled={isSending} className="text-slate-600 dark:text-gray-500 hover:bg-slate-200 dark:hover:bg-(--table-hover)">
              Cancel
            </Button>
            <Button onClick={handleSendTrigger} disabled={isSending} className={cn("min-w-30 rounded-lg gap-2 font-bold shadow-lg transition-all active:scale-95", type === "button" ? "bg-primary text-white shadow-emerald-500/20" : "bg-primary hover:bg-primary text-white shadow-emerald-500/20")}>
              {isSending ? <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send size={16} />}
              Send {type === "button" ? "Buttons" : "List"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InteractiveMessageModal;
