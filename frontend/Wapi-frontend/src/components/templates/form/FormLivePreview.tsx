/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormLivePreviewProps } from "@/src/types/components/Template";
import { ArrowLeft, Image as ImageIcon } from "lucide-react";
import { useEffect, useMemo } from "react";
import { TemplatePreviewBubble } from "./TemplatePreviewBubble";

const resolveBody = (messageBody: string, variables_example: { key: string; example: string }[]) => {
  if (!messageBody) return "Message content goes here...";
  let text = messageBody
    .replace(/&nbsp;/g, " ")
    .replace(/<p>/g, "")
    .replace(/<\/p>/g, "\n")
    .replace(/<br\s*\/?>/g, "\n")
    .replace(/<[^>]*>?/gm, "");
  variables_example.forEach((v: any) => {
    const escapedKey = v?.key?.toString().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    text = text.replace(new RegExp(`\\{\\{${escapedKey}\\}\\}`, "g"), v.example || `{{${v.key}}}`);
  });
  return text.trim() || "Message content goes here...";
};

export const FormLivePreview = ({ templateType, headerText, messageBody, variables_example, footerText, buttons, headerFile, mediaUrl, marketingType = "none", offerText, productCards = [], mediaCards = [], mediaButtonTemplates = [], authData }: FormLivePreviewProps) => {
  const fileUrl = useMemo(() => {
    if (headerFile) return URL.createObjectURL(headerFile);
    return mediaUrl || null;
  }, [headerFile, mediaUrl]);

  useEffect(() => {
    if (!fileUrl) return;
    return () => {
      URL.revokeObjectURL(fileUrl);
    };
  }, [fileUrl]);

  const bodyText = resolveBody(messageBody, variables_example);

  return (
    <div className="w-full flex flex-col items-center max-w-sm mx-auto justify-center">
      <div className="w-full max-w-77.5 bg-neutral-900 rounded-[2.5rem] p-1 border border-neutral-800 shadow-2xl relative ring-1 ring-neutral-700/50">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-neutral-900 rounded-b-2xl z-20"></div>
        <div className="w-full h-full bg-[#E5DDD5] rounded-[2.2rem] overflow-hidden flex flex-col min-h-150 max-h-150">
          {/* Phone header bar */}
          <div className="bg-[#075E54] p-4 pt-8 flex items-center gap-3 shrink-0">
            <ArrowLeft size={18} className="text-white" />
            <div className="w-8 h-8 rounded-full bg-emerald-800 flex items-center justify-center overflow-hidden">
              <ImageIcon size={16} className="text-emerald-200" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-white text-sm font-bold truncate">Your Brand</h4>
              <p className="text-[10px] text-emerald-100/70 py-0">Business Account</p>
            </div>
          </div>

          <TemplatePreviewBubble templateType={templateType} headerText={headerText} bodyText={bodyText} footerText={footerText} buttons={buttons} fileUrl={fileUrl} marketingType={marketingType} offerText={offerText} productCards={productCards} mediaCards={mediaCards} mediaButtonTemplates={mediaButtonTemplates} authData={authData} />
        </div>
      </div>
      {/* <p className="mt-8 text-[11px] text-slate-500 dark:text-gray-400 text-center max-w-60 leading-relaxed">This is just a preview. The actual message may appear differently.</p> */}
    </div>
  );
};
