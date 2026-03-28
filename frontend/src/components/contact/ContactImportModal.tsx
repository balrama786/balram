"use client";

import { Button } from "@/src/elements/ui/button";
import { CheckCircle2, Download, FileSpreadsheet, Loader2, Upload, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

interface ContactImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (file: File) => Promise<void>;
  isLoading: boolean;
}

const ContactImportModal = ({ isOpen, onClose, onImport, isLoading }: ContactImportModalProps) => {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith(".xlsx") || file.name.endsWith(".csv") || file.name.endsWith(".xls"))) {
      setSelectedFile(file);
    } else {
      toast.error("Please upload a valid .xlsx or .csv file");
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;
    await onImport(selectedFile);
    setSelectedFile(null);
  };

  const handleClose = () => {
    if (isLoading) return;
    setSelectedFile(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-150 flex items-center justify-center">
      <div className="absolute inset-0 bg-[#00000082]" onClick={handleClose} />

      <div className="relative z-151 w-full max-w-lg mx-4 bg-white dark:bg-(--dark-body) rounded-2xl shadow-2xl border border-slate-100 dark:border-(--card-border-color) overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-(--card-border-color)">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-xl">
              <Upload size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Import Contacts</h2>
              <p className="text-xs text-slate-400 font-medium">Upload an Excel or CSV file to import contacts</p>
            </div>
          </div>
          <button onClick={handleClose} disabled={isLoading} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-(--table-hover) text-slate-400 hover:text-slate-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="sm:p-6 p-4 space-y-5">
          <div className="bg-primary/5 border border-primary/20  rounded-lg p-4 space-y-3">
            <div className="flex items-start gap-3">
              <FileSpreadsheet size={18} className="text-primary shrink-0 mt-0.5" />
              <div className="space-y-1 text-sm">
                <p className="font-bold text-primary dark:text-primary">Before importing, please note:</p>
                <ul className="text-primary dark:text-primary space-y-0.5 text-xs font-medium">
                  <li>
                    • File must be <span className="font-bold">.xlsx</span> or <span className="font-bold">.csv</span> format
                  </li>
                  <li>
                    • Required columns: <span className="font-bold">name</span>, <span className="font-bold">phone_number</span>
                  </li>
                  <li>• Optional: email, tags, status, source</li>
                  <li>
                    • <span>Processing runs in the background</span>
                  </li>
                </ul>
              </div>
            </div>
            <a href="/assets/files/Demo_contacts.xlsx" download="contacts_template.xlsx" target="_blank" rel="noreferrer" className="flex items-center gap-2 w-full justify-center py-2 px-4 rounded-lg bg-primary/10 dark:bg-(--dark-body) border border-primary/30  text-primary  hover:bg-primary/5  transition-colors text-xs font-bold">
              <Download size={14} />
              Download Sample Template (contacts.xlsx)
            </a>
          </div>

          <div
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => !isLoading && fileInputRef.current?.click()}
            className={`relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 cursor-pointer transition-all duration-200
              ${dragOver ? "border-primary bg-primary/5 scale-[1.01]" : "border-slate-200 dark:border-(--card-border-color) hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-(--table-hover)"}
              ${selectedFile ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/20" : ""}
            `}
          >
            {selectedFile ? (
              <>
                <CheckCircle2 size={36} className="text-emerald-500" />
                <div className="text-center">
                  <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">{selectedFile.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{(selectedFile.size / 1024).toFixed(1)} KB — Click to change</p>
                </div>
              </>
            ) : (
              <>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${dragOver ? "bg-primary/20" : "bg-slate-100 dark:bg-(--table-hover)"}`}>
                  <Upload size={22} className={dragOver ? "text-primary" : "text-slate-400"} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{dragOver ? "Drop your file here" : "Drag & drop or click to upload"}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Supports .xlsx, .xls, .csv</p>
                </div>
              </>
            )}
            <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleFileChange} />
          </div>
        </div>

        <div className="flex items-center gap-3 px-6 pb-6 flex-wrap">
          <Button variant="outline" onClick={handleClose} disabled={isLoading} className="flex-1 h-11 rounded-lg font-bold dark:border-none dark:bg-(--page-body-bg)">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!selectedFile || isLoading} className="flex-1 h-11 rounded-lg font-bold bg-primary text-white gap-2">
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Importing...
              </>
            ) : (
              <>
                <Upload size={16} /> Import Contacts
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContactImportModal;
