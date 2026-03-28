/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { cn, getObjId } from "@/lib/utils";
import { Button } from "@/src/elements/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/src/elements/ui/command";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/src/elements/ui/popover";
import { Textarea } from "@/src/elements/ui/textarea";
import { useGetAllFaqsQuery } from "@/src/redux/api/faqApi";
import { Check, ChevronsUpDown, HelpCircle, Search, X } from "lucide-react";
import { useState } from "react";

interface FaqFormProps {
  data: any;
  onChange: (data: any) => void;
}

const FaqForm = ({ data, onChange }: FaqFormProps) => {
  const { data: faqsData } = useGetAllFaqsQuery({});
  const [open, setOpen] = useState(false);

  const handleChange = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const selectedFaqs = data.faqs || [];

  const toggleFaq = (id: string) => {
    const isSelected = selectedFaqs.some((f: any) => getObjId(f) === id);
    if (isSelected) {
      handleChange(
        "faqs",
        selectedFaqs.filter((f: any) => getObjId(f) !== id)
      );
    } else {
      handleChange("faqs", [...selectedFaqs, id]);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 [@media(min-width:1421px)]:grid-cols-12 gap-10">
        <div className="[@media(min-width:1421px)]:col-span-6 space-y-6">
          <div className="space-y-2.5 flex flex-col">
            <Label className="text-[13px] font-bold text-gray-700 dark:text-gray-300 ml-1">Section Badge</Label>
            <Input value={data.badge} onChange={(e) => handleChange("badge", e.target.value)} placeholder="e.g. FAQ" className="bg-white dark:bg-page-body border-gray-200 dark:border-(--card-border-color) h-12 text-[15px]" />
          </div>
          <div className="space-y-2.5 flex flex-col">
            <Label className="text-[13px] font-bold text-gray-700 dark:text-gray-300 ml-1">Main Headline</Label>
            <Input value={data.title} onChange={(e) => handleChange("title", e.target.value)} placeholder="Enter section headline" className="bg-white dark:bg-page-body border-gray-200 dark:border-(--card-border-color) h-12 text-[15px] font-medium" />
          </div>
        </div>

        <div className="[@media(min-width:1421px)]:col-span-6">
          <div className="space-y-2.5 flex flex-col">
            <Label className="text-[13px] font-bold text-gray-700 dark:text-gray-300 ml-1">Contextual Description</Label>
            <Textarea value={data.description} onChange={(e) => handleChange("description", e.target.value)} placeholder="Enter FAQ introduction..." rows={5} className="bg-white dark:bg-page-body border-gray-200 dark:border-(--card-border-color) resize-none text-[15px] leading-relaxed p-4" />
          </div>
        </div>
      </div>

      <div className="space-y-8 pt-10 border-t border-gray-100 dark:border-(--card-border-color)">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-gray-900 dark:text-gray-100">Question Selection</h3>
              <p className="text-[12px] text-gray-400">Curate the most frequently asked questions for your visitors</p>
            </div>
          </div>
        </div>

        <div className="space-y-8 max-w-4xl">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" role="combobox" aria-expanded={open} className="w-full [@media(min-width:1421px)]:w-100 justify-between bg-white dark:bg-page-body border-gray-200 dark:border-(--card-border-color) h-12 dark:hover:bg-(--table-hover) rounded-lg px-5 text-gray-500 font-medium shadow-sm">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 opacity-40" />
                  <span>{selectedFaqs.length > 0 ? `${selectedFaqs.length} questions curated` : "Find questions..."}</span>
                </div>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-40" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-(--radix-popover-trigger-width) [@media(min-width:1421px)]:w-125 p-0 rounded-lg border-gray-100 shadow-2xl overflow-hidden" align="start">
              <Command className="dark:bg-page-body">
                <CommandInput placeholder="Search your FAQ knowledge base..." className="h-12 border-none ring-0" />
                <CommandList className="p-1">
                  <CommandEmpty className="py-6 text-center text-xs text-gray-400">No matching questions found.</CommandEmpty>
                  <CommandGroup>
                    {faqsData?.data?.faqs.map((faq) => {
                      const isSelected = selectedFaqs.some((f: any) => (typeof f === "string" ? f === faq._id : f._id === faq._id));
                      return (
                        <CommandItem key={faq._id} onSelect={() => toggleFaq(faq._id)} className="rounded-lg flex dark:hover:bg-(--table-hover) items-center justify-between p-4 mb-1 cursor-pointer">
                          <span className="font-bold text-[14px] truncate pr-4">{faq.title}</span>
                          <div className={cn("w-6 h-6 rounded-full flex items-center justify-center transition-all shrink-0", isSelected ? "bg-primary text-white scale-110 shadow-lg shadow-primary/20" : "bg-gray-100 opacity-20")}>
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

          <div className="space-y-4 px-1">
            {faqsData?.data?.faqs
              .filter((f) => selectedFaqs.some((sf: any) => getObjId(sf) === f._id))
              .map((faq) => (
                <div key={faq._id} className="p-4 md:p-5 bg-white dark:bg-page-body border border-gray-100 dark:border-none rounded-lg flex items-center justify-between group hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/[0.02] relative">
                  <div className="flex items-center gap-4 md:gap-5 min-w-0 pr-10 md:pr-0">
                    <div className="w-10 h-10 md:w-11 md:h-11 rounded-lg bg-primary/3 dark:bg-(--dark-body) border border-primary/5 flex items-center justify-center shrink-0">
                      <HelpCircle className="w-4 h-4 md:w-5 md:h-5 text-primary/40" />
                    </div>
                    <span className="text-[14px] md:text-[15px] font-bold text-gray-800 dark:text-gray-200 truncate">{faq.title}</span>
                  </div>
                  <button onClick={() => toggleFaq(faq._id)} className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-all duration-300 md:opacity-0 group-hover:opacity-100 absolute right-3 md:relative md:right-0 bg-white/80 dark:bg-zinc-800/10 md:bg-transparent shadow-sm md:shadow-none">
                    <X className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </div>
              ))}

            {selectedFaqs.length === 0 && (
              <div className="py-24 border border-dashed border-gray-100 dark:border-(--card-border-color) rounded-lg dark:bg-page-body flex flex-col items-center justify-center bg-gray-50/10 text-gray-400">
                <div className="w-16 h-16 rounded-full bg-gray-50  dark:bg-(--dark-body)  flex items-center justify-center mb-4">
                  <HelpCircle className="w-8 h-8" />
                </div>
                <p className="text-[15px] font-semibold">No questions curated for this section</p>
                <p className="text-[12px] opacity-60">{"Visitors won't see any FAQ section on the landing page"}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaqForm;
