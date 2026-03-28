/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChatMessage, TemplateButton } from "@/src/types/components/chat";
import { BookImage, BookOpen, Copy, ExternalLink, Gift, MapPin, Phone, ShieldCheck, ShoppingBag, Smartphone } from "lucide-react";
import Image from "next/image";
import React from "react";
import BaseMessage from "./BaseMessage";
import { useDraggableScroll } from "@/src/hooks/useDraggableScroll";

interface TemplateMessageProps {
  message: ChatMessage;
}

const TemplateMessage: React.FC<TemplateMessageProps> = ({ message }) => {
  const scrollProps = useDraggableScroll();
  const { template } = message;
  if (!template) return null;

  const mType = template.marketing_type?.toLowerCase() || "";

  const isLimitedTimeOffer = template.is_limited_time_offer || mType === "limited_time_offer";
  const isCatalog = mType === "catalog" || template.buttons?.some((b) => b.type === "catalog");
  const isAuthentication = mType === "authentication" || template.category === "AUTHENTICATION";
  const isCallPermission = mType === "call_permission" || template.call_permission;
  const isCarouselProduct = mType === "carousel_product" || (template as any).template_type === "carousel_product";
  const isCarouselMedia = mType === "carousel_media" || (template as any).template_type === "carousel_media" || (template as any).template_type === "carousel";
  const isSpecial = isLimitedTimeOffer || isCatalog || isAuthentication || isCallPermission || isCarouselProduct || isCarouselMedia;

  const handleButtonClick = (button: TemplateButton) => {
    if ((button.type === "website" || button.type === "url") && (button.website_url || button.url)) {
      window.open(button.website_url || button.url, "_blank", "noopener,noreferrer");
    } else if ((button.type === "phone" || button.type === "phone_call") && button.phone_number) {
      window.location.assign(`tel:${button.phone_number}`);
    }
  };

  return (
    <BaseMessage message={message}>
      <div className="flex flex-col -mx-3 -my-1.5 mb-1.5 min-w-64 max-w-70 sm:max-w-xs">
        {/* Limited Time Offer Header */}
        {isLimitedTimeOffer && (
          <div className="dark:bg-slate-800 p-3 border-b border-slate-100 dark:border-slate-700">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                <Gift size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{template.offer_text || "Limited time offer"}</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Offer ends very soon</p>
              </div>
            </div>
          </div>
        )}

        {/* Catalog Header */}
        {isCatalog && (
          <div className="border-b border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-2.5 p-3">
              <div className="w-12 h-12 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 flex items-center justify-center shrink-0 overflow-hidden">
                <ShoppingBag size={20} className="text-emerald-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-bold text-slate-800 dark:text-slate-200 leading-tight">View our catalog</p>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-snug truncate">Browse pictures and details of our offerings.</p>
              </div>
            </div>
          </div>
        )}

        {/* Authentication Header */}
        {isAuthentication && (
          <div className="p-3 flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-700 bg-emerald-50/30 dark:bg-emerald-900/10">
            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
              <ShieldCheck size={15} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-[12px] font-bold text-slate-800 dark:text-slate-200 leading-tight">OTP Verification</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Tap to copy your one-time code</p>
            </div>
          </div>
        )}

        {/* Call Permission Header */}
        {isCallPermission && (
          <div className="p-3 flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-700">
            <div className="w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center shrink-0">
              <Phone size={15} className="text-sky-500 dark:text-sky-400" />
            </div>
            <p className="text-[12px] font-bold text-slate-800 dark:text-slate-200">Can we call you?</p>
          </div>
        )}

        {/* Standard Header */}
        {!isSpecial && template.header && (
          <>
            {template.header.format === "text" && template.header.text && (
              <div className="px-3 py-3 border-b border-slate-100 dark:border-slate-700">
                <h4 className="font-bold text-[14px] leading-tight text-slate-900 dark:text-white">{template.header.text}</h4>
              </div>
            )}
            {template.header.format === "image" && message.fileUrl && (
              <div className="overflow-hidden -mx-3 -mt-1.5 mb-1 aspect-video relative">
                <Image src={message.fileUrl} alt="Template Header" fill className="object-cover" unoptimized />
              </div>
            )}
            {template.header.format === "location" && (
              <div className="aspect-video bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 overflow-hidden relative">
                <MapPin size={40} className="text-slate-200 dark:text-slate-700" />
              </div>
            )}
          </>
        )}

        {/* Body */}
        <div className="px-3 py-2">
          <p className="whitespace-pre-wrap wrap-break-word leading-normal text-[13.5px] text-slate-800 dark:text-slate-100">{template.message_body}</p>
        </div>

        {/* Footer */}
        {template.footer_text && (
          <div className="px-3 pb-2 pt-0">
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{template.footer_text}</p>
          </div>
        )}

        {/* Carousel Preview Area */}
        {(isCarouselProduct || isCarouselMedia) && template.carousel_cards && (
          <div {...scrollProps} className="mt-2 flex gap-2 overflow-x-auto px-3 pb-3 custom-scrollbar no-scrollbar scroll-smooth cursor-grab active:cursor-grabbing select-none">
            {template.carousel_cards.map((card, idx) => {
              const header = card.components?.find((c: any) => c.type === "header") as any;
              const body = card.components?.find((c: any) => c.type === "body") as any;
              const buttons = (card.components?.find((c: any) => c.type === "buttons") as any)?.buttons || [];
              const mediaUrl = header?.media_url || header?.handle || null;

              return (
                <div key={idx} className="shrink-0 w-50 bg-white dark:bg-slate-900 rounded-xl shadow-md border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col">
                  {/* Media Header */}
                  <div className="h-32 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-300 relative overflow-hidden shrink-0">{mediaUrl ? <Image src={mediaUrl} alt={`Card ${idx + 1}`} fill className="object-cover" unoptimized /> : isCarouselProduct ? <ShoppingBag size={32} /> : <BookImage size={32} />}</div>

                  {/* Body Content */}
                  <div className="p-3 flex-1 flex flex-col min-h-0">
                    {isCarouselProduct && <p className="text-[12px] font-black text-slate-900 dark:text-white truncate mb-1 uppercase tracking-tight">Product {idx + 1}</p>}
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-auto">{body?.text || (isCarouselProduct ? "View details of this product in our official shop." : "No description available.")}</p>

                    {/* Card Buttons */}
                    <div className="mt-3 space-y-1 pt-2 border-t border-slate-50 dark:border-slate-800/50">
                      {buttons.length > 0 ? (
                        buttons.map((btn: any, bIdx: number) => (
                          <button key={bIdx} onClick={() => handleButtonClick(btn)} className="w-full py-1.5 text-[11px] font-bold text-sky-500 dark:text-sky-400 text-center hover:bg-sky-50 dark:hover:bg-sky-900/10 rounded-lg transition-colors flex items-center justify-center gap-1.5">
                            {(btn.type === "url" || btn.type === "website") && <ExternalLink size={10} />}
                            {btn.text}
                          </button>
                        ))
                      ) : (
                        <button className="w-full py-1.5 text-[11px] font-bold text-sky-500 dark:text-sky-400 text-center opacity-50 cursor-default">View</button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Buttons */}
        {!isCarouselProduct && !isCarouselMedia && template.buttons && template.buttons.length > 0 && (
          <div className="border-t border-slate-100 dark:border-slate-800 mt-1 divide-y divide-slate-100 dark:divide-slate-800">
            {template.buttons.map((button: TemplateButton, index: number) => (
              <button key={index} onClick={() => handleButtonClick(button)} className="w-full flex items-center justify-center gap-2 py-2.5 text-[13px] font-bold text-sky-500 dark:text-sky-400 hover:bg-primary/10 dark:hover:bg-slate-800/50 transition-colors">
                {(button.type === "website" || button.type === "url") && <ExternalLink className="w-3.5 h-3.5" />}
                {(button.type === "phone" || button.type === "phone_call") && <Smartphone className="w-3.5 h-3.5" />}
                {button.type === "copy_code" && <Copy className="w-3.5 h-3.5" />}
                {button.type === "catalog" && <BookOpen className="w-3.5 h-3.5" />}
                <span>{button.type === "copy_code" ? "Copy Code" : button.text}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </BaseMessage>
  );
};

export default TemplateMessage;
