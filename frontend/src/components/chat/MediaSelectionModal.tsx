"use client";

import MediaGrid from "@/src/components/media/MediaGrid";
import { Button } from "@/src/elements/ui/button";
import { Checkbox } from "@/src/elements/ui/checkbox";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/src/elements/ui/dialog";
import { Input } from "@/src/elements/ui/input";
import { useGetAttachmentsQuery } from "@/src/redux/api/mediaApi";
import { Attachment } from "@/src/types/components";
import { Loader2, Search, Send } from "lucide-react";
import { useState } from "react";

interface MediaSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (selectedMedia: Attachment[]) => void;
}

const MediaSelectionModal = ({ isOpen, onClose, onSelect }: MediaSelectionModalProps) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const { data: attachmentsData, isLoading } = useGetAttachmentsQuery({
    page,
    search,
  });

  const attachments: Attachment[] = attachmentsData?.data || [];

  const handleGridSelect = (id: string) => {
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleSelectAll = (checked: boolean) => {
    const currentPageIds = attachments.map((a) => a._id);
    if (checked) {
      const uniqueIds = Array.from(new Set([...selectedItems, ...currentPageIds]));
      setSelectedItems(uniqueIds);
    } else {
      setSelectedItems(selectedItems.filter((id) => !currentPageIds.includes(id)));
    }
  };

  const handleSubmit = () => {
    const selectedMedia = attachments.filter((a) => selectedItems.includes(a._id));
    onSelect(selectedMedia);
    onClose();
    setSelectedItems([]);
  };

  const handleClose = () => {
    onClose();
    setSelectedItems([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[calc(100vw-1rem)] gap-0 sm:w-[calc(100vw-2rem)] md:w-[calc(100vw-4rem)] lg:max-w-3xl max-h-[95vh] sm:max-h-[90vh] dark:bg-(--card-color) flex flex-col p-3 sm:p-4 md:p-6 overflow-hidden overflow-x-hidden">
        <DialogHeader className="mb-3 sm:mb-4 shrink-0">
          <DialogTitle className="text-base sm:text-lg md:text-xl text-left">Select Media</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3 sm:gap-4 flex-1 min-h-0 overflow-x-hidden">
          {/* Search and Select All Section */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <Input
                placeholder="Search media..."
                className="pl-8 sm:pl-10 h-9 sm:h-10 text-sm"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            {/* Select All Checkbox */}
            <div className="flex items-center gap-2 px-2.5 sm:px-3 h-9 sm:h-10 bg-slate-50 dark:bg-(--table-hover) border border-slate-200 dark:border-(--card-border-color) rounded-lg flex-shrink-0">
              <Checkbox id="select-all-modal" checked={attachments.length > 0 && attachments.every((a) => selectedItems.includes(a._id))} onCheckedChange={(checked) => handleSelectAll(checked === true)} className="h-4 w-4 sm:h-5 sm:w-5" />
              <label htmlFor="select-all-modal" className="text-xs sm:text-sm font-medium text-slate-600 dark:text-gray-500 cursor-pointer select-none whitespace-nowrap">
                Select All
              </label>
            </div>
          </div>

          {/* Media Grid Container */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar pr-2 sm:pr-3">
            {isLoading ? (
              <div className="flex justify-center items-center h-48 sm:h-64">
                <Loader2 className="animate-spin text-primary" size={28} />
              </div>
            ) : attachments.length > 0 ? (
              <div className=" pr-2">
                <MediaGrid attachments={attachments} selectedItems={selectedItems} onSelect={handleGridSelect} onItemClick={() => {}} isSelectionEnabled={true} />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 sm:h-64 text-slate-400">
                <p className="text-sm sm:text-base">No media found</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="flex-row flex justify-between items-center gap-3 border-t border-slate-100 dark:border-(--card-border-color) pt-3 sm:pt-4 mt-3 sm:mt-4 flex-shrink-0 overflow-x-hidden">
          {/* Selected Count */}
          <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-500 font-medium shrink-0 overflow-hidden">
            <span className="hidden xs:inline">{selectedItems.length} items selected</span>
            <span className="xs:hidden">{selectedItems.length} selected</span>
          </p>

          {/* Action Buttons */}
          <div className="flex gap-2 sm:gap-3 shrink-0">
            <Button variant="outline" onClick={onClose} className="h-8 sm:h-9 md:h-10 px-3 sm:px-4 text-xs sm:text-sm">
              Cancel
            </Button>
            <Button className="bg-primary text-white h-8 sm:h-9 md:h-10 px-3 sm:px-4 text-xs sm:text-sm" disabled={selectedItems.length === 0} onClick={handleSubmit}>
              <Send size={14} className="sm:mr-2" />
              <span className="hidden sm:inline">Send</span>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MediaSelectionModal;
