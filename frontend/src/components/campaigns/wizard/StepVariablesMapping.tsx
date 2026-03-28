/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { useGetCustomFieldsQuery } from "@/src/redux/api/customFieldApi";
import { useGetTemplateQuery } from "@/src/redux/api/templateApi";
import { CampaignFormValues } from "@/src/types/components";
import { FormikProps } from "formik";
import { Image as ImageIcon, Layout, Loader2, PlayCircle, ShoppingBag, Sparkles, Tag, Ticket, Timer } from "lucide-react";
import { useEffect, useMemo } from "react";
import { FormLivePreview } from "../../templates/form/FormLivePreview";
import { CarouselMediaEditor } from "./CarouselMediaEditor";
import { CarouselProductEditor } from "./CarouselProductEditor";
import { CatalogProductPicker } from "./CatalogProductPicker";
import { CampaignCard, CarouselProduct, CONTACT_SYSTEM_FIELDS, TemplateCarouselCard } from "./types";
import { SectionCard, SectionHeading, VariableRow } from "./VariableMappingComponents";

const StepVariablesMapping = ({ formik }: { formik: FormikProps<CampaignFormValues> }) => {
  const { data: templateResult, isLoading: loadingTemplate } = useGetTemplateQuery(formik.values.template_id, {
    skip: !formik.values.template_id,
  });
  const { data: customFieldsResult } = useGetCustomFieldsQuery({});

  const template = templateResult?.data;
  const customFields = customFieldsResult?.data?.fields || [];
  const marketingType: string = (template as any)?.template_type || "none";
  const templateCarouselCards: TemplateCarouselCard[] = (template as any)?.carousel_cards || [];

  const variables = useMemo(() => {
    if (!template) return [];
    return template.body_variables || [];
  }, [template]);

  // Auto-initialize carousel_cards_data from the template's carousel_cards
  useEffect(() => {
    if (!template || templateCarouselCards.length === 0) return;
    const isCarousel = marketingType === "carousel_media" || (marketingType === "carousel" && templateCarouselCards.length > 0);
    if (!isCarousel) return;

    // Only initialize if empty or length doesn't match template
    const current = formik.values.carousel_cards_data || [];
    if (current.length === templateCarouselCards.length) return;

    const initialized = templateCarouselCards.map((tCard) => {
      const headerComp = tCard.components?.find((c) => c.type === "header");
      const buttonsComp = tCard.components?.find((c) => c.type === "buttons");
      return {
        header: { type: headerComp?.format || "image", link: "" },
        body: { text: "" },
        buttons: (buttonsComp?.buttons || []).map((b) => ({
          type: b.type,
          text: b.text || "",
          ...(b.type === "url" ? { url_value: "" } : {}),
          ...(b.type === "quick_reply" ? { payload: "" } : {}),
        })),
      };
    });
    formik.setFieldValue("carousel_cards_data", initialized);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template, templateCarouselCards.length, marketingType]);

  // Auto-initialize carousel_products from the template's carousel_cards (for product carousels)
  useEffect(() => {
    if (!template || templateCarouselCards.length === 0) return;
    const isProduct = marketingType === "carousel_product" || (marketingType === "carousel" && templateCarouselCards[0]?.components?.find((c: any) => c.type === "header")?.format === "product");
    if (!isProduct) return;

    const current = (formik.values.carousel_products as CarouselProduct[]) || [];
    if (current.length === templateCarouselCards.length) return;

    const initialized = templateCarouselCards.map(() => ({
      product_retailer_id: "",
      catalog_id: "",
    }));
    formik.setFieldValue("carousel_products", initialized);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template, templateCarouselCards.length, marketingType]);

  const handleMappingChange = (key: string, value: string) => {
    formik.setFieldValue("variables_mapping", { ...formik.values.variables_mapping, [key]: value });
  };

  const previewVariables = useMemo(() => {
    return variables.map((v: any) => {
      const key = typeof v === "string" ? v : v.key;
      const mapped = formik.values.variables_mapping?.[key];
      const displayVal = mapped ? (mapped.startsWith("{{") ? mapped.replace(/^\{\{/, "").replace(/\}\}$/, "") : mapped) : (typeof v === "object" ? v.example : undefined) || `{{${key}}}`;
      return { key, example: displayVal };
    });
  }, [variables, formik.values.variables_mapping]);

  const mappingOptions = useMemo(() => {
    const customOptions = customFields.map((f: any) => ({ label: `CF: ${f.label}`, value: `cf_${f.name}` }));
    return [...CONTACT_SYSTEM_FIELDS, ...customOptions];
  }, [customFields]);

  // ── Early returns ──

  if (!formik.values.template_id) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-12 space-y-6">
        <Layout className="text-slate-200 dark:text-slate-800" size={64} />
        <p className="text-slate-400 font-bold max-w-xs">Please go back and select a template first.</p>
      </div>
    );
  }

  if (loadingTemplate) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-12 space-y-6">
        <Loader2 className="animate-spin text-primary" size={36} />
        <p className="text-slate-400 font-bold">Loading template details...</p>
      </div>
    );
  }

  // ── Template type flags ──

  const isCouponType = marketingType === "coupon";
  const isLimitedOffer = marketingType === "limited_time_offer";
  const isCatalog = marketingType === "catalog";
  const isCarouselProduct = marketingType === "carousel_product" || (marketingType === "carousel" && ((template as any)?.carousel_cards?.[0]?.components?.[0]?.format === "product" || (template as any)?.carousel_cards?.[0]?.components?.find((c: any) => c.type === "header")?.format === "product"));
  const isCarouselMedia = marketingType === "carousel_media" || (marketingType === "carousel" && !isCarouselProduct);
  const hasExtraFields = isCouponType || isLimitedOffer || isCatalog || isCarouselMedia || isCarouselProduct;
  const hasVariables = variables.length > 0;

  // ── Render ──

  return (
    <div className="h-full flex flex-col lg:flex-row gap-10 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* ── Left: Form ── */}
      <div className="flex-1 space-y-8">
        {/* Section Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Sparkles className="text-primary w-6 h-6" />
          </div>
          <div>
            <h2 className="sm:text-xl text-lg font-bold text-primary">{hasExtraFields ? "Campaign Configuration" : "Variable Mapping"}</h2>
            <p className="text-slate-400 text-sm font-medium">{hasExtraFields ? "Configure template-specific fields and map dynamic placeholders." : "Map your template placeholders to contact data."}</p>
          </div>
        </div>

        {/* ── Body Variables ── */}
        {hasVariables && (
          <SectionCard>
            <SectionHeading icon={<Sparkles className="text-primary w-5 h-5" />} label="Body Variables" sub={`Map {{placeholders}} to contact fields or static values (Template type: ${marketingType})`} />
            <div className="space-y-4">
              {variables.map((v: any, index: number) => {
                const key = typeof v === "string" ? v : v.key;
                const example = typeof v === "string" ? "N/A" : v.example || "N/A";
                if (!key) return null;
                return <VariableRow key={index} varKey={key} example={example} value={formik.values.variables_mapping?.[key] || ""} onChange={(val) => handleMappingChange(key, val)} mappingOptions={mappingOptions} />;
              })}
            </div>
          </SectionCard>
        )}

        {/* ── No variables and no extra fields ── */}
        {!hasVariables && !hasExtraFields && (
          <div className="bg-emerald-50/50 dark:bg-(--dark-body) dark:border-none rounded-lg border border-emerald-100 p-10 text-center space-y-4">
            <Sparkles className="mx-auto text-primary" size={40} />
            <p className="text-primary font-bold">This template has no dynamic variables.</p>
            <p className="text-xs text-slate-400 font-medium italic">You can proceed directly to recipient selection.</p>
          </div>
        )}

        {/* ── COUPON_CODE ── */}
        {isCouponType && (
          <SectionCard>
            <SectionHeading icon={<Ticket className="text-primary w-5 h-5" />} label="Coupon Code" sub="The discount code users will receive" />
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1 flex items-center gap-1.5">
                <Tag size={11} /> Coupon Code Value
              </Label>
              <Input name="coupon_code" placeholder="e.g. SUMMER20" value={formik.values.coupon_code || ""} onChange={formik.handleChange} className="h-11 rounded-lg bg-slate-50 dark:bg-(--page-body-bg)" />
            </div>
          </SectionCard>
        )}

        {/* ── LIMITED_TIME_OFFER ── */}
        {isLimitedOffer && (
          <>
            <SectionCard>
              <SectionHeading icon={<Ticket className="text-primary w-5 h-5" />} label="Coupon Code" sub="The discount code for this limited time offer" />
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1 flex items-center gap-1.5">
                  <Tag size={11} /> Coupon Code Value
                </Label>
                <Input name="coupon_code" placeholder="e.g. FLASH50" value={formik.values.coupon_code || ""} onChange={formik.handleChange} className="h-11 rounded-lg bg-slate-50 dark:bg-(--page-body-bg)" />
              </div>
            </SectionCard>

            <SectionCard>
              <SectionHeading icon={<Timer className="text-primary w-5 h-5" />} label="Offer Expiration" sub="How many minutes until this limited time offer expires" />
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1 flex items-center gap-1.5">
                  <Timer size={11} /> Expiration (minutes)
                </Label>
                <Input name="offer_expiration_minutes" type="number" placeholder="e.g. 60" value={formik.values.offer_expiration_minutes || ""} onChange={formik.handleChange} className="h-11 rounded-lg bg-slate-50 dark:bg-(--page-body-bg)" />
              </div>
            </SectionCard>
          </>
        )}

        {/* ── CATALOG ── */}
        {isCatalog && (
          <SectionCard>
            <SectionHeading icon={<ShoppingBag className="text-primary w-5 h-5" />} label="Catalog Product" sub="Select the featured product shown in the catalog message thumbnail" />
            <CatalogProductPicker wabaId={formik.values.waba_id} value={formik.values.thumbnail_product_retailer_id || ""} onChange={(val) => formik.setFieldValue("thumbnail_product_retailer_id", val)} />
          </SectionCard>
        )}

        {/* ── MEDIA HEADER URL (non-carousel) ── */}
        {template?.header?.format === "media" && (template.header.media_type === "image" || template.header.media_type === "video") && !isCarouselMedia && (
          <SectionCard>
            <SectionHeading icon={<ImageIcon className="text-primary w-5 h-5" />} label="Media Header" sub="Public URL for the image or video header" />
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Image / Video URL</Label>
              <Input name="media_url" placeholder="https://example.com/promo-banner.jpg" value={formik.values.media_url} onChange={formik.handleChange} className="h-11 rounded-lg bg-(--input-color) dark:bg-(--page-body-bg)" />
            </div>
          </SectionCard>
        )}

        {/* ── CAROUSEL_MEDIA ── */}
        {isCarouselMedia && (
          <SectionCard>
            <SectionHeading icon={<ImageIcon className="text-primary w-5 h-5" />} label="Carousel Cards" sub="Add image, body text, and button URLs for each card" />
            <CarouselMediaEditor cards={(formik.values.carousel_cards_data as CampaignCard[]) || []} templateCards={templateCarouselCards} onChange={(cards) => formik.setFieldValue("carousel_cards_data", cards)} />
          </SectionCard>
        )}

        {/* ── CAROUSEL_PRODUCT ── */}
        {isCarouselProduct && (
          <SectionCard>
            <SectionHeading icon={<ShoppingBag className="text-primary w-5 h-5" />} label="Product Carousel" sub="Select a catalogue, then pick products to feature in the carousel" />
            <CarouselProductEditor products={(formik.values.carousel_products as CarouselProduct[]) || []} templateCards={templateCarouselCards} wabaId={formik.values.waba_id} onChange={(p) => formik.setFieldValue("carousel_products", p)} />
          </SectionCard>
        )}
      </div>

      {/* ── Right: Preview ── */}
      <div className="lg:w-100 shrink-0">
        <div className="sticky top-0 bg-white dark:bg-(--dark-sidebar) rounded-lg border border-slate-200/60 dark:border-(--card-border-color) overflow-hidden shadow-md">
          <div className="p-5 border-b dark:border-(--card-border-color) bg-slate-50/50 dark:bg-(--table-hover) flex items-center gap-2">
            <PlayCircle className="text-primary" size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-gray-400">Real-time Preview</span>
          </div>
          <div className="sm:p-6 p-3 flex items-center justify-center bg-slate-100/30 dark:bg-(--table-hover)">
            {template ? (
              <FormLivePreview
                templateType={template.header?.format || "text"}
                headerText={template.header?.text || ""}
                messageBody={template.message_body || ""}
                variables_example={previewVariables}
                footerText={template.footer_text || ""}
                buttons={template.buttons || []}
                headerFile={null}
                mediaUrl={formik.values.media_url}
                marketingType={marketingType as any}
                offerText={(template as any)?.offer_text}
                productCards={
                  isCarouselProduct
                    ? ((template as any)?.carousel_cards || []).map((_: any, idx: number) => ({
                        id: String(idx),
                        button_text: "View",
                      }))
                    : []
                }
                mediaCards={
                  isCarouselMedia
                    ? (((formik.values.carousel_cards_data as any[]) || []).map((card: any, idx: number) => {
                        return {
                          id: String(idx),
                          media_url: card?.header?.link || "",
                          body_text: card?.body?.text || "",
                          file: null,
                          buttonValues: [],
                          buttons: (card?.buttons || []).map((b: any) => ({ type: b.type || "url", text: b.text || "Button", url: b.url_value || "" })),
                        };
                      }) as any[])
                    : []
                }
              />
            ) : (
              <div className="text-center space-y-4 py-8">
                <Loader2 className="animate-spin text-primary mx-auto" size={32} />
                <p className="text-slate-400 text-sm font-medium">Loading preview...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepVariablesMapping;
