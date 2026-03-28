"use client";

import { Button } from "@/src/elements/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/src/elements/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/elements/ui/select";
import { WABAConnection } from "@/src/types/whatsapp";
import { Building2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface SelectWabaModalProps {
  isOpen: boolean;
  onClose: () => void;
  connections: WABAConnection[];
  onConfirm: (wabaId: string) => void;
}

export const SelectWabaModal = ({ isOpen, onClose, connections, onConfirm }: SelectWabaModalProps) => {
  const { t } = useTranslation();
  const [selectedWabaId, setSelectedWabaId] = useState<string>("");

  const handleConfirm = () => {
    if (selectedWabaId) {
      onConfirm(selectedWabaId);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-106.25 dark:bg-(--card-color)">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            {t("templates.select_waba_title", "Select WABA Connection")}
          </DialogTitle>
        </DialogHeader>

        <div className="py-6 space-y-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">{t("templates.select_waba_description", "Please select a WABA connection to use with this template.")}</p>

          <Select onValueChange={setSelectedWabaId} value={selectedWabaId}>
            <SelectTrigger className="w-full dark:border-none">
              <SelectValue placeholder={t("templates.select_waba_placeholder", "Select a connection")} />
            </SelectTrigger>
            <SelectContent className="dark:bg-(--page-body-bg)">
              {connections.map((conn) => (
                <SelectItem className="dark:hover:bg-(--card-color)" key={conn.id} value={conn.id}>
                  {conn.name} ({conn.whatsapp_business_account_id})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button className="dark:text-white" onClick={handleConfirm} disabled={!selectedWabaId}>
            {t("common.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
