/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { Textarea } from "@/src/elements/ui/textarea";
import { Button } from "@/src/elements/ui/button";
import { Plus, Trash2, Layout, Image as ImageIcon } from "lucide-react";
import { HeroSection, FloatingImage } from "@/src/types/landingPage";
import ImageSelector from "../shared/ImageSelector";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/elements/ui/select";

interface HeroFormProps {
  data: HeroSection;
  onChange: (data: HeroSection) => void;
}

const HeroForm = ({ data, onChange }: HeroFormProps) => {
  const handleChange = (field: keyof HeroSection, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleButtonChange = (field: "text" | "link", value: string) => {
    onChange({
      ...data,
      primary_button: { ...data.primary_button, [field]: value },
    });
  };

  const handleFloatingImageChange = (index: number, field: keyof FloatingImage, value: any) => {
    const newFloatingImages = [...data.floating_images];
    newFloatingImages[index] = { ...newFloatingImages[index], [field]: value };
    handleChange("floating_images", newFloatingImages);
  };

  const addFloatingImage = () => {
    handleChange("floating_images", [...data.floating_images, { url: "", position: "left-top" }]);
  };

  const removeFloatingImage = (index: number) => {
    handleChange(
      "floating_images",
      data.floating_images.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="space-y-6 [@media(min-width:1421px)]:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 [@media(min-width:1421px)]:grid-cols-12 gap-6 [@media(min-width:1421px)]:gap-10">
        <div className="[@media(min-width:1421px)]:col-span-7 space-y-6 [@media(min-width:1421px)]:space-y-8">
          <div className="grid grid-cols-1 gap-4 [@media(min-width:1421px)]:gap-6">
            <div className="space-y-2 flex flex-col">
              <Label className="text-[13px] font-bold text-gray-700 dark:text-gray-300 ml-1">Badge Text</Label>
              <Input value={data.badge} onChange={(e) => handleChange("badge", e.target.value)} placeholder="e.g. MOST AFFORDABLE PLATFORM" className="bg-white dark:bg-page-body border-gray-200 dark:border-(--card-border-color) h-11 [@media(min-width:1421px)]:h-12 text-[14px] [@media(min-width:1421px)]:text-[15px] focus:ring-primary/20" />
            </div>
            <div className="space-y-2 flex flex-col">
              <Label className="text-[13px] font-bold text-gray-700 dark:text-gray-300 ml-1">Section Title</Label>
              <Input value={data.title} onChange={(e) => handleChange("title", e.target.value)} placeholder="Enter hero title" className="bg-white dark:bg-page-body border-gray-200 dark:border-(--card-border-color) h-11 [@media(min-width:1421px)]:h-12 text-[14px] [@media(min-width:1421px)]:text-[15px] font-medium" />
            </div>
            <div className="space-y-2 flex flex-col">
              <Label className="text-[13px] font-bold text-gray-700 dark:text-gray-300 ml-1">Description</Label>
              <Textarea value={data.description} onChange={(e) => handleChange("description", e.target.value)} placeholder="Enter hero description" rows={5} className="bg-white dark:bg-page-body border-gray-200 dark:border-(--card-border-color) resize-none text-[14px] [@media(min-width:1421px)]:text-[15px] leading-relaxed p-3 md:p-4" />
            </div>
          </div>
        </div>

        <div className="[@media(min-width:1421px)]:col-span-5 space-y-6 [@media(min-width:1421px)]:space-y-8">
          <ImageSelector label="Hero Main Image" value={data.hero_image} onChange={(url) => handleChange("hero_image", url)} />

          <div className="p-4 [@media(min-width:1421px)]:p-6 border border-primary/10 dark:border-primary/5 rounded-2xl [@media(min-width:1421px)]:rounded-3xl bg-primary/2 dark:bg-primary/1 space-y-4 [@media(min-width:1421px)]:space-y-6">
            <div className="flex items-center gap-2 mb-1 lg:mb-2">
              <div className="w-1.5 h-4 bg-primary rounded-full" />
              <Label className="text-[11px] font-black uppercase tracking-widest text-primary">Primary Button</Label>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2 flex flex-col">
                <Label className="text-[12px] font-bold text-gray-500">Label</Label>
                <Input value={data.primary_button.text} onChange={(e) => handleButtonChange("text", e.target.value)} placeholder="Get Started" className="bg-white dark:bg-page-body h-11 text-sm border-gray-100 dark:border-none shadow-sm" />
              </div>
              <div className="space-y-2 flex flex-col">
                <Label className="text-[12px] font-bold text-gray-500">Target Link (Only last route e.g. /dashboard)</Label>
                <Input value={data.primary_button.link} onChange={(e) => handleButtonChange("link", e.target.value)} placeholder="/register" className="bg-white dark:bg-page-body h-11 text-sm border-gray-100 dark:border-none shadow-sm" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6 pt-10 border-t border-gray-100 dark:border-(--card-border-color)">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-gray-900 dark:text-gray-100">Floating Decorative Images</h3>
              <p className="text-[12px] text-gray-400">Small UI elements to enhance landing page visual depth</p>
            </div>
          </div>
          {data.floating_images.length <= 3 && (
            <Button onClick={addFloatingImage} variant="outline" size="sm" className="gap-2 h-10 px-5 rounded-xl border-primary/20 text-primary hover:bg-primary hover:text-white transition-all duration-300">
              <Plus className="w-4 h-4" />
              Add Image
            </Button>
          )}
        </div>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 [@media(min-width:1421px)]:grid-cols-3 xl:grid-cols-4 gap-6 px-1"
        >
          {data.floating_images.map((img, index) => (
            <div key={index} className="group relative p-4 bg-gray-50/50 dark:bg-page-body border border-gray-100 dark:border-(--card-border-color) rounded-lg hover:bg-white dark:hover:bg-(--dark-body) transition-all duration-300">
              <button onClick={() => removeFloatingImage(index)} className="absolute -top-2 -right-2 w-8 h-8 bg-white dark:bg-(--card-color) text-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-xl border border-red-50 dark:border-(--card-border-color) hover:bg-red-500 hover:text-white z-10">
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="space-y-4">
                <ImageSelector label="" value={img.url} onChange={(url) => handleFloatingImageChange(index, "url", url)} className="space-y-0!" />
                <div className="px-1 space-y-2">
                  <Label className="text-[10px] uppercase font-black text-gray-400 tracking-wider">Screen Position</Label>
                  <Select value={img.position} onValueChange={(val) => handleFloatingImageChange(index, "position", val as any)}>
                    <SelectTrigger className="h-10 text-[13px] bg-white dark:bg-(--card-color) border-gray-100 dark:border-none shadow-sm rounded-lg">
                      <SelectValue placeholder="Position" />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg border-gray-100 dark:bg-(--card-color) dark:border-(--card-border-color) shadow-2xl">
                      <SelectItem value="left-top" className="rounded-lg dark:hover:bg-(--table-hover)">
                        Left Top
                      </SelectItem>
                      <SelectItem value="right-top" className="rounded-lg dark:hover:bg-(--table-hover)">
                        Right Top
                      </SelectItem>
                      <SelectItem value="left-bottom" className="rounded-lg dark:hover:bg-(--table-hover)">
                        Left Bottom
                      </SelectItem>
                      <SelectItem value="right-bottom" className="rounded-lg dark:hover:bg-(--table-hover)">
                        Right Bottom
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ))}
          {data.floating_images.length === 0 && (
            <div className="col-span-full py-16 border-2 border-dashed border-gray-200 dark:border-(--card-border-color) rounded-xl flex flex-col items-center justify-center text-gray-400 bg-gray-50/30">
              <Layout className="w-10 h-10 mb-3 opacity-10" />
              <p className="text-[13px] font-medium">No floating images added yet</p>
              <Button onClick={addFloatingImage} variant="link" className="text-primary mt-1">
                Click to add your first image
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroForm;
