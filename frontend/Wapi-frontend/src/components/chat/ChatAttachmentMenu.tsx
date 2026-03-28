"use client";

import { Button } from "@/src/elements/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/src/elements/ui/popover";
import { Image as ImageIcon, MapPin, Paperclip, MessageSquare, List, Mic } from "lucide-react";
import React from "react";

interface ChatAttachmentMenuProps {
  onFileSelect: (file: File) => void;
  onMediaLibraryOpen: () => void;
  onLocationClick: () => void;
  onInteractiveClick: (type: "button" | "list") => void;
  onAudioClick?: () => void;
  isBaileys?: boolean;
}

const ChatAttachmentMenu = ({ onFileSelect, onMediaLibraryOpen, onLocationClick, onInteractiveClick, onAudioClick, isBaileys }: ChatAttachmentMenuProps) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="text-slate-500 dark:bg-(--page-body-bg) dark:hover:bg-(--table-hover) dark:text-gray-400 hover:text-primary bg-gray-100 rounded-lg hover:bg-emerald-100/40">
          <Paperclip size={24} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-52 p-2 dark:bg-(--page-body-bg)" side="top" align="start">
        <div className="flex flex-col gap-1">
          {!isBaileys && (
            <>
              <button className="flex items-center gap-3 p-2 hover:bg-slate-100 dark:hover:bg-(--table-hover) rounded-lg transition-colors text-sm text-slate-700 dark:text-slate-300" onClick={() => onInteractiveClick("button")}>
                <MessageSquare size={18} className="text-emerald-500" />
                <span>Button message</span>
              </button>

              <button className="flex items-center gap-3 p-2 hover:bg-slate-100 dark:hover:bg-(--table-hover) rounded-lg transition-colors text-sm text-slate-700 dark:text-slate-300" onClick={() => onInteractiveClick("list")}>
                <List size={18} className="text-blue-500" />
                <span>List message</span>
              </button>

              <div className="h-px bg-slate-100 dark:bg-(--card-border-color) my-1" />
            </>
          )}

          <button
            className="flex items-center gap-3 p-2 hover:bg-slate-100 dark:hover:bg-(--table-hover) rounded-lg transition-colors text-sm text-slate-700 dark:text-slate-300"
            onClick={() => {
              onMediaLibraryOpen();
            }}
          >
            <ImageIcon size={18} className="text-purple-500" />
            <span>Media Library</span>
          </button>

          <button
            className="flex items-center gap-3 p-2 hover:bg-slate-100 dark:hover:bg-(--table-hover) rounded-lg transition-colors text-sm text-slate-700 dark:text-slate-300"
            onClick={() => {
              onLocationClick();
            }}
          >
            <MapPin size={18} className="text-rose-500" />
            <span>Location</span>
          </button>
          <button
            className="flex items-center gap-3 p-2 hover:bg-slate-100 dark:hover:bg-(--table-hover) rounded-lg transition-colors text-sm text-slate-700 dark:text-slate-300"
            onClick={() => {
              onAudioClick?.();
            }}
          >
            <Mic size={18} className="text-amber-500" />
            <span>Audio</span>
          </button>
        </div>
        <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
      </PopoverContent>
    </Popover>
  );
};

export default ChatAttachmentMenu;
