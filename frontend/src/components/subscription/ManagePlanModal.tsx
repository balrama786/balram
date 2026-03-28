"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/src/elements/ui/dialog";
import { ArrowDownCircle, ArrowUpCircle, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ManagePlanModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUpgrade: () => void;
  onDowngrade: () => void;
  onCancel: () => void;
}

const ManagePlanModal = ({ isOpen, onOpenChange, onUpgrade, onDowngrade, onCancel }: ManagePlanModalProps) => {
  const { t } = useTranslation();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md! max-w-[calc(100%-2rem)]! p-0! overflow-hidden border-none bg-white dark:bg-(--card-color) rounded-lg shadow-2xl">
        <DialogHeader className="sm:p-6 p-4 pb-0 text-left rtl:text-right">
          <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white ">{t("subscription_page.manage_plan")}</DialogTitle>
          <DialogDescription className="text-slate-500 dark:text-slate-400 font-medium text-sm">Choose an action to manage your current subscription.</DialogDescription>
        </DialogHeader>
        <div className="sm:p-6 p-4 space-y-3">
          <button
            onClick={() => {
              onUpgrade();
              onOpenChange(false);
            }}
            className="w-full flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-xl transition-all group border border-emerald-100/50 dark:border-emerald-500/20"
          >
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-white dark:bg-(--dark-body) rounded-lg shadow-sm">
                <ArrowUpCircle className="h-6 w-6" />
              </div>
              <div className="text-left">
                <p className="font-medium text-md ">{t("subscription_page.upgrade_plan")}</p>
                <p className="text-sm font-medium opacity-80 mt-0.5">Scale up your business limits</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => {
              onDowngrade();
              onOpenChange(false);
            }}
            className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-(--page-body-bg) hover:bg-slate-100 dark:hover:bg-(--card-border-color) text-slate-700 dark:text-slate-300 rounded-xl transition-all group border border-slate-100 dark:border-slate-800/60"
          >
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-white dark:bg-(--dark-body) rounded-lg shadow-sm">
                <ArrowDownCircle className="h-6 w-6" />
              </div>
              <div className="text-left">
                <p className="font-medium text-md">{t("subscription_page.downgrade_plan")}</p>
                <p className="text-sm font-medium opacity-80 mt-0.5">Move to a lighter plan</p>
              </div>
            </div>
          </button>

          <div className="pt-2">
            <button
              onClick={() => {
                onCancel();
                onOpenChange(false);
              }}
              className="w-full flex items-center justify-between p-4 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-xl transition-all group border border-red-100/50 dark:border-red-500/20"
            >
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-white dark:bg-(--dark-body) rounded-lg shadow-sm">
                  <XCircle className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-md ">{t("subscription_page.cancel_subscription")}</p>
                  <p className="text-sm font-medium opacity-80 mt-0.5">Stop your recurring billing</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ManagePlanModal;
