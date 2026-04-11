/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { cn, getObjId } from "@/lib/utils";
import { Badge } from "@/src/elements/ui/badge";
import { Button } from "@/src/elements/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/src/elements/ui/command";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/src/elements/ui/popover";
import { Textarea } from "@/src/elements/ui/textarea";
import { useGetAllPlansQuery } from "@/src/redux/api/planApi";
import { Check, ChevronsUpDown, X, Tag, CreditCard } from "lucide-react";
import { useState } from "react";

interface PricingFormProps {
  data: any;
  onChange: (data: any) => void;
}

const PricingForm = ({ data, onChange }: PricingFormProps) => {
  const { data: plansData } = useGetAllPlansQuery({});
  const [open, setOpen] = useState(false);

  const handleChange = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const selectedPlans = data.plans || [];

  const togglePlan = (planId: string) => {
    const isSelected = selectedPlans.some((p: any) => getObjId(p) === planId);
    if (isSelected) {
      handleChange(
        "plans",
        selectedPlans.filter((p: any) => getObjId(p) !== planId)
      );
    } else {
      handleChange("plans", [...selectedPlans, planId]);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 [@media(min-width:1421px)]:grid-cols-12 gap-10">
        <div className="[@media(min-width:1421px)]:col-span-6 space-y-6">
          <div className="space-y-2.5 flex flex-col">
            <Label className="text-[13px] font-bold text-gray-700 dark:text-gray-300 ml-1">Section Badge</Label>
            <Input
              value={data.badge}
              onChange={(e) => handleChange("badge", e.target.value)}
              placeholder="e.g. FLEXIBLE PLANS"
              className="bg-white dark:bg-page-body border-gray-200 dark:border-(--card-border-color) h-12 text-[15px]"
            />
          </div>
          <div className="space-y-2.5 flex flex-col">
            <Label className="text-[13px] font-bold text-gray-700 dark:text-gray-300 ml-1">Section Title</Label>
            <Input
              value={data.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter pricing headline"
              className="bg-white dark:bg-page-body border-gray-200 dark:border-(--card-border-color) h-12 text-[15px] font-medium"
            />
          </div>
        </div>

        <div className="[@media(min-width:1421px)]:col-span-6">
          <div className="space-y-2.5 flex flex-col">
            <Label className="text-[13px] font-bold text-gray-700 dark:text-gray-300 ml-1">Brief Description</Label>
            <Textarea
              value={data.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Enter pricing narrative"
              rows={5}
              className="bg-white dark:bg-page-body border-gray-200 dark:border-(--card-border-color) resize-none text-[15px] leading-relaxed p-4"
            />
          </div>
        </div>
      </div>

      <div className="space-y-6 pt-10 border-t border-gray-100 dark:border-(--card-border-color)">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-gray-900 dark:text-gray-100">Plan Catalog Integration</h3>
              <p className="text-[12px] text-gray-400">Select the specific plans you want to expose on your landing page</p>
            </div>
          </div>
        </div>

        <div className="space-y-6 max-w-3xl">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between bg-white dark:bg-(--page-body-bg) border-gray-200 dark:border-(--card-border-color) h-14 rounded-lg px-6 text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-50 dark:hover:bg-(--table-hover) transition-all shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <Tag className="w-4 h-4 opacity-40 dark:hover:bg-(--table-hover)" />
                  <span>{selectedPlans.length > 0 ? `${selectedPlans.length} plans selected for display` : "Choose subscription plans..."}</span>
                </div>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-40" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 rounded-lg border-gray-100 dark:border-(--card-border-color) shadow-2xl overflow-hidden" align="start">
              <Command className="dark:bg-page-body">
                <CommandInput placeholder="Search catalog..." className="h-12 border-none ring-0" />
                <CommandList className="p-1">
                  <CommandEmpty className="py-6 text-center text-xs text-gray-400">No matching plans found in system.</CommandEmpty>
                  <CommandGroup>
                    {plansData?.data?.plans.map((plan) => {
                      const isSelected = selectedPlans.some((p: any) => (typeof p === "string" ? p === plan._id : p._id === plan._id));
                      return (
                        <CommandItem key={plan._id} onSelect={() => togglePlan(plan._id)} className="rounded-xl flex items-center justify-between p-3 cursor-pointer mb-1 hover:bg-gray-50 dark:hover:bg-(--table-hover)">
                          <div className="flex flex-col">
                            <span className="font-bold text-[14px]">{plan.name}</span>
                            <span className="text-[11px] text-gray-400 font-medium">
                              {typeof plan.currency === "string" ? plan.currency : plan.currency?.code} {plan.price} billed {plan.billing_cycle}
                            </span>
                          </div>
                          <div className={cn("w-6 h-6 rounded-full flex items-center justify-center transition-all", isSelected ? "bg-primary text-white scale-110" : "bg-gray-100 opacity-20")}>
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <div className="grid grid-cols-1 sm:grid-cols-2 [@media(min-width:1421px)]:grid-cols-3 gap-3">
            {plansData?.data?.plans
              .filter((p) => selectedPlans.some((sp: any) => getObjId(sp) === p._id))
              .map((plan) => (
                <Badge key={plan._id} variant="secondary" className="pl-4 pr-1.5 py-3 gap-2.5 bg-white dark:hover:bg-(--table-hover) dark:bg-(--dark-body) border border-gray-100 dark:border-none shadow-sm rounded-lg transition-all hover:border-primary/20 flex justify-between items-center h-auto">
                  <div className="flex flex-col min-w-0">
                    <span className="text-[13px] font-bold text-gray-700 dark:text-gray-300 truncate">{plan.name}</span>
                    <span className="text-[10px] text-gray-400 font-black tracking-widest uppercase mt-0.5">
                      {typeof plan.currency === "string" ? plan.currency : plan.currency?.symbol}{plan.price}
                    </span>
                  </div>
                  <button onClick={() => togglePlan(plan._id)} className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-500 dark:hover:bg-red-900/20 hover:text-white flex items-center justify-center transition-all shrink-0">
                    <X className="w-4 h-4" />
                  </button>
                </Badge>
              ))}
            {selectedPlans.length === 0 && (
              <div className="w-full p-8 border dark:bg-(--page-body-bg) border-dashed border-gray-100 dark:border-(--card-border-color) rounded-lg flex items-center justify-center bg-gray-50/20 text-gray-400">
                <p className="text-[12px] italic">No active plans targeted for this section</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingForm;
