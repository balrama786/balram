"use client";

import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { Switch } from "@/src/elements/ui/switch";
import { AuthenticationSectionProps, AuthFormData } from "@/src/types/template";
import { KeyRound, ShieldCheck, Timer } from "lucide-react";

import CharacterCountWrapper from "@/src/shared/CharacterCountWrapper";

export const AuthenticationSection = ({ authData, setAuthData }: AuthenticationSectionProps) => {
  const update = (patch: Partial<AuthFormData>) => setAuthData({ ...authData, ...patch });
  const selectedType = authData.otp_buttons?.[0]?.otp_type ?? "COPY_CODE";

  const setCopyButtonText = (text: string) => update({ otp_buttons: [{ ...authData.otp_buttons?.[0], otp_type: selectedType, copy_button_text: text }] });

  const handleBodyChange = (newBody: string) => {
    const variableMatches = newBody.match(/{{([^}]+)}}/g);
    const uniqueKeys = variableMatches ? Array.from(new Set(variableMatches.map((m) => m.replace(/{{|}}/g, "")))) : [];
    const existingVars = authData.variables_example || [];
    const newVars = uniqueKeys.map((key) => existingVars.find((v) => v.key === key) || { key, example: "" });
    setAuthData({ ...authData, message_body: newBody, variables_example: newVars });
  };

  const updateVariable = (index: number, value: string) => {
    const newVars = [...(authData.variables_example || [])];
    newVars[index] = { ...newVars[index], example: value };
    update({ variables_example: newVars });
  };

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-lg p-4 flex items-start gap-3">
        <ShieldCheck size={18} className="text-amber-500 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="text-sm font-bold text-amber-800 dark:text-amber-400">Authentication Template</p>
          <p className="text-[11px] text-amber-700 dark:text-amber-500 leading-relaxed">Configure the OTP button, security message, and expiry time below.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-(--card-color) p-4 sm:p-6 rounded-lg border border-slate-200 dark:border-(--card-border-color) shadow-sm space-y-4">
        <div>
          <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">Message Body</Label>
          <p className="text-[11px] text-slate-400 mt-1">{"Use {{1}} for the OTP code and {{2}} for expiry minutes."}</p>
        </div>
        <CharacterCountWrapper current={authData.message_body?.replace(/<[^>]*>/g, "").length || 0} max={1600}>
          <textarea value={authData.message_body} onChange={(e) => handleBodyChange(e.target.value)} rows={3} placeholder="Your verification code is {{1}}. Valid for {{2}} minutes." className="w-full resize-none rounded-lg border border-slate-200 dark:border-(--card-border-color) bg-(--input-color) dark:bg-page-body px-4 py-3 text-sm text-slate-800 dark:text-gray-300 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
        </CharacterCountWrapper>
        {(authData.variables_example || []).length > 0 && (
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Variable Examples</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {authData.variables_example.map((v, i) => (
                <div key={v.key} className="space-y-1 flex flex-col">
                  <Label className="text-[11px] text-slate-500 dark:text-gray-400">{"{{" + v.key + "}} Example"}</Label>
                  <Input value={v.example} onChange={(e) => updateVariable(i, e.target.value)} placeholder={`Example value for {{${v.key}}}`} className="h-11 text-sm border-(--input-border-color) p-3 dark:border-(--card-border-color) bg-(--input-color) dark:bg-page-body" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-(--card-color) p-4 sm:p-6 rounded-lg border border-(--input-border-color) dark:border-(--card-border-color) shadow-sm space-y-4">
        <div className="space-y-2 flex flex-col">
          <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">Button Text</Label>
          <CharacterCountWrapper current={authData.otp_buttons?.[0]?.copy_button_text?.length || 0} max={60}>
            <Input placeholder="Copy Code" value={authData.otp_buttons?.[0]?.copy_button_text || ""} onChange={(e) => setCopyButtonText(e.target.value.slice(0, 60))} className="h-11 border-(--input-border-color) p-3 dark:border-(--card-border-color) rounded-lg bg-(--input-color) dark:bg-page-body focus:bg-white dark:focus:bg-page-body transition-all" />
          </CharacterCountWrapper>
          <p className="text-[11px] text-slate-400">The text shown on the OTP action button.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-(--card-color) p-4 sm:p-6 rounded-lg border border-(--input-border-color) dark:border-(--card-border-color) shadow-sm space-y-5">
        <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">OTP Configuration</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2 flex flex-col">
            <Label className="text-sm font-medium text-slate-600 dark:text-gray-400 flex items-center gap-2">
              <KeyRound size={14} /> OTP Code Length
            </Label>
            <Input type="number" min={4} max={8} placeholder="6" value={authData.otp_code_length} onChange={(e) => update({ otp_code_length: e.target.value === "" ? "" : parseInt(e.target.value) })} className="h-11 border-(--input-border-color) p-3 dark:border-(--card-border-color) rounded-lg bg-(--input-color) dark:bg-page-body focus:bg-white dark:focus:bg-page-body transition-all" />
            <p className="text-[11px] text-slate-400">Number of digits in the OTP (4–8).</p>
          </div>
          <div className="space-y-2 flex flex-col">
            <Label className="text-sm font-medium text-slate-600 dark:text-gray-400 flex items-center gap-2">
              <Timer size={14} /> Code Expiry (minutes)
            </Label>
            <Input type="number" min={1} max={90} placeholder="10" value={authData.code_expiration_minutes} onChange={(e) => update({ code_expiration_minutes: e.target.value === "" ? "" : parseInt(e.target.value) })} className="h-11 border-(--input-border-color) p-3 dark:border-(--card-border-color) rounded-lg bg-(--input-color) dark:bg-page-body focus:bg-white dark:focus:bg-page-body transition-all" />
            <p className="text-[11px] text-slate-400">How long the code remains valid (1–90).</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-(--card-color) p-4 sm:p-6 rounded-lg border border-slate-200 dark:border-(--card-border-color) shadow-sm space-y-5">
        <Label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Additional Options</Label>
        <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 mt-2 dark:bg-(--table-hover) border border-(--input-border-color) dark:border-none">
          <div className="space-y-0.5">
            <p className="text-sm font-semibold text-slate-700 dark:text-gray-300">Add Security Recommendation</p>
            <p className="text-[11px] text-slate-400">{'Appends "For your security, do not share this code." to the message.'}</p>
          </div>
          <Switch checked={authData.add_security_recommendation} onCheckedChange={(val) => update({ add_security_recommendation: val })} />
        </div>
        <div className="space-y-2 flex flex-col">
          <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">
            Footer Text <span className="font-normal text-slate-400">(optional)</span>
          </Label>
          <CharacterCountWrapper current={authData.footer_text?.length || 0} max={60}>
            <Input placeholder="e.g. Powered by Our Service" value={authData.footer_text} onChange={(e) => update({ footer_text: e.target.value.slice(0, 60) })} className="h-11 border-(--input-border-color) dark:border-(--card-border-color) p-3 rounded-lg bg-(--input-color) dark:bg-page-body focus:bg-white dark:focus:bg-page-body transition-all" />
          </CharacterCountWrapper>
          <p className="text-[11px] text-slate-400">Shown in small text below the message body.</p>
        </div>
      </div>
    </div>
  );
};
