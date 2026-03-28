"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/src/elements/ui/dialog";
import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { cn } from "@/src/lib/utils";
import { ReplyMaterial, ReplyMaterialType, ReplyMaterialSidebarItem } from "@/src/types/reply-material";
import { Upload, X, Loader2, FileText, Image as ImageIcon, FileArchive, Video, Smile, Zap, Layout, ShoppingBag, Bot } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Label } from "@/src/elements/ui/label";

const PLACEHOLDER: Record<ReplyMaterialType, string> = {
  text: "Enter your quick-reply message…",
  image: "",
  document: "",
  video: "",
  sticker: "",
  sequence: "",
  template: "",
  catalog: "",
  chatbot: "",
};

const TYPE_ICON: Record<ReplyMaterialType, React.ReactNode> = {
  text: <FileText size={18} className="text-primary" />,
  image: <ImageIcon size={18} className="text-blue-400" />,
  document: <FileArchive size={18} className="text-amber-400" />,
  video: <Video size={18} className="text-purple-400" />,
  sticker: <Smile size={18} className="text-pink-400" />,
  sequence: <Zap size={18} className="text-yellow-400" />,
  template: <Layout size={18} className="text-indigo-400" />,
  catalog: <ShoppingBag size={18} className="text-emerald-400" />,
  chatbot: <Bot size={18} className="text-cyan-400" />,
};

interface ReplyMaterialFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
  isLoading: boolean;
  config: ReplyMaterialSidebarItem;
  editItem?: ReplyMaterial | null;
}

const ReplyMaterialFormModal: React.FC<ReplyMaterialFormModalProps> = ({ isOpen, onClose, onSubmit, isLoading, config, editItem }) => {
  const isEditMode = !!editItem;

  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(editItem?.name ?? "");
      setContent(editItem?.content ?? "");
      setFile(null);
      setPreview(editItem?.file_url ?? null);
    }
  }, [isOpen, editItem]);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleFileChange = (incoming: File | null) => {
    if (!incoming) return;
    setFile(incoming);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFileChange(dropped);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("name", name.trim());
    fd.append("type", config.type);
    if (config.type === "text") {
      fd.append("content", content.trim());
    }
    if (file) {
      fd.append("file", file);
    }
    await onSubmit(fd);
  };

  const resetAndClose = () => {
    setName("");
    setContent("");
    setFile(null);
    setPreview(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={!isLoading ? resetAndClose : undefined}>
      <DialogContent className="sm:max-w-lg p-0! overflow-hidden dark:border-(--card-border-color) bg-white dark:bg-(--card-color) rounded-lg shadow-2xl">
        <DialogHeader className="px-6 pt-6 pb-0">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-lg bg-primary/5 dark:bg-primary/10 flex items-center justify-center">{TYPE_ICON[config.type]}</div>
            <div>
              <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                {isEditMode ? "Edit" : "Add"} {config.label}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-400 font-medium mt-0.5">{isEditMode ? "Update the details below" : `Create a new ${config.label.toLowerCase()} quick reply`}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-6 pb-6 pt-0 space-y-4">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-slate-500">Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Welcome message" required disabled={isLoading} className="h-11 rounded-lg border-slate-200 dark:border-(--card-border-color) bg-slate-50 dark:bg-(--dark-body) focus:border-primary" />
          </div>

          {config.type === "text" && (
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-500">Message</Label>
              <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder={PLACEHOLDER.text} rows={4} required disabled={isLoading} className="w-full px-3 py-2.5 text-sm rounded-lg border border-slate-200 dark:border-(--card-border-color) bg-slate-50 dark:bg-(--dark-body) focus:outline-none focus:border-primary resize-none transition-colors text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600" />
            </div>
          )}

          {config.hasFile && (
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-500">{isEditMode ? "Replace File (optional)" : "Upload File"}</Label>

              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={cn("relative h-36 rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all", dragOver ? "border-primary bg-primary/5" : "border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-(--dark-body) hover:border-primary/40 hover:bg-primary/5")}
              >
                {preview && config.type === "image" ? (
                  <Image src={preview} alt="preview" width={100} height={100} className="absolute inset-0 w-full h-full object-cover rounded-lg" />
                ) : preview && config.type !== "image" ? (
                  <div className="flex flex-col items-center gap-1.5 text-slate-400">
                    {TYPE_ICON[config.type]}
                    <p className="text-xs font-semibold">{file?.name ?? "File selected"}</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <Upload size={24} />
                    <p className="text-xs font-semibold text-center px-4">
                      Drag & drop or <span className="text-primary">browse</span>
                    </p>
                    <p className="text-[10px] text-slate-300 dark:text-slate-600">{config.accept ?? "Any file"}</p>
                  </div>
                )}

                {(file || preview) && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                      setPreview(null);
                    }}
                    className="absolute top-2 ltr:right-2 rtl:left-2 w-6 h-6 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-red-500 shadow-sm z-10"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>

              <input ref={fileInputRef} type="file" accept={config.accept} className="hidden" onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)} />
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={resetAndClose} disabled={isLoading} className="flex-1 h-11 rounded-lg border-slate-200 dark:border-(--card-border-color) text-slate-600 dark:text-slate-300">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1 h-11 rounded-lg bg-primary text-white font-semibold shadow-lg shadow-primary/20 active:scale-95 transition-all">
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin ltr:mr-2 rtl:ml-2" />
                  Saving…
                </>
              ) : isEditMode ? (
                "Save Changes"
              ) : (
                "Create"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReplyMaterialFormModal;
