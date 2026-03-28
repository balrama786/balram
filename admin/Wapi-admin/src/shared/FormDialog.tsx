import { Button } from "@/src/elements/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/src/elements/ui/dialog";
import { FormDialogProps } from "@/src/types/components";

const FormDialog = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  children,
  isLoading = false,
  submitLabel = "Save",
  loadingLabel = "Saving...",
  isSubmitDisabled = false,
  maxWidth = "sm:max-w-150",
  maxHeight = "max-h-[90vh]",
}: FormDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`w-[95vw] ${maxWidth} p-0 overflow-hidden border-none rounded-lg ${maxHeight} overflow-y-auto`}
      >
        <DialogHeader className="px-6 sm:px-8 py-4 sm:py-6 bg-[#f8fafc] border-b border-[#f1f5f9]">
          <DialogTitle className="text-lg sm:text-xl font-bold text-[#1e293b]">
            {title}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="px-8 py-8 space-y-8">
          {children}

          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-3 px-0">
            <Button
              variant="outline"
              onClick={onClose}
              className="w-full sm:w-auto px-8 py-6 rounded-lg border-[#e2e8f0] text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#1e293b] font-semibold transition-all"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-full sm:w-auto px-8 py-6 rounded-lg bg-[#0084ff] hover:bg-[#0070e0] text-white font-semibold shadow-md shadow-blue-100 transition-all active:scale-95"
              disabled={isLoading || isSubmitDisabled}
            >
              {isLoading ? loadingLabel : submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FormDialog;
