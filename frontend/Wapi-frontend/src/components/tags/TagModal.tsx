/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/src/elements/ui/alert-dialog";
import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { useGetTagsQuery } from "@/src/redux/api/tagsApi";
import { Tag } from "@/src/types/components";
import { Label } from "@radix-ui/react-label";
import { Check, Loader2, Palette, X } from "lucide-react";
import React, { useRef, useState } from "react";

interface TagModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, color: string) => Promise<any>;
  onAssign?: (tagIds: string[]) => Promise<any>;
  tag?: Tag | null;
  isLoading: boolean;
  fromProfile?: boolean;
}

const TagModal: React.FC<TagModalProps> = ({ isOpen, onClose, onSave, onAssign, tag, isLoading, fromProfile }) => {
  const [name, setName] = useState("");
  const [prevTagId, setPrevTagId] = useState<string | undefined | null>(undefined);
  const [color, setColor] = useState("#000000");
  const [selectedExistingTags, setSelectedExistingTags] = useState<string[]>([]);
  const colorInputRef = useRef<HTMLInputElement>(null);

  const { data: allTagsData } = useGetTagsQuery({}, { skip: !fromProfile });
  const allTags = allTagsData?.data?.tags || [];

  if (isOpen && tag?._id !== prevTagId) {
    setPrevTagId(tag?._id || null);
    setName(tag?.label || "");
    setColor(tag?.color || "#000000");
  } else if (!isOpen && prevTagId !== undefined) {
    setPrevTagId(undefined);
    setName("");
    setColor("#000000");
    setSelectedExistingTags([]);
  }

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedExistingTags.length > 0 && onAssign) {
      const response = await onAssign(selectedExistingTags);
      if (response?.success) {
        onClose();
        setSelectedExistingTags([]);
      }
    } else if (name.trim()) {
      const response = await onSave(name.trim(), color);
      if (response?.success) {
        setName("");
        setColor("#000000");
        if (!onAssign) {
          onClose();
        }
      }
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader className="flex flex-row items-center justify-between">
          <div>
            <AlertDialogTitle className="text-xl text-left font-bold">{tag ? "Edit Tag" : "Add Tag"}</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-gray-500">{tag ? "Update tag for Chat Filter" : "Add tags for Chat Filter"}</AlertDialogDescription>
          </div>
          <Button onClick={onClose} className="p-1 hover:bg-gray-100! bg-transparent   dark:bg-transparent rounded-lg transition-colors absolute right-4 top-4 dark:hover:bg-(--table-hover)!">
            <X size={20} className="dark:text-amber-50 text-gray-500" />
          </Button>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-2">
          {fromProfile && (
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Select Existing Tag</Label>
              {allTags.length > 0 ? (
                <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto custom-scrollbar pr-1 pt-1">
                  {allTags.map((t: Tag) => {
                    const isSelected = selectedExistingTags.includes(t._id);
                    return (
                      <button
                        key={t._id}
                        type="button"
                        onClick={() => {
                          setSelectedExistingTags((prev) =>
                            isSelected ? prev.filter((id) => id !== t._id) : [...prev, t._id]
                          );
                          setName("");
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 hover:scale-105 active:scale-95"
                        style={{
                          backgroundColor: isSelected ? t.color : `${t.color}18`,
                          borderColor: t.color,
                          color: isSelected ? "#fff" : t.color,
                        }}
                      >
                        {isSelected && <Check size={11} strokeWidth={3} />}
                        {t.label}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No tags created yet — add one below.</p>
              )}
              {allTags.length > 0 && (
                <div className="relative my-5">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200 dark:border-(--card-border-color)"></span>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white dark:bg-(--card-color) px-2 text-gray-400">Or Add New</span>
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="space-y-2">
            <Label>Tag Name</Label>
            <Input
              placeholder="Enter Tag Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (e.target.value) setSelectedExistingTags([]);
              }}
              className="h-11 focus:border-primary focus-visible:shadow-none border mt-2 border-gray-200 bg-(--input-color) dark:border-(--card-border-color)"
              autoFocus={!fromProfile}
            />
          </div>
          <div className="flex gap-3 flex-col">
            <Label>Tag Color</Label>
            <div className="flex gap-2">
              <div className="border w-25 h-22 flex justify-center items-center rounded-lg relative" onClick={() => colorInputRef.current?.click()}>
                <Palette size={25} color="gray" />
                <input type="color" className="absolute top-0 left-0 w-full h-full opacity-0" ref={colorInputRef} value={color} onChange={handleColorChange} />
              </div>

              <div className="border w-25 h-22 flex justify-center items-center rounded-lg" style={{ backgroundColor: color }}></div>
            </div>
          </div>

          <AlertDialogFooter className="sm:justify-start">
            <Button type="submit" disabled={isLoading || (selectedExistingTags.length === 0 && !name.trim())} className="bg-primary text-white px-8 h-10 font-semibold">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </div>
              ) : tag ? (
                "Update"
              ) : selectedExistingTags.length > 0 ? (
                `Assign${selectedExistingTags.length > 1 ? ` (${selectedExistingTags.length})` : ""}`
              ) : (
                "Add"
              )}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default TagModal;
