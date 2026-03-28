"use client";

import { Badge } from "@/src/elements/ui/badge";
import { Button } from "@/src/elements/ui/button";
import { Plus, X } from "lucide-react";

interface ProfileChatLabelProps {
  labels: { id: string; name: string; color?: string }[];
  onRemoveLabel: (id: string) => void;
  onOpenModal: () => void;
}

const ProfileChatLabel = ({ labels, onRemoveLabel, onOpenModal }: ProfileChatLabelProps) => {

  return (
    <div className="p-2 space-y-4 w-70 mt-2">
      <div className="flex flex-wrap gap-2 items-center flex-col sm:flex-row">
        {labels.length > 0 ? (
          labels?.map((label) => (
            <Badge key={label.id} variant="secondary" className="py-1 px-2.5 rounded-lg border-rose-100 bg-rose-50 text-rose-500 font-medium flex items-center gap-1.5" style={label.color ? { backgroundColor: `${label.color}15`, color: label.color, borderColor: `${label.color}` } : {}}>
              {label.name}
              <X size={14} className="cursor-pointer hover:opacity-70 transition-opacity" onClick={() => onRemoveLabel(label.id)} />
            </Badge>
          ))
        ) : (
          <p className="text-sm text-slate-400 italic">No labels set</p>
        )}
        <Button variant="outline" size="sm" onClick={onOpenModal} className="h-9 w-auto py-0 px-3 text-xs border-dashed border-gray-300 dark:border-(--card-border-color) hover:border-primary hover:text-primary rounded-lg transition-all flex items-center gap-1">
          <Plus size={14} />
          Add Tag
        </Button>
      </div>
    </div>
  );
};

export default ProfileChatLabel;
