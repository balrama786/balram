/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { Textarea } from "@/src/elements/ui/textarea";
import { FeatureItem, FeaturesSection } from "@/src/types/landingPage";
import { GripVertical, Plus, Rocket, Sparkles, Trash2 } from "lucide-react";
import ImageSelector from "../shared/ImageSelector";

interface FeaturesFormProps {
  data: FeaturesSection;
  onChange: (data: FeaturesSection) => void;
}

const FeaturesForm = ({ data, onChange }: FeaturesFormProps) => {
  const handleChange = (field: keyof FeaturesSection, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleButtonChange = (field: "text" | "link", value: string) => {
    onChange({
      ...data,
      cta_button: { ...data.cta_button, [field]: value },
    });
  };

  const handleFeatureChange = (index: number, field: keyof FeatureItem, value: string) => {
    const newFeatures = [...data.features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    handleChange("features", newFeatures);
  };

  const addFeature = () => {
    handleChange("features", [...data.features, { title: "", description: "", icon: "", image: "" }]);
  };

  const removeFeature = (index: number) => {
    handleChange(
      "features",
      data.features.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 [@media(min-width:1421px)]:grid-cols-12 gap-10">
        <div className="[@media(min-width:1421px)]:col-span-7 space-y-8">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2 flex flex-col .5">
              <Label className="text-[13px] font-bold text-gray-700 dark:text-gray-300 ml-1">Section Badge</Label>
              <Input value={data.badge} onChange={(e) => handleChange("badge", e.target.value)} placeholder="e.g. WHY CHOOSE US" className="bg-white dark:bg-page-body border-gray-200 dark:border-(--card-border-color) h-12 text-[15px]" />
            </div>
            <div className="space-y-2 flex flex-col .5">
              <Label className="text-[13px] font-bold text-gray-700 dark:text-gray-300 ml-1">Headline</Label>
              <Input value={data.title} onChange={(e) => handleChange("title", e.target.value)} placeholder="Enter section headline" className="bg-white dark:bg-page-body border-gray-200 dark:border-(--card-border-color) h-12 text-[15px] font-medium" />
            </div>
            <div className="space-y-2 flex flex-col .5">
              <Label className="text-[13px] font-bold text-gray-700 dark:text-gray-300 ml-1">Description Text</Label>
              <Textarea value={data.description} onChange={(e) => handleChange("description", e.target.value)} placeholder="Enter descriptive text for this section" rows={4} className="bg-white dark:bg-page-body border-gray-200 dark:border-(--card-border-color) resize-none text-[15px] leading-relaxed p-4" />
            </div>
          </div>
        </div>

        <div className="[@media(min-width:1421px)]:col-span-5 flex flex-col ">
          <div className="p-6 border border-primary/10 dark:border-none rounded-lg bg-primary/2 dark:bg-(--dark-body) space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-4 bg-primary rounded-full" />
              <Label className="text-[11px] font-black uppercase tracking-widest text-primary">Call to Action Button</Label>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2 flex flex-col ">
                <Label className="text-[12px] font-bold text-gray-500">Button Label</Label>
                <Input value={data.cta_button.text} onChange={(e) => handleButtonChange("text", e.target.value)} placeholder="View More Features" className="bg-white dark:bg-page-body h-11 text-sm border-gray-100 dark:border-none shadow-sm" />
              </div>
              <div className="space-y-2 flex flex-col ">
                <Label className="text-[12px] font-bold text-gray-500">Target URL</Label>
                <Input value={data.cta_button.link} onChange={(e) => handleButtonChange("link", e.target.value)} placeholder="/features-guide" className="bg-white dark:bg-page-body h-11 text-sm border-gray-100 dark:border-none shadow-sm" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6 pt-10 border-t border-gray-100 dark:border-(--card-border-color)">
        <div className="flex items-center justify-between flex-wrap gap-3 sm:gap-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-gray-900 dark:text-gray-100">Key Performance Highlights</h3>
              <p className="text-[12px] text-gray-400">Add detailed features that make your platform stand out</p>
            </div>
          </div>
          <Button onClick={addFeature} size="sm" className="gap-2 h-10 px-6 rounded-lg bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20">
            <Plus className="w-4 h-4" />
            Add Feature
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {data.features.map((feature, index) => (
            <div key={index} className="group relative flex flex-col xl:flex-row gap-6 p-4 md:p-6 bg-white dark:bg-(--dark-body) border border-gray-100 dark:border-none rounded-lg shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary/3 hover:border-primary/20">
              <div className="absolute top-6 left-2 hidden md:flex flex-col items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-1 h-12 bg-gray-100 dark:bg-gray-800 rounded-full" />
                <GripVertical className="w-4 h-4 text-gray-300 cursor-grab active:cursor-grabbing" />
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 md:pl-4">
                <div className="md:col-span-4 xl:col-span-3 space-y-4 md:space-y-6">
                  <ImageSelector label="Visual Art" value={feature.image} onChange={(url) => handleFeatureChange(index, "image", url)} className="space-y-2!" />
                </div>

                <div className="[@media(min-width:1421px)]:col-span-7 xl:col-span-7 space-y-4 md:space-y-6 md:py-2">
                  <div className="space-y-2 flex flex-col  md:space-y-3">
                    <Label className="text-[13px] font-bold text-gray-700 dark:text-gray-300">Feature Title</Label>
                    <Input value={feature.title} onChange={(e) => handleFeatureChange(index, "title", e.target.value)} placeholder="e.g. Real-time Analytics" className="bg-gray-50/50 dark:bg-page-body border-none h-11 md:h-12 text-[14px] md:text-[15px] font-bold rounded-xl" />
                  </div>
                  <div className="space-y-2 flex flex-col  md:space-y-3">
                    <Label className="text-[13px] font-bold text-gray-700 dark:text-gray-300">Detailed Points</Label>
                    <Textarea value={feature.description} onChange={(e) => handleFeatureChange(index, "description", e.target.value)} placeholder="Describe the core benefits..." rows={3} className="bg-gray-50/50 dark:bg-page-body border-none resize-none text-[13px] md:text-[14px] leading-relaxed p-3 md:p-4 rounded-xl" />
                  </div>
                </div>

                <div className="md:col-span-1 flex items-center md:items-start justify-end pr-2 pt-0 md:pt-2 absolute md:relative top-4 right-4 md:top-0 md:right-0">
                  <Button onClick={() => removeFeature(index)} className="w-10 h-10 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg shadow-none transition-all duration-300 bg-white/80 dark:bg-zinc-900/80 md:bg-transparent">
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {data.features.length === 0 && (
            <div className="py-24 border-2 border-dashed border-gray-100 dark:border-(--card-border-color) rounded-[3rem] flex flex-col items-center justify-center text-gray-300 bg-gray-50/20">
              <Rocket className="w-12 h-12 mb-4 opacity-10" />
              <p className="text-[15px] font-semibold">Ready to showcase your product features?</p>
              <Button onClick={addFeature} variant="link" className="text-primary mt-1 text-[13px]">
                Add your first feature card
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeaturesForm;
