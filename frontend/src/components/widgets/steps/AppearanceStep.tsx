import { Label } from "@/src/elements/ui/label";
import { Input } from "@/src/elements/ui/input";
import { Check, Palette, Phone } from "lucide-react";
import { cn } from "@/src/utils";
import { ColorRow } from "./ColorRow";
import { StepProps } from "./widget-types";
import { CountrySelect } from "../../shared/CountrySelect";
import { COUNTRIES } from "../../../constants/countries";
import { useEffect, useState } from "react";

export const AppearanceStep = ({ data, onChange, isStandalone }: StepProps) => {
  const initialValue = typeof data.whatsapp_phone_number === "string" ? data.whatsapp_phone_number : "";

  const matchedCountry = initialValue ? [...COUNTRIES].sort((a, b) => b.dial_code.length - a.dial_code.length).find((c) => initialValue.startsWith(c.dial_code)) : null;

  const [dialCode, setDialCode] = useState(matchedCountry?.dial_code || "");
  const [phoneNumber, setPhoneNumber] = useState(matchedCountry ? initialValue.slice(matchedCountry.dial_code.length) : initialValue);

  useEffect(() => {
    const newValue = `${dialCode}${phoneNumber}`;
    if (isStandalone && dialCode && phoneNumber && newValue !== data.whatsapp_phone_number) {
      onChange("whatsapp_phone_number", newValue);
    }
  }, [dialCode, phoneNumber, isStandalone, onChange, data.whatsapp_phone_number]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {isStandalone && (
        <div className="space-y-4 p-5 bg-emerald-50/50 dark:bg-emerald-500/5 rounded-2xl border border-emerald-100 dark:border-emerald-500/10">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-emerald-500/10 rounded-lg">
              <Phone size={16} className="text-emerald-600" />
            </div>
            <Label className="text-sm font-bold text-slate-700 dark:text-emerald-400">Target WhatsApp Number</Label>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1">
              <CountrySelect
                value={COUNTRIES.find((c) => c.dial_code === dialCode)?.name || ""}
                onChange={(val) => {
                  const country = COUNTRIES.find((c) => c.name === val);
                  if (country) setDialCode(country.dial_code);
                }}
                placeholder="Code"
              />
            </div>
            <div className="sm:col-span-2">
              <Input type="number" placeholder="Phone Number (e.g. 9876543210)" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="h-11 bg-white dark:bg-(--page-body-bg) border border-slate-200 dark:border-none focus:border-primary rounded-lg" />
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <Label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Widget Position</Label>
        <div className="grid grid-cols-2 gap-3 [@media(max-width:566px)]:grid-cols-1!">
          {(["bottom-right", "bottom-left"] as const).map((pos) => (
            <button key={pos} onClick={() => onChange("widget_position", pos)} className={cn("relative p-4 rounded-lg border text-sm font-medium transition-all duration-200", data.widget_position === pos ? "border-primary bg-primary/5 text-primary" : "border-slate-200 dark:border-(--card-border-color) text-slate-500 hover:border-primary/40")}>
              <div className={cn("absolute bottom-3 text-current opacity-40", pos === "bottom-right" ? "right-3" : "left-3")}>
                <div className="w-5 h-5 rounded-full bg-current" />
              </div>
              <span className="relative z-10">{pos === "bottom-right" ? "Bottom Right" : "Bottom Left"}</span>
              {data.widget_position === pos && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                  <Check size={10} className="text-white" />
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <ColorRow label="Widget Button Color" value={data.widget_color} onChange={(v) => onChange("widget_color", v)} fallback="#A53846" />

      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Widget Image / Logo</Label>
        <label className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-(--page-body-bg) rounded-lg border border-dashed border-slate-200 dark:border-none hover:border-primary/50 transition-colors cursor-pointer group [@media(max-width:443px)]:flex-wrap! [@media(max-width:443px)]:justify-center!">
          <div className="w-12 h-12 rounded-lg bg-white dark:bg-(--dark-body) shadow-inner border border-slate-200 dark:border-none flex items-center justify-center shrink-0 overflow-hidden relative">
            {typeof data.widget_image === "string" && data.widget_image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={data.widget_image} alt="logo" className="w-full h-full object-cover" />
            ) : (data.widget_image as unknown) instanceof File ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={URL.createObjectURL(data.widget_image as unknown as File)} alt="logo" className="w-full h-full object-cover" />
            ) : (
              <Palette size={20} className="text-slate-400 group-hover:text-primary transition-colors" />
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 group-hover:text-primary transition-colors">{(data.widget_image as unknown) instanceof File ? (data.widget_image as unknown as File).name : typeof data.widget_image === "string" && data.widget_image ? "Logo uploaded — click to change" : "Click to upload logo"}</p>
            <p className="text-xs text-slate-400 mt-0.5">PNG, JPG, SVG — Max 2MB — 80x80px recommended</p>
          </div>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onChange("widget_image", file);
            }}
          />
        </label>
      </div>
    </div>
  );
};
