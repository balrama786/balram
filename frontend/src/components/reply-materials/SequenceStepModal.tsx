/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/src/elements/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/elements/ui/dialog";
import { Loader2 } from "lucide-react";
import React, { useMemo, useState } from "react";
import { toast } from "sonner";

import { useGetLinkedCatalogsQuery } from "@/src/redux/api/catalogueApi";
import { useGetReplyMaterialsQuery } from "@/src/redux/api/replyMaterialApi";
import { useCreateSequenceStepMutation, useUpdateSequenceStepMutation } from "@/src/redux/api/sequenceApi";
import { useGetTemplatesQuery } from "@/src/redux/api/templateApi";
import { DelayUnit, ReplyMaterialSourceType, SendDay, SequenceStep } from "@/src/types/sequence";

import { useGetCustomFieldsQuery } from "@/src/redux/api/customFieldApi";
import { CampaignCard, CarouselProduct, CONTACT_SYSTEM_FIELDS, TemplateCarouselCard } from "../campaigns/wizard/types";
import Image from "next/image";
import MaterialPicker from "./sequence-step/MaterialPicker";
import SchedulingConfig from "./sequence-step/SchedulingConfig";
import SourceTypeSelector from "./sequence-step/SourceTypeSelector";
import TemplateConfig from "./sequence-step/TemplateConfig";
import TimingConfig from "./sequence-step/TimingConfig";
import { MaterialPreviewModal } from "../shared/MaterialPreviewModal";

interface SequenceStepModalProps {
  isOpen: boolean;
  onClose: () => void;
  sequenceId: string;
  wabaId: string;
  editStep?: SequenceStep | null;
  onSuccess: () => void;
  nextSort: number;
}

