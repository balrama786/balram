/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { Textarea } from "@/src/elements/ui/textarea";
import { PlatformItem, PlatformSection } from "@/src/types/landingPage";
import { GripVertical, Monitor, Plus, Rocket, Sparkles, Trash2 } from "lucide-react";
import ImageSelector from "../shared/ImageSelector";

interface PlatformFormProps {
    data: PlatformSection;
    onChange: (data: PlatformSection) => void;
}

const PlatformForm = ({ data, onChange }: PlatformFormProps) => {
    const handleChange = (field: keyof PlatformSection, value: any) => {
        onChange({ ...data, [field]: value });
    };

    const handleItemChange = (index: number, field: keyof PlatformItem, value: any) => {
        const newItems = [...data.items];
        newItems[index] = { ...newItems[index], [field]: value };
        handleChange("items", newItems);
    };

    const addItem = () => {
        handleChange("items", [
            ...data.items,
            { step: data.items.length + 1, tagline: "", title: "", description: "", bullets: [], image: "" },
        ]);
    };

    const removeItem = (index: number) => {
        const filteredItems = data.items.filter((_, i) => i !== index);
        // Re-index steps
        const reindexedItems = filteredItems.map((item, i) => ({ ...item, step: i + 1 }));
        handleChange("items", reindexedItems);
    };

    const handleBulletChange = (itemIndex: number, bulletIndex: number, value: string) => {
        const newItems = [...data.items];
        const newBullets = [...newItems[itemIndex].bullets];
        newBullets[bulletIndex] = value;
        newItems[itemIndex] = { ...newItems[itemIndex], bullets: newBullets };
        handleChange("items", newItems);
    };

    const addBullet = (itemIndex: number) => {
        const newItems = [...data.items];
        newItems[itemIndex] = {
            ...newItems[itemIndex],
            bullets: [...newItems[itemIndex].bullets, ""],
        };
        handleChange("items", newItems);
    };

    const removeBullet = (itemIndex: number, bulletIndex: number) => {
        const newItems = [...data.items];
        newItems[itemIndex] = {
            ...newItems[itemIndex],
            bullets: newItems[itemIndex].bullets.filter((_, i) => i !== bulletIndex),
        };
        handleChange("items", newItems);
    };

    return (
      <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header Configuration */}
        <div className="grid grid-cols-1 [@media(min-width:1421px)]:grid-cols-12 gap-8">
          <div className="[@media(min-width:1421px)]:col-span-7 space-y-6">
            <div className="space-y-2.5">
              <Label className="text-[13px] font-bold text-gray-700 dark:text-gray-300 ml-1">Section Badge</Label>
              <Input value={data.badge} onChange={(e) => handleChange("badge", e.target.value)} placeholder="e.g. PLATFORM" className="bg-white dark:bg-page-body border-gray-200 dark:border-(--card-border-color) h-12 text-[15px]" />
            </div>
            <div className="space-y-2.5">
              <Label className="text-[13px] font-bold text-gray-700 dark:text-gray-300 ml-1">Main Headline</Label>
              <Input value={data.title} onChange={(e) => handleChange("title", e.target.value)} placeholder="Enter section headline" className="bg-white dark:bg-page-body border-gray-200 dark:border-(--card-border-color) h-12 text-[15px] font-medium" />
            </div>
          </div>
        </div>

        {/* Workflow Items Section */}
        <div className="space-y-6 pt-10 border-t border-gray-100 dark:border-(--card-border-color)">
          <div className="flex items-center justify-between flex-wrap gap-3 sm:gap-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Monitor className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-gray-900 dark:text-gray-100">Workflow Interaction Nodes</h3>
                <p className="text-[12px] text-gray-400">Add detailed platform steps to guide your users</p>
              </div>
            </div>
            <Button onClick={addItem} size="sm" className="gap-2 h-10 px-6 rounded-lg bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20">
              <Plus className="w-4 h-4" />
              Add New Step
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6 md:gap-8">
            {data.items.map((item, itemIndex) => (
              <div key={itemIndex} className="group relative flex flex-col xl:flex-row gap-6 md:gap-8 p-5 md:p-8 bg-white border border-gray-100 dark:border-(--card-border-color) rounded-lg dark:bg-(--dark-body) dark:border-none shadow-sm transition-all duration-300">
                {/* Drag Handle (Visual only for now) */}
                <div className="absolute top-10 left-2 hidden md:flex flex-col items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-1 h-12 bg-gray-100 dark:bg-gray-800 rounded-full" />
                  <GripVertical className="w-4 h-4 text-gray-300" />
                </div>

                <div className="flex-1 grid grid-cols-1 [@media(min-width:1421px)]:grid-cols-12 gap-8 xl:pl-4">
                  {/* Column 1: Image and Step Metadata */}
                  <div className="[@media(min-width:1421px)]:col-span-4 xl:col-span-4 space-y-6">
                    <ImageSelector label="Visual Representation" value={item.image} onChange={(url) => handleItemChange(itemIndex, "image", url)} className="space-y-2! md:max-w-md xl:max-w-none mx-auto lg:mx-0" />

                    <div
                      className="grid grid-cols-2 gap-4 [@media(max-width:475px)]:grid-cols-1"
                    >
                      <div className="space-y-2 px-1">
                        <Label className="text-[11px] font-black text-primary/60 uppercase tracking-widest flex items-center gap-1.5">
                          <Rocket className="w-3 h-3" />
                          Step {itemIndex + 1}
                        </Label>
                        <div className="h-10 flex items-center px-4 bg-primary/5 dark:bg-primary/10 text-primary text-[13px] font-black rounded-lg border border-primary/10">
                          NODE #0{itemIndex + 1}
                        </div>
                      </div>
                      <div className="space-y-2 px-1">
                        <Label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Small Tag</Label>
                        <Input value={item.tagline} onChange={(e) => handleItemChange(itemIndex, "tagline", e.target.value)} placeholder="TAGLINE" className="h-10 text-xs bg-gray-50/50 dark:bg-page-body border-none rounded-lg" />
                      </div>
                    </div>
                  </div>

                  {/* Column 2: Content and Highlights */}
                  <div className="[@media(min-width:1421px)]:col-span-7 xl:col-span-8 space-y-6">
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label className="text-[13px] font-bold text-gray-700 dark:text-gray-300 ml-1">Step Title</Label>
                        <Input value={item.title} onChange={(e) => handleItemChange(itemIndex, "title", e.target.value)} placeholder="e.g. AI Workflow Builder" className="bg-gray-50/50 dark:bg-page-body border-none h-12 text-[15px] font-bold rounded-lg" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[13px] font-bold text-gray-700 dark:text-gray-300 ml-1">Brief Narrative</Label>
                        <Textarea value={item.description} onChange={(e) => handleItemChange(itemIndex, "description", e.target.value)} placeholder="Explain how this step benefits the user..." rows={2} className="bg-gray-50/50 dark:bg-page-body border-none resize-none text-[14px] leading-relaxed p-4 rounded-lg" />
                      </div>
                    </div>

                    {/* Bullet Highlights */}
                    <div className="space-y-4 bg-gray-50/30 dark:bg-(--card-color) p-5 rounded-lg border border-gray-100 dark:border-none">
                      <div className="flex items-center justify-between px-1 flex-wrap gap-2 sm:gap-0">
                        <Label className="text-[11px] font-black text-primary uppercase tracking-widest flex items-center gap-2">
                          <Sparkles className="w-3 h-3" />
                          Key Features
                        </Label>
                        <Button variant="ghost" size="sm" onClick={() => addBullet(itemIndex)} className="h-8 text-[11px] font-bold text-primary hover:bg-primary/10 rounded-lg px-2">
                          <Plus className="w-3 h-3 mr-1" />
                          Add Node
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {item.bullets.map((bullet, bulletIndex) => (
                          <div key={bulletIndex} className="group/bullet relative">
                            <Input value={bullet} onChange={(e) => handleBulletChange(itemIndex, bulletIndex, e.target.value)} placeholder="Add feature..." className="h-10 text-[13px] bg-white dark:bg-page-body border-none shadow-sm rounded-lg pl-4 pr-10" />
                            <Button onClick={() => removeBullet(itemIndex, bulletIndex)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-300 hover:text-red-500 opacity-0 group-hover/bullet:opacity-100 transition-all hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg">
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        ))}
                        {item.bullets.length === 0 && <div className="col-span-full py-4 text-center border border-dashed border-gray-200 dark:border-gray-800 rounded-lg text-gray-400 text-[11px] font-medium">No highlight points added yet</div>}
                      </div>
                    </div>
                  </div>

                  {/* Remove Step Button */}
                  <div className="absolute top-4 right-4 md:top-8 md:right-8">
                    <Button onClick={() => removeItem(itemIndex)} className="w-10 h-10 text-slate-400 hover:text-red-500 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-300 bg-white/80 dark:bg-zinc-800/10 md:bg-transparent shadow-sm md:shadow-none">
                      <Trash2 className="w-5 h-5 [@media(min-width:1421px)]:w-6 [@media(min-width:1421px)]:h-6" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {data.items.length === 0 && (
              <div className="py-32 border-2 border-dashed border-gray-100 dark:border-(--card-border-color) rounded-[3.5rem] flex flex-col items-center justify-center text-gray-300 bg-gray-50/20">
                <div className="w-20 h-20 rounded-full bg-gray-50 dark:bg-zinc-900/50 flex items-center justify-center mb-6">
                  <Rocket className="w-10 h-10 opacity-10" />
                </div>
                <p className="text-[16px] font-bold text-gray-400">Your platform story starts here</p>
                <Button onClick={addItem} variant="link" className="text-primary mt-2 text-[14px]">
                  Create your first platform node
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
};

export default PlatformForm;
