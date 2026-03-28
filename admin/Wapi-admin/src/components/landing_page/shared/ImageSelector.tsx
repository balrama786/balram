"use client";

import { useState } from "react";
import { ImageIcon, Pencil, Upload, Image as ImageLucide } from "lucide-react";
import MediaUploadModal from "./MediaUploadModal";
import Images from "@/src/shared/Image";

interface ImageSelectorProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  className?: string;
}

const ImageSelector = ({ label, value, onChange, placeholder = "Select Image", className = "" }: ImageSelectorProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className={`space-y-2.5 ${className}`}>
      {label && <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">{label}</label>}

      <div onClick={() => setIsModalOpen(true)} className="group relative cursor-pointer border border-dashed border-gray-200 flex-wrap dark:border-(--card-border-color) bg-gray-50/50 dark:bg-page-body rounded-lg p-4 flex items-center gap-5 hover:border-primary/50 hover:bg-primary/2 transition-all duration-300">
        <div className="w-20 h-20 rounded-xl bg-white dark:bg-(--card-color) border border-gray-100 dark:border-none shadow-sm flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-300">
          {value ? (
            <Images src={value} alt={label} className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-1.5 opacity-20 group-hover:opacity-40 transition-opacity">
              <ImageLucide className="w-6 h-6 text-gray-400" />
            </div>
          )}
        </div>

        <div className="">
          <p className="text-[13px] font-bold text-gray-900 dark:text-gray-100 mb-0.5">{value ? "Update Media" : placeholder}</p>
          <p className="text-[11px] text-gray-400 break-all font-medium">{value ? value : "High quality images recommended"}</p>
        </div>

        <div className="w-10 h-10 rounded-full bg-white dark:bg-(--card-color) border border-gray-200 dark:border-(--card-border-color) flex items-center justify-center text-gray-400 group-hover:text-primary group-hover:border-primary/50 transition-all shadow-sm">{value ? <Pencil className="w-4 h-4" /> : <Upload className="w-4 h-4" />}</div>
      </div>

      <MediaUploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSelect={onChange} title={`Upload ${label || "Media"}`} />
    </div>
  );
};

export default ImageSelector;
