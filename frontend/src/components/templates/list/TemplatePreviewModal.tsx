/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Dialog, DialogContent, DialogTitle } from "@/src/elements/ui/dialog";
import { MarketingType, TemplatePreviewModalProps } from "@/src/types/components/Template";
import { FormLivePreview } from "../form/FormLivePreview";
import { X } from "lucide-react";

export const TemplatePreviewModal = ({ isOpen, onClose, template }: TemplatePreviewModalProps) => {
  if (!template) return null;

  // Determine marketing type
  let marketingType: MarketingType = "none";
  const category = template.category?.toUpperCase();

  if (template.is_limited_time_offer) {
    marketingType = "limited_time_offer";
  } else if (category === "AUTHENTICATION") {
    marketingType = "authentication" as any; // handled specially by preview bubble
  } else if (category === "MARKETING") {
    const hasCopyCode = template.buttons?.some((b) => b.type === "copy_code");
    const hasCatalog = template.buttons?.some((b) => b.type === "catalog");
    const isCallPermission = (template as any).call_permission === "true" || (template as any).call_permission === true;
    const isCarousel = (template as any).template_type === "carousel" || !!(template as any).carousel_cards;

    if (isCarousel) {
      const firstCard = (template as any).carousel_cards?.[0];
      const header = firstCard?.components?.find((c: any) => c.type === "header");
      if (header?.format === "product") marketingType = "carousel_product";
      else if (header?.format === "image" || header?.format === "video") marketingType = "carousel_media";
    } else if (hasCatalog) {
      marketingType = "catalog";
    } else if (isCallPermission) {
      marketingType = "call_permission";
    } else if (hasCopyCode && !template.header && !template.footer_text) {
      marketingType = "coupon_code";
    }
  }

  // Build authData from template for authentication preview
  const authPreviewData =
    category === "AUTHENTICATION"
      ? {
        add_security_recommendation: (template as any).add_security_recommendation ?? true,
        otp_buttons: (template as any).otp_buttons ?? [{ otp_type: "COPY_CODE", copy_button_text: "Copy Code" }],
        otp_code_length: (template as any).otp_code_length ?? 6,
        code_expiration_minutes: (template as any).code_expiration_minutes ?? 10,
      }
      : undefined;

  // Map carousel cards if present
  const productCards =
    marketingType === "carousel_product"
      ? (template as any).carousel_cards?.map((card: any, idx: number) => ({
        id: `card-${idx}`,
        button_text: card.components?.find((c: any) => c.type === "buttons")?.buttons?.[0]?.text || "View",
      }))
      : [];

  const mediaCards =
    marketingType === "carousel_media"
      ? (template as any).carousel_cards?.map((card: any, idx: number) => {
        const header = card.components?.find((c: any) => c.type === "header");
        const body = card.components?.find((c: any) => c.type === "body");
        const buttons = card.components?.find((c: any) => c.type === "buttons")?.buttons || [];
        return {
          id: `card-${idx}`,
          body_text: body?.text || "",
          media_url: header?.media_url || header?.handle || null,
          buttons: buttons.map((b: any, bIdx: number) => ({
            id: `btn-${bIdx}`,
            type: b.type === "url" ? "url" : "quick_reply",
            text: b.text,
            url: b.url,
          })),
        };
      })
      : [];

  const variables = template.variables_example || template.variables || template.body_variables || [];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[min(95vw,400px)] bg-transparent border-none shadow-none p-0 flex flex-col items-center justify-center overflow-visible">
        <DialogTitle className="sr-only">Mobile Preview: {template.template_name}</DialogTitle>
        <div className="w-full relative">
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute -top-4 -right-2 z-50 flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-(--card-color) border border-slate-200 dark:border-(--card-border-color) shadow-lg text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-(--card-color) transition-all cursor-pointer"
          >
            <X size={16} />
          </button>

          <FormLivePreview
            templateType={category === "AUTHENTICATION" ? "none" : template.header?.format?.toLowerCase() || "none"}
            headerText={category === "AUTHENTICATION" ? "" : template.header?.text || ""}
            messageBody={template.message_body || ""}
            variables_example={variables}
            footerText={template.footer_text || ""}
            buttons={template.buttons || []}
            headerFile={null}
            mediaUrl={template.header?.media_url || undefined}
            marketingType={marketingType}
            offerText={template.offer_text}
            productCards={productCards}
            mediaCards={mediaCards}
            authData={authPreviewData}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
