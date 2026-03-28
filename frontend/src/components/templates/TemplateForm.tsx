/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/src/elements/ui/button";
import { TemplateFormProps } from "@/src/types/components/Template";
import { ArrowLeft, Eye, Loader2, Phone, Plus, Sparkles, X } from "lucide-react";
import { CATEGORIES, INTERACTIVE_ACTIONS, LANGUAGES, TEMPLATE_TYPES } from "../data/templates";
import AITemplateModal from "./form/AITemplateModal";
import { FormLivePreview } from "./form/FormLivePreview";
import { useTemplateForm } from "./form/hooks/useTemplateForm";
import { AuthenticationSection } from "./form/sections/AuthenticationSection";
import { BasicInfoSection } from "./form/sections/BasicInfoSection";
import { BodySection } from "./form/sections/BodySection";
import { ButtonSection } from "./form/sections/ButtonSection";
import { CarouselMediaSection } from "./form/sections/CarouselMediaSection";
import { CarouselProductSection } from "./form/sections/CarouselProductSection";
import { FooterSection } from "./form/sections/FooterSection";
import { HeaderSection } from "./form/sections/HeaderSection";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/elements/ui/dialog";

const TemplateForm = ({ wabaId, templateId, adminTemplateId }: TemplateFormProps) => {
  const { router, isCreating, isEditing, isAIModalOpen, setIsAIModalOpen, formData, setFormData, authData, setAuthData, productCards, mediaCards, mediaButtonTemplates, isMarketingCarousel, isLimitedTimeOffer, isCouponCode, isCatalog, isCallPermission, hideHeaderFooter, headerFile, setHeaderFile, handleBodyChange, addVariable, updateVariable, addButton, removeButton, updateButton, addProductCard, removeProductCard, updateProductCard, addMediaCard, removeMediaCard, updateMediaCard, addMediaButtonTemplate, removeMediaButtonTemplate, updateMediaCardButtonValue, handleAISuccess, onSubmit, setEditor } = useTemplateForm({ wabaId, templateId, adminTemplateId });
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const isAuth = formData.category === "AUTHENTICATION";

  const previewProps = {
    templateType: isAuth ? "none" as const : formData.template_type,
    headerText: isAuth ? "" : formData.header_text,
    messageBody: isAuth ? authData.message_body : formData.message_body,
    variables_example: isAuth ? authData.variables_example : formData.variables_example,
    footerText: isAuth ? authData.footer_text : formData.footer_text,
    buttons: formData.buttons,
    headerFile,
    marketingType: isAuth ? ("authentication" as any) : formData.marketing_type,
    offerText: formData.offer_text,
    productCards,
    mediaCards,
    mediaButtonTemplates,
    authData: isAuth ? authData : undefined,
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 flex overflow-hidden">
        {/* Left Form Content */}
        <div className="flex-1 overflow-y-auto px-6 md:px-12 pt-10 custom-scrollbar">
          <div className="max-w-4xl mx-auto space-y-10 pb-10">
            {/* Top bar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3 sm:gap-5 min-w-0">
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="shrink-0 rounded-lg bg-white dark:bg-(--card-color) shadow-sm border border-slate-200 dark:border-(--card-border-color) hover:bg-slate-50 dark:hover:bg-(--table-hover) transition-all">
                  <ArrowLeft size={20} />
                </Button>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <h1 className="text-xl sm:text-2xl font-bold text-primary tracking-tight truncate">{templateId ? "Edit Template" : "Create New Template"}</h1>
                  <p className="text-xs text-slate-500 font-medium dark:text-gray-400 hidden sm:block">Configure your WhatsApp message template with rich design.</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 flex-col sm:flex-row">
                {/* Live Preview button — hidden on 2xl+ where right panel is visible */}
                <button type="button" onClick={() => setIsPreviewOpen(true)} className="2xl:hidden flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 border border-slate-200 dark:border-(--card-border-color) text-slate-600 dark:text-slate-300 rounded-lg text-sm font-bold transition-all hover:bg-slate-50 dark:hover:bg-(--table-hover) whitespace-nowrap">
                  <Eye size={16} />
                  <span>Live Preview</span>
                </button>
                <Button onClick={() => setIsAIModalOpen(true)} variant="outline" className="btn-lining group whitespace-nowrap">
                  <span className="btn-lining-content">
                    <Sparkles size={20} /> Build with AI
                  </span>
                </Button>
              </div>
            </div>

            {/* Basic Info (includes Marketing Type Selector) */}
            <BasicInfoSection language={formData.language} setLanguage={(val) => setFormData((p: any) => ({ ...p, language: val }))} category={formData.category} setCategory={(val) => setFormData((p: any) => ({ ...p, category: val, marketing_type: val === "MARKETING" ? p.marketing_type : "none" }))} templateName={formData.template_name} setTemplateName={(val) => setFormData((p: any) => ({ ...p, template_name: val }))} marketingType={formData.marketing_type} setMarketingType={(val) => setFormData((p: any) => ({ ...p, marketing_type: val, interactive_type: "none", buttons: [] }))} offerText={formData.offer_text} setOfferText={(val) => setFormData((p: any) => ({ ...p, offer_text: val }))} languages={LANGUAGES} categories={CATEGORIES} />

            {formData.category === "AUTHENTICATION" ? (
              <AuthenticationSection authData={authData} setAuthData={setAuthData} />
            ) : (
              <div className="space-y-10">
                {/* Header — hidden for special marketing types */}
                {!hideHeaderFooter && <HeaderSection templateType={formData.template_type} setTemplateType={(val) => setFormData((p: any) => ({ ...p, template_type: val }))} headerText={formData.header_text} setHeaderText={(val) => setFormData((p: any) => ({ ...p, header_text: val }))} templateTypes={TEMPLATE_TYPES} setHeaderFile={setHeaderFile} headerFile={headerFile} />}

                {/* Body (always visible) */}
                <BodySection messageBody={formData.message_body} handleBodyChange={handleBodyChange} addVariable={addVariable} setEditor={setEditor} variables_example={formData.variables_example} updateVariable={updateVariable} />

                {/* Footer — hidden for special marketing types */}
                {!hideHeaderFooter && <FooterSection footerText={formData.footer_text} setFooterText={(val) => setFormData((p: any) => ({ ...p, footer_text: val }))} />}

                {/* Carousel Product Cards */}
                {formData.marketing_type === "carousel_product" && <CarouselProductSection cards={productCards} onAddCard={addProductCard} onRemoveCard={removeProductCard} onUpdateCard={updateProductCard} />}

                {/* Carousel Media Cards */}
                {formData.marketing_type === "carousel_media" && <CarouselMediaSection buttonTemplates={mediaButtonTemplates} cards={mediaCards} onAddButtonTemplate={addMediaButtonTemplate} onRemoveButtonTemplate={removeMediaButtonTemplate} onAddCard={addMediaCard} onRemoveCard={removeMediaCard} onUpdateCard={updateMediaCard} onUpdateCardButtonValue={updateMediaCardButtonValue} />}

                {/* Call Permission info notice */}
                {isCallPermission && (
                  <div className="bg-white dark:bg-(--card-color) p-6 rounded-lg border border-slate-200 dark:border-(--card-border-color) shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-sky-100 dark:bg-sky-500/20 text-sky-600 shrink-0 mt-0.5">
                        <Phone size={16} />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-sm font-bold text-slate-800 dark:text-gray-200">Call Permission Request</h3>
                        <p className="text-[11px] text-slate-500 dark:text-gray-400 leading-relaxed">
                          This template will include a <strong>call_permission</strong> flag in its payload, requesting the recipient&apos;s opt-in for phone calls. No additional configuration needed — just compose your message body above.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Standard Buttons — skip for carousel, catalog, and call_permission templates */}
                {!isMarketingCarousel && !isCatalog && !isCallPermission && <ButtonSection interactiveType={formData.interactive_type} setInteractiveType={(val) => setFormData((p: any) => ({ ...p, interactive_type: val, buttons: [] }))} buttons={formData.buttons} addButton={addButton} removeButton={removeButton} updateButton={updateButton} interactiveActions={INTERACTIVE_ACTIONS} isLimitedTimeOffer={isLimitedTimeOffer || isCouponCode} />}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-end gap-4 pt-6 border-t border-slate-200 dark:border-(--card-border-color)">
              <Button variant="ghost" onClick={() => router.back()} className="px-8 h-12 rounded-lg font-bold text-slate-500 transition-all dark:hover:bg-(--table-hover) dark:bg-(--card-color) bg-gray-100 dark:text-amber-50 dark:hover:text-amber-50 hover:bg-slate-100">
                Discard Changes
              </Button>
              <Button onClick={onSubmit} disabled={isCreating} className="px-10 h-12 rounded-lg bg-primary text-white font-bold transition-all disabled:opacity-50 group">
                {isCreating || isEditing ? <Loader2 className="animate-spin mr-2" size={18} /> : <Plus className="w-5 h-5 mr-2" />}
                {templateId ? "Save Changes" : "Submit Template"}
              </Button>
            </div>
          </div>
        </div>

        {/* Right Preview Panel — hidden below 2xl (1536px) */}
        <div className="hidden 2xl:flex shrink-0 w-96 overflow-y-auto border-l border-slate-200 dark:border-(--card-border-color) bg-white dark:bg-(--card-color) items-start justify-center py-10 custom-scrollbar">
          <FormLivePreview {...previewProps} />
        </div>
      </div>

      {/* Mobile / Tablet Preview Modal — shown below 2xl */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-md p-0 overflow-hidden bg-transparent dark:bg-transparent border-none shadow-none [&>button]:hidden top-1/2 -translate-y-1/2">
          <DialogHeader className="sr-only">
            <DialogTitle>Template Preview</DialogTitle>
          </DialogHeader>
          <div className="relative flex items-center justify-center p-4">
            {/* Close button */}
            <button
              type="button"
              onClick={() => setIsPreviewOpen(false)}
              className="absolute top-0 right-0 z-50 flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-(--page-body-bg) border border-slate-200 dark:border-(--card-border-color) shadow-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-(--table-hover) transition-all"
            >
              <X size={16} />
            </button>
            <FormLivePreview {...previewProps} />
          </div>
        </DialogContent>
      </Dialog>

      <AITemplateModal isOpen={isAIModalOpen} onClose={() => setIsAIModalOpen(false)} onSuccess={handleAISuccess} />
    </div>
  );
};

export default TemplateForm;
