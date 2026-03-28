"use client";

import { COUNTRIES } from "@/src/constants/countries";
import { Button } from "@/src/elements/ui/button";
import { Label } from "@/src/elements/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/elements/ui/select";
import { useCreateShortLinkMutation, useUpdateShortLinkMutation } from "@/src/redux/api/shortLinkApi";
import { ShortLinkData } from "@/src/types/short-link";
import { Loader2, Rocket, Save } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import ShortLinkSteps from "./ShortLinkSteps";

interface ShortLinkFormProps {
  initialData?: ShortLinkData;
  onSuccess: (data: ShortLinkData) => void;
}

const ShortLinkForm: React.FC<ShortLinkFormProps> = ({ initialData, onSuccess }) => {
  const [dialCode, setDialCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");

  const [createShortLink, { isLoading: isCreating }] = useCreateShortLinkMutation();
  const [updateShortLink, { isLoading: isUpdating }] = useUpdateShortLinkMutation();
  const isLoading = isCreating || isUpdating;

  useEffect(() => {
    if (initialData) {
      const sortedCountries = [...COUNTRIES].sort((a, b) => b.dial_code.length - a.dial_code.length);
      const matchedCountry = sortedCountries.find((c) => initialData.mobile.startsWith(c.dial_code.replace("+", "")));

      if (matchedCountry) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setDialCode(matchedCountry.dial_code);
        setPhoneNumber(initialData.mobile.slice(matchedCountry.dial_code.replace("+", "").length));
      } else {
        setPhoneNumber(initialData.mobile);
      }
      setMessage(initialData.first_message);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) {
      toast.error("Phone number is required");
      return;
    }

    const fullMobile = dialCode.replace("+", "") + phoneNumber.replace(/\D/g, "");

    try {
      let result;
      if (initialData) {
        result = await updateShortLink({
          id: initialData._id,
          mobile: fullMobile,
          first_message: message,
        }).unwrap();
        toast.success("Short link updated successfully!");
      } else {
        result = await createShortLink({
          mobile: fullMobile,
          first_message: message,
        }).unwrap();
        toast.success("Short link created successfully!");
      }

      if (result.success) {
        onSuccess(result.data);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex-1 w-full order-2 lg:order-1">
        <div className="bg-white dark:bg-(--card-color) rounded-lg border border-slate-200 dark:border-(--card-border-color) sm:p-8 p-4 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-3">
                <Label className="text-sm font-bold text-slate-700 dark:text-slate-200 ">
                  WhatsApp Phone Number <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-2 flex-wrap">
                  <div className="w-32 shrink-0">
                    <Select
                      value={COUNTRIES.find((c) => c.dial_code === dialCode)?.code || "IN"}
                      onValueChange={(val) => {
                        const country = COUNTRIES.find((c) => c.code === val);
                        if (country) setDialCode(country.dial_code);
                      }}
                    >
                      <SelectTrigger className="h-12 py-6 bg-slate-50 dark:bg-(--page-body-bg) border-slate-200 dark:border-(--card-border-color) rounded-xl font-bold focus:ring-emerald-500/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-64 rounded-lg dark:bg-(--card-color)">
                        {COUNTRIES.map((c) => (
                          <SelectItem key={c.code} value={c.code} className="cursor-pointer py-2.5 dark:hover:bg-(--table-hover)">
                            <span className="flex items-center gap-2">
                              <span className="text-slate-400 text-[10px] w-6 uppercase">{c.code}</span>
                              <span className="font-bold">{c.dial_code}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="e.g. 9876543210" className="flex-1 h-12 px-4 rounded-xl border border-slate-200 dark:border-(--card-border-color) bg-slate-50 dark:bg-(--page-body-bg) text-slate-800 dark:text-slate-100 text-sm font-bold outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-slate-300 placeholder:font-normal" />
                </div>
                <p className="text-[11px] text-slate-400 font-medium italic">
                  Preview:{" "}
                  <span className="text-emerald-500 font-bold not-italic">
                    {dialCode} {phoneNumber || "XXXXXXXXXX"}
                  </span>
                </p>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-bold text-slate-700 dark:text-slate-200 ">
                  Welcome Message <span className="text-slate-400 font-normal ml-2">(Optional)</span>
                </Label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Hi! I'm interested in your services..." rows={4} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-(--card-border-color) bg-slate-50 dark:bg-(--page-body-bg) text-slate-800 dark:text-slate-100 text-sm font-medium outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-slate-300 resize-none leading-relaxed" />
                <p className="text-[11px] text-slate-400 font-medium leading-tight">{"Pre-filled in customer's WhatsApp chat when they tap your link."}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100 dark:border-(--card-border-color)">
              <Button type="button" variant="ghost" onClick={() => window.history.back()} className="w-full sm:w-auto h-12 px-8 text-slate-500 bg-[#F2F2F2] dark:bg-(--page-body-bg) dark:text-gray-400 font-bold">
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto h-12 px-12 gap-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-xl shadow-emerald-600/20 transition-all active:scale-95">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : initialData ? <Save size={18} /> : <Rocket size={18} />}
                <span>{initialData ? "Update Link" : "Generate Link"}</span>
              </Button>
            </div>
          </form>
        </div>
      </div>

      <div className="w-full lg:w-125 shrink-0 order-1 lg:order-2">
        <ShortLinkSteps variant="vertical" />
      </div>
    </div>
  );
};

export default ShortLinkForm;