const SequenceStepModal: React.FC<SequenceStepModalProps> = ({ isOpen, onClose, sequenceId, wabaId, editStep, onSuccess, nextSort }) => {
  const isEdit = !!editStep;

  const { data: materialsData, isLoading: loadingMaterials } = useGetReplyMaterialsQuery({ waba_id: wabaId }, { skip: !isOpen });
  const { data: templatesData, isLoading: loadingTemplates } = useGetTemplatesQuery({ waba_id: wabaId, status: "approved" }, { skip: !isOpen });
  const { data: catalogsData, isLoading: loadingCatalogs } = useGetLinkedCatalogsQuery({ waba_id: wabaId }, { skip: !isOpen });

  const [createStep, { isLoading: isCreating }] = useCreateSequenceStepMutation();
  const [updateStep, { isLoading: isUpdating }] = useUpdateSequenceStepMutation();

  const [sourceType, setSourceType] = useState<ReplyMaterialSourceType>(editStep?.reply_material_type || "ReplyMaterial");
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>(() => {
    if (typeof editStep?.reply_material_id === "string") return editStep.reply_material_id;
    return (editStep?.reply_material_id as any)?._id || "";
  });
  const [delayValue, setDelayValue] = useState(editStep?.delay_value || 0);
  const [delayUnit, setDelayUnit] = useState<DelayUnit>(editStep?.delay_unit || "hours");
  const [sendAnytime, setSendAnytime] = useState(editStep?.send_anytime ?? true);
  const [fromTime, setFromTime] = useState(editStep?.from_time || "09:00");
  const [toTime, setToTime] = useState(editStep?.to_time || "18:00");
  const [sendDays, setSendDays] = useState<SendDay[]>(editStep?.send_days || ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]);

  const [variablesMapping, setVariablesMapping] = useState<Record<string, string>>(editStep?.variables_mapping || {});
  const [templateMediaUrl, setTemplateMediaUrl] = useState(editStep?.media_url || "");
  const [couponCode, setCouponCode] = useState(editStep?.coupon_code || "");
  const [offerExpirationMinutes, setOfferExpirationMinutes] = useState<number | undefined>(editStep?.offer_expiration_minutes);
  const [thumbnailProductRetailerId, setThumbnailProductRetailerId] = useState(editStep?.product_retailer_id || "");
  const [carouselCardsData, setCarouselCardsData] = useState<CampaignCard[]>(editStep?.carousel_cards_data || []);
  const [carouselProducts, setCarouselProducts] = useState<CarouselProduct[]>(editStep?.carousel_products || []);

  const [previewItem, setPreviewItem] = useState<{ type: string; material: any } | null>(null);

  const [search, setSearch] = useState("");
  const { data: customFieldsResult } = useGetCustomFieldsQuery({});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const customFields = customFieldsResult?.data?.fields || [];

  const mappingOptions = useMemo(() => {
    const customOptions = customFields.map((f: any) => ({ label: `CF: ${f.label}`, value: `cf_${f.name}` }));
    return [...CONTACT_SYSTEM_FIELDS, ...customOptions];
  }, [customFields]);

  const flatMaterials = useMemo(() => {
    if (!materialsData?.data) return [];
    const { texts, images, documents, videos, stickers } = materialsData.data;
    return [...texts.items.map((i) => ({ ...i, category: "Text" })), ...images.items.map((i) => ({ ...i, category: "Image" })), ...documents.items.map((i) => ({ ...i, category: "Document" })), ...videos.items.map((i) => ({ ...i, category: "Video" })), ...stickers.items.map((i) => ({ ...i, category: "Sticker" }))];
  }, [materialsData]);

  const filteredItems = useMemo(() => {
    const s = search.toLowerCase();
    if (sourceType === "ReplyMaterial") {
      return flatMaterials.filter((m) => m.name.toLowerCase().includes(s));
    }
    if (sourceType === "Template") {
      return (templatesData?.data || []).map((t) => ({ ...t, name: t.template_name })).filter((t) => t?.name?.toLowerCase().includes(s));
    }
    if (sourceType === "EcommerceCatalog") {
      return (catalogsData?.data?.catalogs || []).filter((c) => c.name.toLowerCase().includes(s));
    }
    return [];
  }, [sourceType, search, flatMaterials, templatesData, catalogsData]);

  const selectedMaterial = useMemo(() => {
    if (sourceType === "ReplyMaterial") return flatMaterials.find((m) => m._id === selectedMaterialId);
    if (sourceType === "Template") {
      const t = (templatesData?.data || []).find((t) => t._id === selectedMaterialId);
      return t ? { ...t, name: t.template_name } : null;
    }
    if (sourceType === "EcommerceCatalog") return (catalogsData?.data?.catalogs || []).find((c) => c._id === selectedMaterialId);
    return null;
  }, [sourceType, selectedMaterialId, flatMaterials, templatesData, catalogsData]);

  const handleMaterialSelect = (id: string) => {
    setSelectedMaterialId(id);
    if (sourceType === "Template") {
      const material = (templatesData?.data || []).find((t) => t._id === id);
      if (material) {
        const components = (material as any).components || [];
        const body = components.find((c: any) => c.type === "BODY")?.text || "";
        const matches = body.match(/\{\{\d+\}\}/g) || [];
        const uniques = [...new Set(matches)];

        const newMapping: Record<string, string> = {};
        uniques.forEach((m: any) => {
          const key = m.replace(/\{\{|\}\}/g, "");
          newMapping[key] = (id === editStep?.reply_material_id ? editStep?.variables_mapping?.[key] : "") || "";
        });
        setVariablesMapping(newMapping);

        const marketingType: string = (material as any)?.template_type || "none";
        const templateCarouselCards: TemplateCarouselCard[] = (material as any)?.carousel_cards || [];

        const isCarouselProduct = marketingType === "carousel_product" || (marketingType === "carousel" && (templateCarouselCards[0]?.components?.find((c: any) => c.type === "header")?.format === "product" || (material as any)?.carousel_cards?.[0]?.components?.[0]?.format === "product"));
        const isCarouselMedia = marketingType === "carousel_media" || (marketingType === "carousel" && !isCarouselProduct);

        if (isCarouselMedia) {
          if (id === editStep?.reply_material_id && editStep?.carousel_cards_data) {
            setCarouselCardsData(editStep.carousel_cards_data);
          } else {
            const initialized = templateCarouselCards.map((tCard) => {
              const headerComp = tCard.components?.find((c: any) => c.type === "header");
              const buttonsComp = tCard.components?.find((c: any) => c.type === "buttons");
              return {
                header: { type: headerComp?.format || "image", link: "" },
                body: { text: "" },
                buttons: (buttonsComp?.buttons || []).map((b: any) => ({
                  type: b.type,
                  text: b.text || "",
                  ...(b.type === "url" ? { url_value: "" } : {}),
                  ...(b.type === "quick_reply" ? { payload: "" } : {}),
                })),
              } as CampaignCard;
            });
            setCarouselCardsData(initialized);
          }
        } else {
          setCarouselCardsData([]);
        }

        if (isCarouselProduct) {
          if (id === editStep?.reply_material_id && editStep?.carousel_products) {
            setCarouselProducts(editStep.carousel_products);
          } else {
            const initialized = templateCarouselCards.map(() => ({
              product_retailer_id: "",
              catalog_id: "",
            }));
            setCarouselProducts(initialized);
          }
        } else {
          setCarouselProducts([]);
        }

        setCouponCode(id === editStep?.reply_material_id ? editStep?.coupon_code || "" : "");
        setOfferExpirationMinutes(id === editStep?.reply_material_id ? editStep?.offer_expiration_minutes : undefined);
        setThumbnailProductRetailerId(id === editStep?.reply_material_id ? editStep?.product_retailer_id || "" : "");
      }
    } else {
      setVariablesMapping({});
      setCarouselCardsData([]);
      setCarouselProducts([]);
      setCouponCode("");
      setOfferExpirationMinutes(undefined);
      setThumbnailProductRetailerId("");
    }
  };

  const handlePreview = (item: any) => {
    setPreviewItem({ type: sourceType, material: item });
  };

  const hasMediaHeader = useMemo(() => {
    if (sourceType !== "Template" || !selectedMaterial) return false;
    const components = (selectedMaterial as any).components || [];
    const header = components.find((c: any) => c.type === "HEADER");
    return header?.format === "IMAGE" || header?.format === "VIDEO" || header?.format === "DOCUMENT";
  }, [selectedMaterial, sourceType]);

  const handleSave = async () => {
    if (!selectedMaterialId) {
      toast.error("Please select a material");
      return;
    }

    const payload = {
      sequence_id: sequenceId,
      reply_material_id: selectedMaterialId,
      reply_material_type: sourceType,
      delay_value: Number(delayValue),
      delay_unit: delayUnit,
      send_anytime: sendAnytime,
      from_time: sendAnytime ? undefined : fromTime,
      to_time: sendAnytime ? undefined : toTime,
      send_days: sendDays,
      sort: isEdit ? editStep?.sort : nextSort,
      variables_mapping: sourceType === "Template" ? variablesMapping : undefined,
      media_url: sourceType === "Template" ? templateMediaUrl : undefined,
      carousel_cards_data: sourceType === "Template" ? carouselCardsData : undefined,
      carousel_products: sourceType === "Template" ? carouselProducts : undefined,
      coupon_code: sourceType === "Template" ? couponCode : undefined,
      offer_expiration_minutes: sourceType === "Template" ? offerExpirationMinutes : undefined,
      product_retailer_id: sourceType === "Template" ? thumbnailProductRetailerId : undefined,
    };

    try {
      if (isEdit) {
        const response = await updateStep({ id: editStep!._id, data: payload }).unwrap();
        toast.success(response.message || "Step updated successfully");
      } else {
        const response = await createStep(payload).unwrap();
        toast.success(response.message || "Step added successfully");
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save step");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl! max-w-[calc(100%-2rem)]! p-0! overflow-hidden bg-white dark:bg-(--card-color) rounded-xl border-none shadow-2xl flex flex-col max-h-[90vh]">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-slate-100 dark:border-(--card-border-color) shrink-0">
          <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">{isEdit ? "Edit Sequence Step" : "Add Sequence Step"}</DialogTitle>
          <p className="text-xs text-slate-500 font-medium mt-1">Choose what to send and when to send it.</p>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 pt-0 space-y-8 custom-scrollbar">
          <SourceTypeSelector
            value={sourceType}
            onChange={(val) => {
              setSourceType(val);
              setSelectedMaterialId("");
              setVariablesMapping({});
              setTemplateMediaUrl("");
              setCouponCode("");
              setOfferExpirationMinutes(undefined);
              setThumbnailProductRetailerId("");
              setCarouselCardsData([]);
              setCarouselProducts([]);
            }}
          />

          <MaterialPicker sourceType={sourceType} search={search} onSearchChange={setSearch} isLoading={loadingMaterials || loadingTemplates || loadingCatalogs} items={filteredItems} selectedId={selectedMaterialId} onSelect={handleMaterialSelect} onPreview={handlePreview} />

          {selectedMaterial && (
            <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-(--card-border-color) animate-in fade-in slide-in-from-top-2 duration-300">
              {sourceType !== "ReplyMaterial" && <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">2. Configuration</label>}

              {sourceType === "Template" && <TemplateConfig template={selectedMaterial} wabaId={wabaId} variablesMapping={variablesMapping} onVariableChange={(key, val) => setVariablesMapping((prev) => ({ ...prev, [key]: val }))} mediaUrl={templateMediaUrl} onMediaUrlChange={setTemplateMediaUrl} hasMediaHeader={hasMediaHeader} couponCode={couponCode} onCouponCodeChange={setCouponCode} offerExpirationMinutes={offerExpirationMinutes} onOfferExpirationMinutesChange={setOfferExpirationMinutes} thumbnailProductRetailerId={thumbnailProductRetailerId} onThumbnailProductRetailerIdChange={setThumbnailProductRetailerId} carouselCardsData={carouselCardsData} onCarouselCardsDataChange={setCarouselCardsData} carouselProducts={carouselProducts} onCarouselProductsChange={setCarouselProducts} mappingOptions={mappingOptions} />}

              {sourceType === "ReplyMaterial" && (selectedMaterial as any).type !== "text" && (
                <div className="p-3 bg-slate-50 dark:bg-(--dark-body) rounded-xl flex items-center gap-3 border border-slate-100 dark:border-slate-800/60">
                  <div className="w-12 h-12 rounded-lg bg-white dark:bg-slate-800 overflow-hidden flex items-center justify-center shrink-0">
                    <Image src={(selectedMaterial as any).file_url} className="w-full h-full object-cover" alt="preview" onError={(e) => (e.currentTarget.style.display = "none")} width={100} height={100} unoptimized />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 dark:text-white truncate">Media Attachment Attached</p>
                    <p className="text-[10px] truncate text-slate-400">{(selectedMaterial as any).file_url}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-(--card-border-color)">
            <label className="text-sm font-black dark:text-gray-500 text-slate-400">3. Timing & Scheduling</label>

            <TimingConfig delayValue={delayValue} onDelayValueChange={setDelayValue} delayUnit={delayUnit} onDelayUnitChange={setDelayUnit} />

            <SchedulingConfig sendAnytime={sendAnytime} onSendAnytimeChange={setSendAnytime} fromTime={fromTime} onFromTimeChange={setFromTime} toTime={toTime} onToTimeChange={setToTime} sendDays={sendDays} onSendDaysChange={setSendDays} />
          </div>
        </div>

        <div className="p-6 pt-4 border-t border-slate-100 dark:border-(--card-border-color) bg-slate-50/50 dark:bg-(--card-color) shrink-0 flex gap-3">
          <Button variant="outline" type="button" onClick={onClose} className="flex-1 h-11 rounded-lg font-bold border-slate-200 dark:border-none dark:text-gray-400 text-slate-500">
            Cancel
          </Button>
          <Button type="button" onClick={handleSave} disabled={isCreating || isUpdating} className="flex-1 h-11 rounded-lg bg-primary text-white font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all">
            {isCreating || isUpdating ? <Loader2 className="animate-spin" size={18} /> : isEdit ? "Update Step" : "Add Step"}
          </Button>
        </div>
      </DialogContent>
      {previewItem && <MaterialPreviewModal isOpen={!!previewItem} onClose={() => setPreviewItem(null)} type={previewItem.type} material={previewItem.material} />}
    </Dialog>
  );
};

export default SequenceStepModal;
