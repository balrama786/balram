"use client";

import { SequenceStep } from "@/src/types/sequence";
import { GripVertical, Edit2, Trash2, Clock, CalendarDays, CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { Reorder, useDragControls } from "motion/react";

interface SequenceStepRowProps {
  step: SequenceStep;
  index: number;
  onEdit: (step: SequenceStep) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, active: boolean) => void;
}

const SequenceStepRow: React.FC<SequenceStepRowProps> = ({ step, index, onEdit, onDelete, onToggleActive }) => {
  const controls = useDragControls();

  const getDelayText = () => {
    return `After ${step.delay_value} ${step.delay_unit}`;
  };

  const getScheduleText = () => {
    if (step.send_anytime) return "Anytime";
    const days = step.send_days.length === 7 ? "Everyday" : step.send_days.join(", ");
    return `${days} (${step.from_time} - ${step.to_time})`;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const material = step.reply_material_id as any;
  const materialName = material?.template_name || material?.name || "Unknown Material";
  const materialType = step.reply_material_type;

  return (
    <Reorder.Item value={step} id={step._id} dragListener={true} dragControls={controls} className="group relative bg-white dark:bg-(--card-color) rounded-lg border border-slate-100 dark:border-(--card-border-color) p-4 shadow-sm hover:shadow-md transition-all flex items-center gap-4 mb-3">
      {/* Drag Handle */}
      <div onPointerDown={(e) => controls.start(e)} className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 transition-colors shrink-0">
        <GripVertical size={20} />
      </div>

      {/* Step Badge */}
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0 border border-primary/20">{index + 1}</div>

      {/* Content Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-bold text-slate-900 dark:text-white truncate">{materialName}</h4>
          <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-(--dark-body) text-slate-500 dark:text-slate-400 text-[10px] font-bold">{materialType === "ReplyMaterial" ? "Material" : materialType}</span>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <div className="flex items-center gap-1.5">
            <Clock size={14} className="text-primary/60" />
            <span>{getDelayText()}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CalendarDays size={14} className="text-primary/60" />
            <span className="max-w-50 truncate">{getScheduleText()}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button onClick={() => onToggleActive(step._id, !step.is_active)} className={cn("p-2 rounded-lg transition-colors", step.is_active ? "text-green-500 hover:bg-green-50 dark:hover:bg-emerald-900/20" : "text-slate-300 hover:bg-slate-50")} title={step.is_active ? "Pause Step" : "Activate Step"}>
          {step.is_active ? <CheckCircle2 size={18} /> : <Circle size={18} />}
        </button>
        <button onClick={() => onEdit(step)} className="p-2 rounded-lg text-slate-400 hover:bg-primary/5 hover:text-primary transition-colors" title="Edit">
          <Edit2 size={18} />
        </button>
        <button onClick={() => onDelete(step._id)} className="p-2 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500  dark:hover:bg-red-900/20 transition-colors" title="Delete">
          <Trash2 size={18} />
        </button>
      </div>
    </Reorder.Item>
  );
};

export default SequenceStepRow;
