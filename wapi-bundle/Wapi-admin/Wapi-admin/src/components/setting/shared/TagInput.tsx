"use client";

import { TagInputProps } from "@/src/types/setting";
import { X } from "lucide-react";
import { KeyboardEvent, useState } from "react";

const COMMON_FILE_TYPES = ["png", "jpg", "jpeg", "gif", "webp", "svg", "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "mp3", "wav", "ogg", "mp4", "mov", "avi", "webm", "zip", "rar", "7z", "txt", "csv"];

const TagInput = ({ value = [], onChange, placeholder = "Type and press Enter...", disabled = false }: TagInputProps) => {
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const addTag = (tag: string) => {
    if (disabled) return;
    const cleaned = tag.trim().toLowerCase().replace(/^\./, "");
    if (cleaned && !value.includes(cleaned)) {
      onChange([...value, cleaned]);
    }
    setInputValue("");
    setShowSuggestions(false);
  };

  const removeTag = (tag: string) => {
    if (disabled) return;
    onChange(value.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (inputValue.trim()) addTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  };

  const filtered = COMMON_FILE_TYPES.filter((t) => t.includes(inputValue.toLowerCase()) && !value.includes(t));

  return (
    <div className={`relative ${disabled ? "opacity-50 pointer-events-none" : ""}`}>
      <div className="min-h-10 flex flex-wrap gap-1.5 p-2 bg-(--input-color) dark:bg-page-body border border-(--input-border-color) dark:border-none rounded-lg focus-within:ring-2 focus-within:ring-(--text-green-primary)/20 focus-within:border-(--text-green-primary) transition-all">
        {value.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 bg-(--text-green-primary)/10 text-(--text-green-primary) text-xs font-medium rounded-md border border-(--text-green-primary)/20">
            .{tag}
            <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500 transition-colors" disabled={disabled}>
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowSuggestions(true);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          placeholder={value.length === 0 ? placeholder : ""}
          className="flex-1 min-w-20 bg-transparent outline-none text-sm text-gray-700 dark:text-gray-200 placeholder:text-gray-400"
          disabled={disabled}
        />
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && filtered.length > 0 && (
        <div className="z-50 top-full mt-1 left-0 right-0 bg-white dark:bg-(--page-body-bg) border border-gray-200 dark:border-none rounded-lg shadow-lg overflow-hidden max-h-48 overflow-y-auto">
          <div className="p-1.5 flex flex-wrap gap-1">
            {filtered.map((type) => (
              <button key={type} type="button" onMouseDown={() => addTag(type)} className="px-2 py-1 text-xs font-medium rounded-md bg-gray-100 dark:bg-(--card-color) text-gray-700 dark:text-gray-300 hover:bg-(--text-green-primary)/10 hover:text-(--text-green-primary) transition-colors">
                .{type}
              </button>
            ))}
          </div>
        </div>
      )}
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5">Press Enter to add. Click a suggestion to add it.</p>
    </div>
  );
};

export default TagInput;
