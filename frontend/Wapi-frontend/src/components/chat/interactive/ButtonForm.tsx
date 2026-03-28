"use client";

import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { Textarea } from "@/src/elements/ui/textarea";
import { SendMessagePayload } from "@/src/types/components/chat";
import { Plus, Trash2 } from "lucide-react";
import React, { useState, useImperativeHandle, forwardRef } from "react";
import { toast } from "sonner";

export interface ButtonFormHandle {
  submit: () => Promise<void>;
}

interface ButtonFormProps {
  onSend: (payload: Partial<SendMessagePayload>) => Promise<void>;
  setIsSending: (val: boolean) => void;
}

const ButtonForm = forwardRef<ButtonFormHandle, ButtonFormProps>(({ onSend, setIsSending }, ref) => {
  const generateId = (prefix: string) => `${prefix}_${Math.random().toString(36).substring(2, 11)}`;

  const [buttonBody, setButtonBody] = useState("");
  const [buttons, setButtons] = useState([{ id: generateId("btn"), title: "" }]);

  useImperativeHandle(ref, () => ({
    submit: async () => {
      if (!buttonBody.trim()) {
        toast.error("Message body is required");
        return;
      }
      if (buttons.some(b => !b.title.trim())) {
        toast.error("All buttons must have a title");
        return;
      }

      setIsSending(true);
      try {
        await onSend({
          messageType: "interactive",
          type: "interactive",
          interactiveType: "button",
          message: buttonBody,
          buttonParams: buttons.map(b => ({ id: b.id, title: b.title })),
        });
        setButtonBody("");
        setButtons([{ id: generateId("btn"), title: "" }]);
      } finally {
        setIsSending(false);
      }
    }
  }));

  const handleAddButton = () => {
    if (buttons.length >= 3) {
      toast.error("Maximum 3 buttons allowed");
      return;
    }
    setButtons([...buttons, { id: generateId("btn"), title: "" }]);
  };

  const handleRemoveButton = (index: number) => {
    setButtons(buttons.filter((_, i) => i !== index));
  };

  const handleButtonTitleChange = (index: number, value: string) => {
    const newButtons = [...buttons];
    newButtons[index].title = value;
    setButtons(newButtons);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-semibold flex items-center gap-2">
          Message Body <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <Textarea
            placeholder="Enter the main message text..."
            value={buttonBody}
            onChange={(e) => setButtonBody(e.target.value)}
            className="min-h-30 resize-none bg-(--input-color) dark:bg-(--page-body-bg) border-slate-200 dark:border-(--card-border-color) focus:ring-primary focus:border-primary rounded-lgButton title (e.g. Yes, No, View More)"
            maxLength={1024}
          />
          <div className="absolute bottom-2 right-3 text-[10px] text-slate-400 font-medium">
            {buttonBody.length}/1024
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold flex items-center gap-2">
            Buttons ({buttons.length}/3)
          </label>
          {buttons.length < 3 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddButton}
              className="h-8 gap-1.5 text-xs font-bold border-dashed border-emerald-500/50 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10"
            >
              <Plus size={14} /> Add Button
            </Button>
          )}
        </div>

        <div className="space-y-3">
          {buttons.map((btn, index) => (
            <div key={btn.id} className="relative flex items-center gap-2">
              <div className="flex-none w-8 h-8 rounded-lg bg-slate-100 dark:bg-(--page-body-bg) flex items-center justify-center text-xs font-bold text-slate-500">
                #{index + 1}
              </div>
              <Input
                placeholder="Button title (e.g. Yes, No, View More)"
                value={btn.title}
                onChange={(e) => handleButtonTitleChange(index, e.target.value)}
                className="flex-1 bg-(--input-color) dark:bg-(--page-body-bg) border-slate-200 dark:border-(--card-border-color) focus:ring-primary rounded-lg"
                maxLength={20}
              />
              {buttons.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveButton(index)}
                  className="h-9 w-9 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg"
                >
                  <Trash2 size={16} />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

ButtonForm.displayName = "ButtonForm";

export default ButtonForm;
