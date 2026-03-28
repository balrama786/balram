/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { BasicInfoSection } from "./form/sections/BasicInfoSection";
import { HeaderSection } from "./form/sections/HeaderSection";
import { BodySection } from "./form/sections/BodySection";
import { FooterSection } from "./form/sections/FooterSection";
import { ButtonSection } from "./form/sections/ButtonSection";
import { AuthenticationSection } from "./form/sections/AuthenticationSection";
import { CarouselProductSection } from "./form/sections/CarouselProductSection";
import { CarouselMediaSection } from "./form/sections/CarouselMediaSection";
import { FormLivePreview } from "./form/FormLivePreview";
import { useAdminTemplateForm } from "./form/hooks/useAdminTemplateForm";
import { ArrowLeft, Eye, LayoutTemplate, Loader2, Phone, Save } from "lucide-react";
import { AdminTemplateFormProps } from "@/src/types/template";
import { INTERACTIVE_ACTIONS, TEMPLATE_TYPES } from "@/src/data/templates";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/elements/ui/dialog";

export const AdminTemplateForm = ({ templateId }: AdminTemplateFormProps) => {
  const { router, isCreating, formData, setFormData, authData, setAuthData, productCards, mediaCards, mediaButtonTemplates, isMarketingCarousel, isLimitedTimeOffer, isCouponCode, isCatalog, isCallPermission, hideHeaderFooter, headerFile, setHeaderFile, handleBodyChange, addVariable, updateVariable, addButton, removeButton, updateButton, addProductCard, removeProductCard, updateProductCard, addMediaCard, removeMediaCard, updateMediaCard, addMediaButtonTemplate, removeMediaButtonTemplate, updateMediaCardButtonValue, onSubmit, setEditor } = useAdminTemplateForm(templateId);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const isAuth = formData.category === "AUTHENTICATION";

  return (
    <form onSubmit={onSubmit} className="flex flex-col h-full overflow-hidden">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 py-4 rounded-lg border-b border-slate-200 dark:border-(--card-border-color) bg-white dark:bg-(--card-color) sticky top-0 z-30 gap-4 sm:gap-0">
        <div className="flex items-center gap-2 sm:gap-4">
          <button type="button" onClick={() => router.back()} className="p-2 hover:bg-slate-100 dark:hover:bg-(--table-hover) rounded-lg transition-colors text-slate-500">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-(--light-primary) dark:bg-primary/20 flex items-center justify-center text-primary">
              <LayoutTemplate size={16} className="text-primary" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-800 dark:text-slate-200">{templateId ? "Edit Template" : "Create Template"}</h1>
              <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-gray-400">{templateId ? "Update your admin template" : "Create a new admin template"}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto flex-col sm:flex-row">
          <button type="button" onClick={() => setIsPreviewOpen(true)} className="lg:hidden flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-(--card-border-color) text-slate-600 dark:text-slate-300 rounded-lg text-sm font-bold transition-all hover:bg-slate-50 dark:hover:bg-(--table-hover)">
            <Eye size={16} />
            <span>Live Preview</span>
          </button>
          <button type="submit" disabled={isCreating} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary disabled:opacity-60 text-white rounded-lg text-sm font-bold transition-all shadow-sm shadow-primary/30">
            {isCreating ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {isCreating ? "Saving..." : "Save Template"}
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col lg:flex-row gap-6 py-4 sm:py-6 overflow-y-auto min-h-0 custom-scrollbar">
        <div className="flex-1 space-y-10 min-w-0 pb-20">
          <BasicInfoSection language={formData.language} setLanguage={(v) => setFormData((p: any) => ({ ...p, language: v }))} category={formData.category} setCategory={(v) => setFormData((p: any) => ({ ...p, category: v, marketing_type: "none" }))} templateName={formData.template_name} setTemplateName={(v) => setFormData((p: any) => ({ ...p, template_name: v }))} marketingType={formData.marketing_type} setMarketingType={(v) => setFormData((p: any) => ({ ...p, marketing_type: v, interactive_type: "none", buttons: [] }))} offerText={formData.offer_text} setOfferText={(v) => setFormData((p: any) => ({ ...p, offer_text: v }))} sector={formData.sector} setSector={(v) => setFormData((p: any) => ({ ...p, sector: v }))} templateCategory={formData.template_category} setTemplateCategory={(v) => setFormData((p: any) => ({ ...p, template_category: v }))} />

          {isAuth ? (
            <AuthenticationSection authData={authData} setAuthData={setAuthData} />
          ) : (
            <div className="space-y-10">
              {!hideHeaderFooter && <HeaderSection templateType={formData.template_type} setTemplateType={(v) => setFormData((p: any) => ({ ...p, template_type: v }))} headerText={formData.header_text} setHeaderText={(v) => setFormData((p: any) => ({ ...p, header_text: v }))} templateTypes={TEMPLATE_TYPES} setHeaderFile={setHeaderFile} headerFile={headerFile} />}

              <BodySection messageBody={formData.message_body} handleBodyChange={handleBodyChange} addVariable={addVariable} setEditor={setEditor} variables_example={formData.variables_example} updateVariable={updateVariable} />

              {!hideHeaderFooter && <FooterSection footerText={formData.footer_text} setFooterText={(v) => setFormData((p: any) => ({ ...p, footer_text: v }))} />}

              {formData.marketing_type === "carousel_product" && <CarouselProductSection cards={productCards} onAddCard={addProductCard} onRemoveCard={removeProductCard} onUpdateCard={updateProductCard} />}

              {formData.marketing_type === "carousel_media" && <CarouselMediaSection buttonTemplates={mediaButtonTemplates} cards={mediaCards} onAddButtonTemplate={addMediaButtonTemplate} onRemoveButtonTemplate={removeMediaButtonTemplate} onAddCard={addMediaCard} onRemoveCard={removeMediaCard} onUpdateCard={updateMediaCard} onUpdateCardButtonValue={updateMediaCardButtonValue} />}

              {isCallPermission && (
                <div className="bg-white dark:bg-(--card-color) p-6 rounded-lg border border-slate-200 dark:border-(--card-border-color) shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-sky-100 dark:bg-primary/20 text-primary shrink-0 mt-0.5">
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

              {!isMarketingCarousel && !isCatalog && !isCallPermission && <ButtonSection interactiveType={formData.interactive_type} setInteractiveType={(v) => setFormData((p: any) => ({ ...p, interactive_type: v, buttons: [] }))} buttons={formData.buttons || []} addButton={addButton} removeButton={removeButton} updateButton={updateButton} interactiveActions={INTERACTIVE_ACTIONS} isLimitedTimeOffer={isLimitedTimeOffer} isCouponCode={isCouponCode} />}
            </div>
          )}
        </div>

        <div className="w-96 shrink-0 sticky top-0 self-start hidden lg:block bg-white dark:bg-(--card-color) p-6 rounded-lg border border-slate-200 dark:border-(--card-border-color) shadow-sm">
          <FormLivePreview templateType={formData.template_type} headerText={formData.header_text} messageBody={isAuth ? authData.message_body : formData.message_body} variables_example={isAuth ? authData.variables_example : formData.variables_example} footerText={isAuth ? authData.footer_text : formData.footer_text} buttons={formData.buttons} headerFile={headerFile} marketingType={isAuth ? ("authentication" as any) : formData.marketing_type} offerText={formData.offer_text} productCards={productCards} mediaCards={mediaCards} mediaButtonTemplates={mediaButtonTemplates} authData={isAuth ? authData : undefined} />
        </div>
      </div>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-md p-0 overflow-hidden bg-transparent dark:bg-transparent border-none shadow-none">
          <DialogHeader className="sr-only">
            <DialogTitle>Template Preview</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center p-4">
            <FormLivePreview templateType={formData.template_type} headerText={formData.header_text} messageBody={isAuth ? authData.message_body : formData.message_body} variables_example={isAuth ? authData.variables_example : formData.variables_example} footerText={isAuth ? authData.footer_text : formData.footer_text} buttons={formData.buttons} headerFile={headerFile} marketingType={isAuth ? ("authentication" as any) : formData.marketing_type} offerText={formData.offer_text} productCards={productCards} mediaCards={mediaCards} mediaButtonTemplates={mediaButtonTemplates} authData={isAuth ? authData : undefined} />
          </div>
        </DialogContent>
      </Dialog>
    </form>
  );
};
