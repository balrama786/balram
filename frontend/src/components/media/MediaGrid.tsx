"use client";

import { Attachment } from "@/src/types/components";
import { Check } from "lucide-react";
import Image from "next/image";
import React from "react";

interface MediaGridProps {
  attachments: Attachment[];
  selectedItems: string[];
  onSelect: (id: string, shiftKey?: boolean) => void;
  onItemClick: (attachment: Attachment) => void;
  isSelectionEnabled?: boolean;
}

const MediaGrid: React.FC<MediaGridProps> = ({ attachments, selectedItems, onSelect, onItemClick, isSelectionEnabled }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4 py-4">
      {attachments.map((item) => {
        const isSelected = selectedItems.includes(item._id);
        const isImage = item.mimeType.startsWith("image/");

        return (
          <div
            key={item._id}
            className={`group relative aspect-square border rounded-lg cursor-pointer transition-all overflow-visible ${isSelected ? "border-primary shadow-md" : "border-gray-100 dark:border-(--card-border-color)"}`}
            onClick={(e) => {
              if (isSelectionEnabled) {
                onSelect(item._id);
                return;
              }
              if ((e.target as HTMLElement).closest(".select-checkbox")) {
                return;
              }
              onItemClick(item);
            }}
          >
            {/* Selection Checkbox - Visible when selected or when selection mode is enabled */}
            <div
              className={`absolute -top-2.5 -right-2.5 z-10 transition-opacity select-checkbox ${isSelected || isSelectionEnabled ? "opacity-100" : "opacity-0"}`}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(item._id);
              }}
            >
              <div className={`w-4 h-4 rounded border shadow-sm flex items-center justify-center ${isSelected ? "bg-primary text-white" : "bg-white dark:bg-(--card-color) dark:border-(--card-border-color) border-gray-300"}`}>{isSelected && <Check size={14} strokeWidth={3} />}</div>
            </div>

            {/* Content */}
            <div className="w-full h-full bg-gray-50 dark:bg-(--table-hover) flex items-center justify-center rounded-lg">
              {isImage ? (
                <Image src={item.fileUrl} alt={item.fileName} className="w-full h-full object-cover lg:p-2 rounded-lg" width={100} height={100} unoptimized />
              ) : (
                <div className="flex flex-col items-center p-2 text-center">
                  <span className="text-4xl mb-2">📄</span>
                </div>
              )}
            </div>

            {/* Overlay Info (optional, helpful for names) */}
            <div className="absolute bottom-0 left-0 right-0 rounded-b-lg bg-black/70 p-1 text-white text-xs truncate opacity-0 group-hover:opacity-100 transition-opacity">{item.fileName}</div>
          </div>
        );
      })}
    </div>
  );
};

export default MediaGrid;
