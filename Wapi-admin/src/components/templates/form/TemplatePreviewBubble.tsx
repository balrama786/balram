/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useDraggableScroll } from "@/src/hooks/useDraggableScroll";
import { TemplatePreviewBubbleProps } from "@/src/types/template";
import { BookOpen, Copy, FileText, Gift, Image as ImageIcon, Link, MapPin, Phone, ShieldCheck, ShoppingBag, Smartphone, Video } from "lucide-react";
import Image from "next/image";

export const TemplatePreviewBubble = ({ templateType, headerText, bodyText, footerText, buttons, fileUrl, marketingType = "none", offerText, productCards = [], mediaCards = [], authData }: TemplatePreviewBubbleProps) => {
  const productScroll = useDraggableScroll();
  const mediaScroll = useDraggableScroll();

  const isLimitedTimeOffer = marketingType === "limited_time_offer";
  const isCarouselProduct = marketingType === "carousel_product";
  const isCarouselMedia = marketingType === "carousel_media";
  const isCatalog = marketingType === "catalog";
  const isCallPermission = marketingType === "call_permission";
  const isAuthentication = marketingType === "authentication";
  const isSpecial = marketingType !== "none";

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 pt-6 bg-[url('/assets/images/1.png')] bg-cover bg-center bg-no-repeat custom-scrollbar">
      <div className="mx-auto w-fit px-2 py-0.5 bg-sky-100/80 rounded text-[9px] uppercase font-bold text-sky-700 shadow-sm border border-sky-200/50 shrink-0 mb-2">Today</div>

      <div className="bg-white dark:bg-(--card-color) rounded-lg shadow-sm overflow-hidden max-w-[95%] border dark:border-(--card-border-color) border-(--input-border-color) shrink-0">
        {isLimitedTimeOffer && (
          <div className="bg-white p-3 border-b border-(--input-border-color) dark:bg-(--card-color) dark:border-(--card-border-color)">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-(--dark-body) flex items-center justify-center text-primary shrink-0">
                <Gift size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-slate-900 truncate dark:text-gray-300">{offerText || "Limited time offer"}</h4>
                <p className="text-[11px] text-slate-500 dark:text-gray-400">Offer ends very soon</p>
                {buttons?.find((b: any) => b.type === "copy_code")?.text && <p className="text-[11px] text-slate-400 mt-0.5 font-medium uppercase tracking-wider">Code: {buttons.find((b: any) => b.type === "copy_code").text}</p>}
              </div>
            </div>
          </div>
        )}
        {isCatalog && (
          <div className="border-b border-(--input-border-color) dark:border-(--card-border-color)">
            <div className="flex items-center gap-2.5 p-3">
              <div className="w-10 h-10 rounded-lg bg-(--light-primary) border border-(--input-border-color) dark:bg-(--dark-body) dark:border-none flex items-center justify-center shrink-0 overflow-hidden">
                <ShoppingBag size={22} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-bold text-slate-800 leading-tight truncate dark:text-gray-300">View Green Valley&apos;s</p>
                <p className="text-[12px] font-bold text-slate-800 dark:text-gray-300 leading-tight">catalog on WhatsApp</p>
                <p className="text-[10px] text-slate-400 dark:text-gray-300 mt-0.5 leading-snug">Browse pictures and details of our offerings.</p>
              </div>
            </div>
          </div>
        )}
        {isAuthentication && (
          <div className="p-3 flex items-center gap-2.5 border-b border-(--input-border-color) dark:border-(--card-border-color) bg-green-50 dark:bg-(--card-color)">
            <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-(--dark-body) flex items-center justify-center shrink-0">
              <ShieldCheck size={15} className="text-primary" />
            </div>
            <div>
              <p className="text-[12px] font-bold text-slate-800 leading-tight dark:text-gray-400">OTP Verification</p>
              <p className="text-[10px] text-slate-500 dark:text-gray-500">Tap to copy your one-time code</p>
            </div>
          </div>
        )}
        {isCallPermission && (
          <div className="p-3 flex items-center gap-2.5 border-b border-(--input-border-color) dark:border-(--card-border-color)">
            <div className="w-8 h-8 rounded-full bg-(--light-primary) dark:bg-(--dark-body) flex items-center justify-center shrink-0">
              <Phone size={15} className="text-primary" />
            </div>
            <p className="text-[12px] font-bold text-slate-800 dark:text-gray-300">Can Your Brand call you?</p>
          </div>
        )}
        {!isSpecial && (fileUrl || templateType === "location") && templateType !== "text" && templateType !== "none" && (
          <div className="aspect-video bg-slate-100 flex items-center justify-center text-slate-400 overflow-hidden relative">
            {fileUrl ? (
              <Image src={fileUrl} alt="Media" className="w-full h-full object-cover" width={100} height={100} unoptimized />
            ) : (
              <div className="w-full h-full bg-slate-50 flex items-center justify-center">
                <MapPin size={40} className="text-slate-200" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/10 flex items-center justify-center pointer-events-none">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                {templateType === "image" && <ImageIcon size={20} />}
                {templateType === "video" && <Video size={20} />}
                {templateType === "document" && <FileText size={20} />}
                {templateType === "location" && <MapPin size={20} />}
              </div>
            </div>
          </div>
        )}
        {!isSpecial && headerText && <div className="p-3 font-bold text-sm text-slate-900 dark:text-gray-300 border-b dark:border-(--card-border-color) border-(--input-border-color) wrap-break-word">{headerText}</div>}

        <div className="p-3 space-y-2">
          <div className="text-sm text-slate-800 leading-relaxed dark:text-gray-400 whitespace-pre-wrap wrap-break-word">{bodyText}</div>
          {isAuthentication && authData?.add_security_recommendation && <div className="text-[11px] text-slate-500 italic dark:text-gray-400">For your security, do not share this code.</div>}
          {isAuthentication && authData?.code_expiration_minutes && <div className="text-[11px] text-slate-400 dark:text-gray-400">⏱ Code expires in {authData.code_expiration_minutes} minutes.</div>}
          {!isSpecial && footerText && <div className="text-[11px] text-slate-400 font-medium">{footerText}</div>}
          {isAuthentication && footerText && <div className="text-[11px] text-slate-400 font-medium">{footerText}</div>}
          <div className="text-[10px] text-slate-400 text-right mt-1">10:57 AM</div>
        </div>

        {!isCarouselProduct && !isCarouselMedia && !isCatalog && !isCallPermission && !isAuthentication && buttons && buttons.length > 0 && (
          <div className="border-t border-(--input-border-color) divide-y divide-slate-100 bg-white/50">
            {buttons.map((btn, idx) => (
              <div key={btn.id || idx} className="w-full py-2.5 px-4 text-[12px] font-bold text-sky-500 flex items-center justify-center gap-2">
                {btn.type === "phone_call" && <Smartphone size={13} />}
                {(btn.type === "url" || btn.type === "website" || btn.type === "website_url") && <Link size={13} />}
                {btn.type === "copy_code" && <Copy size={13} />}
                {btn.type === "catalog" && <BookOpen size={13} />}
                {btn.type === "copy_code" ? "Copy Code" : btn.text || "Button"}
              </div>
            ))}
          </div>
        )}
        {isAuthentication && (
          <div className="border-t border-(--input-border-color) dark:bg-(--card-color) bg-white/50 dark:border-(--card-border-color)">
            <div className="w-full py-2.5 px-4 text-[12px] font-bold text-sky-500 flex items-center justify-center gap-1.5">
              <Copy size={12} />
              {authData?.otp_buttons?.[0]?.copy_button_text || "Copy Code"}
            </div>
          </div>
        )}
        {isCatalog && (
          <div className="border-t border-(--input-border-color) dark:bg-(--card-color) bg-white/50 dark:border-(--card-border-color)">
            <div className="w-full py-2.5 px-4 text-[12px] font-bold text-sky-500 flex items-center justify-center gap-1.5">
              <BookOpen size={12} />
              {buttons?.find((b: any) => b.type === "catalog")?.text || "View catalog"}
            </div>
          </div>
        )}
        {isCallPermission && (
          <div className="border-t border-(--input-border-color) bg-white/50 dark:bg-(--card-color) dark:border-(--card-border-color)">
            <div className="w-full py-2.5 px-4 text-[12px] font-bold text-sky-500 flex items-center justify-center gap-1.5">
              Choose preference
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {isCarouselProduct && productCards.length > 0 && (
        <div {...productScroll} className="mt-2 flex gap-2 overflow-x-auto custom-scrollbar pb-1 max-w-[95%] cursor-grab active:cursor-grabbing select-none">
          {productCards.map((card: any, idx: number) => (
            <div key={card.id || idx} className="shrink-0 w-full bg-white dark:bg-(--card-color) rounded-lg shadow-sm border border-(--input-border-color) overflow-hidden pointer-events-none">
              <div className="h-40 bg-slate-100 dark:bg-(--card-color) flex items-center justify-center">
                <ShoppingBag size={24} className="text-slate-300" />
              </div>
              <div className="p-2 space-y-1.5">
                <p className="text-[11px] font-medium text-slate-700 truncate dark:text-gray-300">Product {idx + 1}</p>
                <div className="w-full py-2 text-[10px] font-bold text-sky-500 text-center dark:border-(--card-border-color) border-t border-(--input-border-color)">{card.button_text || "View"}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isCarouselMedia && mediaCards.length > 0 && (
        <div {...mediaScroll} className="mt-2 flex gap-2 overflow-x-auto custom-scrollbar pb-1 max-w-[95%] cursor-grab active:cursor-grabbing select-none">
          {mediaCards.map((card: any, idx: number) => {
            const cardUrl = card.file ? URL.createObjectURL(card.file) : card.media_url || null;
            return (
              <div key={card.id || idx} className="shrink-0 w-full bg-white rounded-lg shadow-sm border border-(--input-border-color) overflow-hidden pointer-events-none dark:bg-(--card-color)">
                <div className="h-40 bg-slate-100 dark:text-gray-300 dark:bg-(--card-color) flex items-center justify-center overflow-hidden relative">{cardUrl ? <Image src={cardUrl} alt="Card" className="w-full h-full object-cover" width={144} height={80} unoptimized /> : <ImageIcon size={20} className="text-slate-300" />}</div>
                <div className="p-2 text-[11px] text-slate-600 leading-snug line-clamp-2 dark:text-gray-300">{card.body_text || "No body text yet"}</div>
                {(card.buttonValues || []).length > 0 && (
                  <div className="border-t border-(--input-border-color)">
                    {(card.buttonValues || []).map((btn: any, bIdx: number) => (
                      <div key={btn.templateId || bIdx} className="text-[10px] py-2 font-bold text-sky-500 text-center flex items-center justify-center gap-1 border-b border-slate-50">
                        {btn.url ? <Link size={9} /> : null}
                        {btn.text || `Button ${bIdx + 1}`}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
