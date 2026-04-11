"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/src/elements/ui/dialog";
import { Button } from "@/src/elements/ui/button";
import { useGetAllPlansQuery } from "@/src/redux/api/planApi";
import { useAssignPlanToUserMutation } from "@/src/redux/api/subscriptionApi";
import { User, Plan } from "@/src/types/store";
import { Loader2, Check, Package, CreditCard, Search } from "lucide-react";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { Input } from "@/src/elements/ui/input";

interface AssignPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

const AssignPlanModal = ({ isOpen, onClose, user }: AssignPlanModalProps) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const { data: plansData, isLoading: plansLoading } = useGetAllPlansQuery({ is_active: true });
  const [assignPlan, { isLoading: isAssigning }] = useAssignPlanToUserMutation();

  const handleAssign = async () => {
    if (!user || !selectedPlanId) return;

    try {
      const result = await assignPlan({
        user_id: user._id,
        plan_id: selectedPlanId,
      }).unwrap();

      if (result.success) {
        toast.success(result.message || "Plan assigned successfully!");
        confetti({
          particleCount: 200,
          spread: 120,
          origin: { y: 0.6 },
          zIndex: 9999,
          colors: ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#059669"],
        });
        onClose();
        setSelectedPlanId("");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.data?.message || error.message || "Failed to assign plan");
    }
  };

  const activePlans = plansData?.data?.plans || [];
  const filteredPlans = activePlans.filter((plan: Plan) => plan.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const hasPlan = !!user?.current_plan;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-125 bg-white dark:bg-(--card-color) border-none rounded-xl p-0! overflow-hidden shadow-2xl">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg">
              <Package className="w-6 h-6 text-(--text-green-primary)" />
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="text-xl font-semibold">{hasPlan ? "Change User Plan" : "Assign Plan to User"}</h4>
              <p className="text-[13px] text-slate-500 dark:text-slate-400">
                Select a plan to assign to <span className="font-semibold text-slate-900 dark:text-white">{user?.name}</span>
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 pt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder="Search plans by name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 h-10 bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 rounded-lg focus:ring-emerald-500/20 focus:border-(--text-green-primary) transition-all" />
          </div>
        </div>

        <div className="p-6 pt-0 space-y-4 max-h-100 overflow-y-auto custom-scrollbar">
          {plansLoading ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-(--text-green-primary)" />
              <p className="text-sm text-slate-500">Loading plans...</p>
            </div>
          ) : filteredPlans.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-slate-500">{searchQuery ? "No plans match your search." : "No active plans available."}</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {filteredPlans.map((plan: Plan) => (
                <div key={plan._id} onClick={() => setSelectedPlanId(plan._id)} className={`relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedPlanId === plan._id ? "border-(--text-green-primary) bg-emerald-50/50 dark:bg-emerald-900/10" : "border-slate-100 dark:border-(--card-border-color) hover:border-emerald-200 dark:hover:border-emerald-800"}`}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 dark:text-white truncate">{plan.name}</h4>
                      {user?.current_plan?._id === plan._id && <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 font-medium">Current</span>}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-lg font-bold text-(--text-green-primary)">
                        {plan.currency?.symbol || "$"}
                        {plan.price}
                      </span>
                      <span className="text-xs text-slate-400 capitalize">/ {plan.billing_cycle}</span>
                    </div>
                  </div>
                  {selectedPlanId === plan._id && (
                    <div className="w-6 h-6 rounded-full bg-(--text-green-primary) flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter className="p-6 pt-0 flex gap-3">
          <Button type="button" variant="ghost" onClick={onClose} className="flex-1 h-11 rounded-lg text-slate-600 dark:text-slate-400 bg-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all">
            Cancel
          </Button>
          <Button type="button" disabled={isAssigning || !selectedPlanId || user?.current_plan?._id === selectedPlanId} onClick={handleAssign} className="flex-1 h-11 bg-(--text-green-primary) hover:bg-emerald-600 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50">
            {isAssigning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                {hasPlan ? "Change Plan" : "Assign Plan"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignPlanModal;
