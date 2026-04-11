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
        className={`w-[95vw] ${maxWidth} p-0 overflow-hidden border-none rounded-lg ${maxHeight} overflow-y-auto gap-0`}
      >
        <DialogHeader className="px-6 sm:px-6 py-4 sm:py-6 bg-white dark:bg-(--card-color) border-b border-gray-100 dark:border-(--card-border-color)">
          <DialogTitle className="text-xl font-medium text-gray-900 dark:text-gray-100 text-left rtl:text-right">
            {title}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="sm:p-6 p-4 space-y-8 bg-white dark:bg-(--card-color)">
          {children}

          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-3 px-0 pt-2 dark:border-(--card-border-color)">
            <Button
              variant="outline"
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-8 py-5 rounded-lg border-gray-300 dark:border-none text-gray-700 dark:text-gray-300 dark:bg-(--page-body-bg) dark:hover:bg-(--dark-sidebar) font-medium"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-full sm:w-auto px-8 py-5 rounded-lg bg-(--text-green-primary) hover:bg-(--text-green-primary)/90 text-white font-semibold shadow-md transition-all active:scale-95 disabled:opacity-50"
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
