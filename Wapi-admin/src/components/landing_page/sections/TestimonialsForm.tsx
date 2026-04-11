/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { cn, getObjId } from "@/lib/utils";
import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { useGetAllTestimonialsQuery } from "@/src/redux/api/testimonialApi";
import { Check, ChevronsUpDown, Star, X, MessageSquareQuote, Search } from "lucide-react";
import { useState } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/src/elements/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/src/elements/ui/popover";

interface TestimonialsFormProps {
  data: any;
  onChange: (data: any) => void;
}

const TestimonialsForm = ({ data, onChange }: TestimonialsFormProps) => {
  const { data: testimonialsData } = useGetAllTestimonialsQuery({});
  const [open, setOpen] = useState(false);

  const handleChange = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const selectedTestimonials = data.testimonials || [];

  const toggleTestimonial = (id: string) => {
    const isSelected = selectedTestimonials.some((t: any) => getObjId(t) === id);
    if (isSelected) {
      handleChange(
        "testimonials",
        selectedTestimonials.filter((t: any) => getObjId(t) !== id)
      );
    } else {
      handleChange("testimonials", [...selectedTestimonials, id]);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 [@media(min-width:1421px)]:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="space-y-2.5 flex flex-col">
            <Label className="text-[13px] font-bold text-gray-700 dark:text-gray-300 ml-1">Section Badge</Label>
            <Input value={data.badge} onChange={(e) => handleChange("badge", e.target.value)} placeholder="e.g. CUSTOMER STORIES" className="bg-white dark:bg-page-body border-gray-200 dark:border-(--card-border-color) h-12 text-[15px]" />
          </div>
          <div className="space-y-2.5 flex flex-col">
            <Label className="text-[13px] font-bold text-gray-700 dark:text-gray-300 ml-1">Headline</Label>
            <Input value={data.title} onChange={(e) => handleChange("title", e.target.value)} placeholder="Enter section title" className="bg-white dark:bg-page-body border-gray-200 dark:border-(--card-border-color) h-12 text-[15px] font-medium" />
          </div>
        </div>
        <div className="flex flex-col justify-center border-l-2 border-primary/5 pl-10 hidden [@media(min-width:1421px)]:flex">
          <p className="text-[13px] text-gray-400 leading-relaxed font-medium">Build trust by showcasing authentic feedback from your power users. Select the most impactful testimonials from your library.</p>
        </div>
      </div>

      <div className="space-y-8 pt-10 border-t border-gray-100 dark:border-(--card-border-color)">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <MessageSquareQuote className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-gray-900 dark:text-gray-100">Testimonial Curation</h3>
              <p className="text-[12px] text-gray-400">Search and pin customer feedback to the public wall</p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" role="combobox" aria-expanded={open} className="w-full [@media(min-width:1421px)]:w-[400px] justify-between bg-white dark:bg-page-body dark:hover:bg-page-body border-gray-200 dark:border-(--card-border-color) h-12 rounded-lg px-5 text-gray-500 font-medium shadow-sm">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 opacity-40" />
                  <span>{selectedTestimonials.length > 0 ? `${selectedTestimonials.length} stories curated` : "Find testimonials..."}</span>
                </div>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-40" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] [@media(min-width:1421px)]:w-[500px] p-0 rounded-lg border-gray-100 dark:border-(--card-border-color) shadow-2xl overflow-hidden" align="start">
              <Command className="dark:bg-page-body">
                <CommandInput placeholder="Search by name or company..." className="h-12" />
                <CommandList className="p-1">
                  <CommandEmpty className="py-6 text-center text-xs text-gray-400">No records found matching your query.</CommandEmpty>
                  <CommandGroup>
                    {testimonialsData?.data?.testimonials.map((testimonial) => {
                      const isSelected = selectedTestimonials.some((t: any) => (typeof t === "string" ? t === testimonial._id : t._id === testimonial._id));
                      return (
                        <CommandItem key={testimonial._id} onSelect={() => toggleTestimonial(testimonial._id)} className="rounded-lg dark:hover:bg-(--table-hover) flex items-center justify-between p-3 mb-1 cursor-pointer">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-full bg-primary/5 flex items-center justify-center text-primary font-bold text-xs ring-1 ring-primary/10 shrink-0">
                              {testimonial.user_name.charAt(0)}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="font-bold text-[14px] truncate">{testimonial.user_name}</span>
                              <span className="text-[11px] text-gray-400 font-medium truncate">{testimonial.title}</span>
                            </div>
                          </div>
                          <div className={cn("w-6 h-6 rounded-full flex items-center justify-center transition-all", isSelected ? "bg-primary text-white scale-110 shadow-lg shadow-primary/20" : "bg-gray-100 opacity-20")}>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 px-1">
            {testimonialsData?.data?.testimonials
              .filter((t) => selectedTestimonials.some((st: any) => getObjId(st) === t._id))
              .map((testimonial) => (
                <div key={testimonial._id} className="p-5 md:p-6 bg-white dark:bg-page-body border border-gray-100 dark:border-(--card-border-color) rounded-lg  shadow-sm hover:shadow-xl hover:shadow-primary/[0.03] dark:border-none transition-all duration-300 relative group animate-in fade-in zoom-in-95 duration-500">
                  <button onClick={() => toggleTestimonial(testimonial._id)} className="absolute -top-1 -right-1 w-8 h-8 bg-white dark:bg-(--card-color) text-gray-400 hover:text-red-500 rounded-full border border-gray-50 dark:border-none flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-xl z-20 hover:scale-110 active:scale-95">
                    <X className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-3 md:gap-4 mb-5">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-[1.2rem] bg-primary/3 dark:bg-primary/[0.01] border border-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-lg md:text-xl font-black text-primary/40">{testimonial.user_name.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[15px] md:text-[16px] font-bold text-gray-900 dark:text-gray-100 truncate">{testimonial.user_name}</p>
                      <div className="flex items-center gap-0.5 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={cn("w-3 h-3 transition-colors", i < (testimonial.rating || 5) ? "fill-orange-400 text-orange-400" : "text-gray-100")} />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50/50 dark:bg-(--dark-body) rounded-lg p-4">
                    <p className="text-[13px] font-medium text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed tracking-tight italic">
                      {testimonial.title}
                    </p>
                  </div>
                </div>
              ))}

            {selectedTestimonials.length === 0 && (
              <div className="col-span-full py-20 border border-dashed border-gray-100 dark:border-(--card-border-color) rounded-lg flex flex-col items-center justify-center bg-gray-50/10 text-gray-400 dark:bg-(--page-body-bg)">
                <MessageSquareQuote className="w-12 h-12 mb-4 opacity-10" />
                <p className="text-[15px] font-semibold">Your social proof wall is currently empty</p>
                <p className="text-[12px] opacity-60">Add some customer testimonials to start building credibility</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsForm;
