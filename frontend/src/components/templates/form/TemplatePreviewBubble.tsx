/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useDraggableScroll } from "@/src/hooks/useDraggableScroll";
import { TemplatePreviewBubbleProps } from "@/src/types/components/Template";
import { BookOpen, Copy, FileText, Gift, Image as ImageIcon, Link, MapPin, Phone, ShieldCheck, ShoppingBag, Smartphone, Video, StickyNote } from "lucide-react";
import Image from "next/image";

export const TemplatePreviewBubble = ({ templateType, headerText, bodyText, footerText, buttons, fileUrl, marketingType = "none", offerText, productCards = [], mediaCards = [], mediaButtonTemplates = [], authData }: TemplatePreviewBubbleProps) => {
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
    <div className="flex-1 overflow-y-auto overflow-x-hidden sm:p-3 p-2 pt-6 bg-[url('/assets/images/1.png')] bg-cover bg-center bg-no-repeat custom-scrollbar">
      <div className="mx-auto w-fit px-2 py-0.5 bg-sky-100/80 rounded text-[9px] uppercase font-bold text-sky-700 shadow-sm border border-sky-200/50 shrink-0 mb-2">Today</div>

      {/* Main chat bubble */}
      <div className="bg-white rounded-lg rounded-tl-none shadow-sm overflow-hidden min-w-[75%] max-w-[90%] w-fit border border-slate-200/50 shrink-0">
        {/* Limited Time Offer header card */}
        {isLimitedTimeOffer && (
          <div className="bg-white p-3 border-b border-slate-100">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                <Gift size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-slate-900 truncate">{offerText || "Limited time offer"}</h4>
                <p className="text-[11px] text-slate-500">Offer ends very soon</p>
                {buttons?.find((b: any) => b.type === "copy_code")?.text && <p className="text-[11px] text-slate-400 mt-0.5 font-medium uppercase tracking-wider">Code: {buttons.find((b: any) => b.type === "copy_code").text}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Catalog — WhatsApp product thumbnail row */}
        {isCatalog && (
          <div className="border-b border-slate-100">
            <div className="flex items-center gap-2.5 p-3">
              {/* Product thumbnail placeholder */}
              <div className="w-14 h-14 rounded-lg bg-linear-to-br from-emerald-100 to-teal-100 border border-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
                <ShoppingBag size={22} className="text-emerald-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-bold text-slate-800 leading-tight truncate">View Green Valley&apos;s</p>
                <p className="text-[12px] font-bold text-slate-800 leading-tight">catalog on WhatsApp</p>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">Browse pictures and details of our offerings.</p>
              </div>
            </div>
          </div>
        )}

        {/* Authentication — shield icon + OTP context */}
        {isAuthentication && (
          <div className="p-3 flex items-center gap-2.5 border-b border-slate-100 bg-green-50">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
              <ShieldCheck size={15} className="text-green-600" />
            </div>
            <div>
              <p className="text-[12px] font-bold text-slate-800 leading-tight">OTP Verification</p>
              <p className="text-[10px] text-slate-500">Tap to copy your one-time code</p>
            </div>
          </div>
        )}

        {/* Call Permission — simple clean layout with phone icon */}
        {isCallPermission && (
          <div className="p-3 flex items-center gap-2.5 border-b border-slate-100">
            <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center shrink-0">
              <Phone size={15} className="text-sky-500" />
            </div>
            <p className="text-[12px] font-bold text-slate-800">Can Your Brand call you?</p>
          </div>
        )}

        {/* Standard header media */}
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
                {templateType === "sticker" && <StickyNote size={20} />}
              </div>
            </div>
          </div>
        )}

        {!isSpecial && headerText && <div className="p-3 font-bold text-sm text-slate-900 dark:text-gray-300 border-b border-slate-50 wrap-break-word">{headerText}</div>}

        {/* Body text */}
        <div className="p-3 space-y-2">
          <div className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap wrap-break-word">{bodyText}</div>
          {isAuthentication && authData?.add_security_recommendation && <div className="text-[11px] text-slate-500 italic">For your security, do not share this code.</div>}
          {isAuthentication && authData?.code_expiration_minutes && <div className="text-[11px] text-slate-400">⏱ Code expires in {authData.code_expiration_minutes} minutes.</div>}
          {!isSpecial && footerText && <div className="text-[11px] text-slate-400 font-medium break-all">{footerText}</div>}
          {isAuthentication && footerText && <div className="text-[11px] text-slate-400 font-medium break-all">{footerText}</div>}

          <div className="text-[10px] text-slate-400 text-right mt-1">10:57 AM</div>
        </div>

        {/* Standard / LTO / Coupon buttons */}
        {!isCarouselProduct && !isCarouselMedia && !isCatalog && !isCallPermission && !isAuthentication && buttons && buttons.length > 0 && (
          <div className="border-t border-slate-100 divide-y divide-slate-100 bg-white/50">
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

        {/* Authentication — Copy Code OTP button */}
        {isAuthentication && (
          <div className="border-t border-slate-100 bg-white/50">
            <div className="w-full py-2.5 px-4 text-[12px] font-bold text-sky-500 flex items-center justify-center gap-1.5">
              <Copy size={12} />
              {authData?.otp_buttons?.[0]?.copy_button_text || "Copy Code"}
            </div>
          </div>
        )}

        {/* Catalog — View catalog button */}
        {isCatalog && (
          <div className="border-t border-slate-100 bg-white/50">
            <div className="w-full py-2.5 px-4 text-[12px] font-bold text-sky-500 flex items-center justify-center gap-1.5">
              <BookOpen size={12} />
              {buttons?.find((b: any) => b.type === "catalog")?.text || "View catalog"}
            </div>
          </div>
        )}

        {/* Call Permission — Choose preference button */}
        {isCallPermission && (
          <div className="border-t border-slate-100 bg-white/50">
            <div className="w-full py-2.5 px-4 text-[12px] font-bold text-sky-500 flex items-center justify-center gap-1.5">
              Choose preference
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Carousel Product Preview */}
      {isCarouselProduct && productCards.length > 0 && (
        <div {...productScroll} className="mt-2 flex gap-2 overflow-x-auto custom-scrollbar pb-1 max-w-[95%] cursor-grab active:cursor-grabbing select-none">
          {productCards.map((card, idx) => (
            <div key={card.id || idx} className="shrink-0 w-full bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden pointer-events-none">
              <div className="h-40 bg-slate-100 flex items-center justify-center">
                <ShoppingBag size={24} className="text-slate-300" />
              </div>
              <div className="p-2 space-y-1.5">
                <p className="text-[11px] font-medium text-slate-700 truncate">Product {idx + 1}</p>
                <div className="w-full py-2 text-[10px] font-bold text-sky-500 text-center border-t border-slate-100">{card.button_text || "View"}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Carousel Media Preview */}
      {isCarouselMedia && mediaCards.length > 0 && (
        <div {...mediaScroll} className="mt-2 flex gap-2 overflow-x-auto custom-scrollbar pb-1 max-w-[95%] cursor-grab active:cursor-grabbing select-none">
          {mediaCards.map((card, idx) => {
            const cardUrl = card.file ? URL.createObjectURL(card.file) : card.media_url || null;
            return (
              <div key={card.id || idx} className="shrink-0 w-full bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden pointer-events-none">
                <div className="h-40 bg-slate-100 flex items-center justify-center overflow-hidden relative">{cardUrl ? <Image src={cardUrl} alt="Card" className="w-full h-full object-cover" width={144} height={80} unoptimized /> : <ImageIcon size={20} className="text-slate-300" />}</div>
                {<div className="p-2 text-[11px] text-slate-600 leading-snug line-clamp-2">{card.body_text || "No body text yet"}</div>}
                {(card.buttons || card.buttonValues || []).length > 0 && (
                  <div className="border-t border-slate-100">
                    {(card.buttons || card.buttonValues || []).map((btn: any, bIdx: number) => (
                      <div key={btn.id || bIdx} className="text-[10px] py-2 font-bold text-sky-500 text-center flex items-center justify-center gap-1 border-b border-slate-50">
                        {btn.type === "url" || btn.url ? <Link size={9} /> : null}
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
