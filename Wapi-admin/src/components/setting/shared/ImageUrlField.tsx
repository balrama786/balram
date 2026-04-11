"use client";

import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { ImageUrlFieldProps } from "@/src/types/setting";
import { ExternalLink, ImageIcon, Link2, Pencil, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import Images from "@/src/shared/Image";

type Mode = "idle" | "url";

const ImageUrlField = ({ label, value, onChange, onFileChange, placeholder = "https://example.com/image.png", accept = "image/*" }: ImageUrlFieldProps) => {
  const [mode, setMode] = useState<Mode>("idle");
  const [tempUrl, setTempUrl] = useState(value);
  const [hasLocalFile, setHasLocalFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasImage = value && value.trim() !== "";

  const handleConfirmUrl = () => {
    if (tempUrl.trim()) {
      onChange(tempUrl.trim());
      // If switching to URL, clear any pending file
      if (hasLocalFile) {
        onFileChange?.(null);
        setHasLocalFile(false);
      }
    }
    setMode("idle");
  };

  const handleClear = () => {
    onChange("");
    setTempUrl("");
    setHasLocalFile(false);
    onFileChange?.(null);
    setMode("idle");
  };

  const handleEdit = () => {
    setTempUrl(value);
    setMode("url");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create a local object URL for preview
    const previewUrl = URL.createObjectURL(file);
    onChange(previewUrl);
    setHasLocalFile(true);
    onFileChange?.(file);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-1.5">
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</p>

      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" accept={accept} className="hidden" onChange={handleFileChange} />

      {/* URL input mode */}
      {mode === "url" && (
        <div className="flex gap-2 flex-wrap">
          <div className="relative flex-1">
            <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <Input value={tempUrl} onChange={(e) => setTempUrl(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleConfirmUrl()} placeholder={placeholder} autoFocus className="h-10 p-3 bg-(--input-color) dark:bg-page-body border-(--input-border-color) text-sm" />
          </div>
          <Button size="sm" onClick={handleConfirmUrl} className="h-10 px-4.5 py-5 bg-primary hover:bg-primary/90 text-white text-xs">
            Apply
          </Button>
          <Button size="sm" variant="outline" onClick={() => setMode("idle")} className="h-10 px-4.5 py-4 text-xs border-(--inpuy-border-color) dark:bg-page-body dark:border-none dark:hover:bg-(--table-hover)  ">
            Cancel
          </Button>
        </div>
      )}

      {/* Preview card */}
      {mode !== "url" && hasImage && (
        <div className="group relative flex items-center gap-3 p-3 bg-gray-50 dark:bg-page-body border border-(--input-border-color) dark:border-(--card-border-color) rounded-lg">
          <div className="w-12 h-12 rounded-lg bg-white dark:bg-(--card-color) border border-(--input-border-color) dark:border-none flex items-center justify-center overflow-hidden shrink-0">
            <Images
              src={value}
              alt={label}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate">{label}</p>
              {hasLocalFile && <span className="shrink-0 text-[10px] font-medium px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded">Pending upload</span>}
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{hasLocalFile ? "Will be uploaded on save" : value}</p>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {!hasLocalFile && (
              <a href={value} target="_blank" rel="noopener noreferrer" title="Open in new tab" className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-(--table-hover) text-gray-500 transition-colors">
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            <button title="Edit URL" onClick={handleEdit} className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-(--table-hover) text-gray-500 transition-colors">
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button title="Upload new image" onClick={() => fileInputRef.current?.click()} className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-(--table-hover) text-gray-500 transition-colors">
              <Upload className="w-3.5 h-3.5" />
            </button>
            <button title="Remove" onClick={handleClear} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {mode === "idle" && !hasImage && (
        <div className="flex gap-2">
          <button
            onClick={() => {
              setTempUrl("");
              setMode("url");
            }}
            className="flex-1 flex flex-col items-center justify-center gap-1.5 p-3 bg-gray-50 dark:bg-page-body border border-dashed border-gray-300 dark:border-(--card-border-color) rounded-lg hover:border-primary hover:bg-primary/5 transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-white dark:bg-(--dark-body) border border-(--input-border-color) dark:border-none flex items-center justify-center group-hover:border-primary/30 transition-colors">
              <Link2 className="w-3.5 h-3.5 text-gray-400 group-hover:text-primary transition-colors" />
            </div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 group-hover:text-primary transition-colors">Enter URL</span>
          </button>

          <button onClick={() => fileInputRef.current?.click()} className="flex-1 flex flex-col items-center justify-center gap-1.5 p-3 bg-gray-50 dark:bg-page-body border border-dashed border-gray-300 dark:border-(--card-border-color) rounded-lg hover:border-primary hover:bg-primary/5 transition-all group">
            <div className="w-8 h-8 rounded-lg bg-white dark:bg-(--dark-body) border border-(--input-border-color) dark:border-none flex items-center justify-center group-hover:border-primary/30 transition-colors">
              <Upload className="w-3.5 h-3.5 text-gray-400 group-hover:text-primary transition-colors" />
            </div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 group-hover:text-primary transition-colors">Upload File</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUrlField;
