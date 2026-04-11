"use client";

import { TagInputProps } from "@/src/types/setting";
import { X } from "lucide-react";
import { KeyboardEvent, useState } from "react";

const SimpleTagInput = ({ value = [], onChange, placeholder = "Type and press Enter..." }: TagInputProps) => {
  const [inputValue, setInputValue] = useState("");

  const addTag = (tag: string) => {
    const cleaned = tag.trim();
    if (cleaned && !value.includes(cleaned)) {
      onChange([...value, cleaned]);
    }
    setInputValue("");
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (inputValue.trim()) addTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  };

  return (
    <div className="relative">
      <div className="min-h-11 flex flex-wrap gap-1.5 p-2 bg-(--input-color) dark:bg-page-body border border-(--input-border-color) dark:border-none rounded-lg focus-within:ring-2 focus-within:ring-(--text-green-primary)/20 focus-within:border-(--text-green-primary) transition-all">
        {value.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 bg-(--text-green-primary)/10 text-(--text-green-primary) text-xs font-semibold rounded-md border border-(--text-green-primary)/20 shadow-sm">
            {tag}
            <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500 transition-colors ml-0.5">
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        ))}
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? placeholder : "Add more..."}
          className="flex-1 min-w-[120px] bg-transparent outline-none text-sm text-gray-700 dark:text-gray-200 placeholder:text-gray-400 py-1"
        />
      </div>
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5 font-medium italic">Press Enter or comma to add values.</p>
    </div>
  );
};

export default SimpleTagInput;
