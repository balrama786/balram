/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCreateAdminTemplateMutation, useGetAdminTemplateByIdQuery, useUpdateAdminTemplateMutation } from "@/src/redux/api/adminTemplateApi";
import { AuthFormData, ButtonTemplate, MediaCard, ProductCard } from "@/src/types/template";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import TurndownService from "turndown";

export const makeId = () => Math.random().toString(36).substr(2, 9);

const defaultProductCard = () => ({ id: makeId(), button_text: "View" });
const defaultMediaCard = (templates: { id: string; type: string }[]) => ({
  id: makeId(),
  body_text: "",
  file: null as File | null,
  buttonValues: templates.map((t) => ({ templateId: t.id, text: "", url: t.type === "url" ? "" : undefined })),
});

export const useAdminTemplateForm = (templateId?: string) => {
  const router = useRouter();
  const turndownService = new TurndownService({ emDelimiter: "_" });
  turndownService.escape = (text) => text;

  const [createTemplate, { isLoading: isCreating }] = useCreateAdminTemplateMutation();
  const [updateTemplate] = useUpdateAdminTemplateMutation();
  const { data: templateResponse } = useGetAdminTemplateByIdQuery(templateId!, { skip: !templateId });

  const [isInitialized, setIsInitialized] = useState(false);
  const [editor, setEditor] = useState<any>(null);
  const [headerFile, setHeaderFile] = useState<File | null>(null);

  const [formData, setFormData] = useState<any>({
    language: "en_US",
    category: "UTILITY",
    template_name: "",
    template_type: "none",
    header_text: "",
    message_body: "",
    footer_text: "",
    interactive_type: "none",
    buttons: undefined,
    variables_example: [],
    marketing_type: "none",
    offer_text: "",
    sector: "",
    template_category: "",
  });

  const [productCards, setProductCards] = useState<ProductCard[]>([defaultProductCard(), defaultProductCard()]);
  const [mediaButtonTemplates, setMediaButtonTemplates] = useState<ButtonTemplate[]>([]);
  const [mediaCards, setMediaCards] = useState<MediaCard[]>([defaultMediaCard([]), defaultMediaCard([])]);

  const [authData, setAuthData] = useState<AuthFormData>({
    message_body: "Your verification code is {{1}}. Valid for {{2}} minutes.",
    footer_text: "",
    add_security_recommendation: true,
    code_expiration_minutes: 10,
    otp_code_length: 6,
    otp_buttons: [{ otp_type: "COPY_CODE", copy_button_text: "Copy Code" }],
    variables_example: [
      { key: "1", example: "" },
      { key: "2", example: "" },
    ],
  });

  const isMarketingCarousel = useMemo(() => ["carousel_product", "carousel_media"].includes(formData.marketing_type), [formData.marketing_type]);
  const isLimitedTimeOffer = useMemo(() => formData.marketing_type === "limited_time_offer", [formData.marketing_type]);
  const isCouponCode = useMemo(() => formData.marketing_type === "coupon_code", [formData.marketing_type]);
  const isCatalog = useMemo(() => formData.marketing_type === "catalog", [formData.marketing_type]);
  const isCallPermission = useMemo(() => formData.marketing_type === "call_permission", [formData.marketing_type]);
  const isSpecialMarketing = useMemo(() => formData.marketing_type !== "none" && formData.category === "MARKETING", [formData.marketing_type, formData.category]);
  const hideHeaderFooter = isSpecialMarketing;

  // Helper to map a template object into formData
  const mapTemplateToFormData = (template: any) => {
    let marketing_type: any = "none";

    // Normalize types for comparison
    const tType = template.template_type?.toLowerCase();
    const mType = template.marketing_type?.toLowerCase();

    // Check for explicit markers or type strings
    if (template.is_limited_time_offer || mType === "limited_time_offer") {
      marketing_type = "limited_time_offer";
    } else if (template.call_permission || mType === "call_permission" || tType === "call_permission") {
      marketing_type = "call_permission";
    } else if (tType === "carousel_media" || mType === "carousel_media") {
      marketing_type = "carousel_media";
    } else if (tType === "carousel_product" || mType === "carousel_product") {
      marketing_type = "carousel_product";
    } else if (tType === "catalog" || mType === "catalog" || template.buttons?.some((b: any) => b.type === "catalog")) {
      marketing_type = "catalog";
    } else if (tType === "coupon_code" || mType === "coupon_code" || template.buttons?.some((b: any) => b.type === "copy_code")) {
      marketing_type = "coupon_code";
    }

    return {
      language: template.language || "en_US",
      category: template.category || "MARKETING",
      template_name: template.template_name || "",
      template_type: template.header?.format?.toLowerCase() || (tType === "carousel_media" ? "image" : "none"),
      header_text: template.header?.text || "",
      message_body: template.message_body || "",
      footer_text: template.footer_text || "",
      interactive_type: template.buttons?.length ? "cta" : "none",
      buttons: (template.buttons || []).map((btn: any) => ({ ...btn, id: makeId() })),
      variables_example: template.body_variables || template.variables_example || template.variables || [],
      marketing_type,
      offer_text: template.offer_text || "",
      sector: template.sector || "",
      template_category: template.template_category || "",
    };
  };

  useEffect(() => {
    if (templateResponse?.data && !isInitialized) {
      const t = templateResponse.data;
      const mapped = mapTemplateToFormData(t);

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(mapped);

      // Handle Carousels
      if (mapped.marketing_type === "carousel_product" && t.carousel_cards) {
        setProductCards(
          t.carousel_cards.map((c: any) => {
            const button = c.components?.find((comp: any) => comp.type === "buttons")?.buttons?.[0];
            return {
              id: makeId(),
              button_text: button?.text || "View",
            };
          })
        );
      }

      if (mapped.marketing_type === "carousel_media" && t.carousel_cards) {
        // Extract button templates from the first card
        const firstCard = t.carousel_cards[0];
        const buttonsComp = firstCard.components?.find((comp: any) => comp.type === "buttons");
        const buttons = (buttonsComp?.buttons || []).map((btn: any) => ({
          id: makeId(),
          type: btn.type === "url" ? "url" : "quick_reply",
        }));

        setMediaButtonTemplates(buttons);

        setMediaCards(
          t.carousel_cards.map((c: any) => {
            const bodyComp = c.components?.find((comp: any) => comp.type === "body");
            const cardButtonsComp = c.components?.find((comp: any) => comp.type === "buttons");

            return {
              id: makeId(),
              body_text: bodyComp?.text || "",
              file: null,
              buttonValues: buttons.map((tmpl: any, idx: number) => {
                const btnVal = cardButtonsComp?.buttons?.[idx];
                return {
                  templateId: tmpl.id,
                  text: btnVal?.text || "",
                  url: tmpl.type === "url" ? btnVal?.url || "" : undefined,
                };
              }),
            };
          })
        );
      }

      if (t.category === "AUTHENTICATION") {
        setAuthData({
          message_body: t.message_body || "",
          footer_text: t.footer_text || "",
          add_security_recommendation: (t as any).add_security_recommendation ?? true,
          code_expiration_minutes: (t as any).code_expiration_minutes ?? 10,
          otp_code_length: (t as any).otp_code_length ?? 6,
          otp_buttons: (t as any).otp_buttons ?? [{ otp_type: "COPY_CODE", copy_button_text: "Copy Code" }],
          variables_example: t.variables_example || [{ key: "1", example: "" }],
        });
      }
      setIsInitialized(true);
    }
  }, [templateResponse, isInitialized]);

  // Handle Authentication Mode specific defaults/restrictions
  useEffect(() => {
    if (formData.category === "AUTHENTICATION") {
      const currentBtnText = authData.otp_buttons?.[0]?.copy_button_text;
      if (currentBtnText !== "Copy Code") {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setAuthData((prev) => ({
          ...prev,
          otp_buttons: [{ ...prev.otp_buttons?.[0], otp_type: prev.otp_buttons?.[0]?.otp_type || "COPY_CODE", copy_button_text: "Copy Code" }],
        }));
      }
    }
  }, [formData.category, authData.otp_buttons]);

  const handleBodyChange = (data: string) => {
    const isAuth = formData.category === "AUTHENTICATION";
    const stripped = data.replace(/<[^>]*>/g, "");

    // Enforce 1600 limit strictly
    if (stripped.length > 1600) {
      const currentBody = isAuth ? authData.message_body : formData.message_body || "";
      const currentStripped = currentBody.replace(/<[^>]*>/g, "");
      if (stripped.length > currentStripped.length) {
        toast.error("Message body cannot exceed 1600 characters");
        if (editor) {
          // Use timeout to ensure we don't conflict with the current change cycle
          setTimeout(() => {
            editor.setData(currentBody);
          }, 0);
        }
        return;
      }
    }

    const variableMatches = data.match(/{{([^}]+)}}/g);
    const uniqueKeys = variableMatches ? Array.from(new Set(variableMatches.map((m) => m.replace(/{{|}}/g, "")))) : [];

    if (isAuth) {
      setAuthData((prev: any) => {
        const existing = prev.variables_example || [];
        const newVars = uniqueKeys.map((key) => existing.find((v: any) => v.key === key) || { key, example: "" });
        return { ...prev, message_body: data, variables_example: newVars };
      });
      return;
    }

    setFormData((prev: any) => {
      const existing = prev.variables_example || [];
      const newVars = uniqueKeys.map((key) => existing.find((v: any) => v.key === key) || { key, example: "" });
      return { ...prev, message_body: data, variables_example: newVars };
    });
  };

  const addVariable = () => {
    const nextKey = (formData.variables_example?.length || 0) + 1;
    const varTag = `{{${nextKey}}}`;

    // Check limit before adding variable
    const isAuth = formData.category === "AUTHENTICATION";
    const currentBody = isAuth ? authData.message_body : formData.message_body || "";
    const stripped = currentBody.replace(/<[^>]*>/g, "");

    if (stripped.length + varTag.length > 1600) {
      return toast.error("Message body cannot exceed 1600 characters");
    }

    if (editor) {
      editor.model.change((writer: any) => {
        writer.insertText(varTag, editor.model.document.selection.getFirstPosition());
      });
      handleBodyChange(editor.getData());
    } else {
      handleBodyChange(currentBody + ` ${varTag}`);
    }
  };

  const updateVariable = (index: number, value: string) => {
    const newVars = [...formData.variables_example];
    newVars[index].example = value;
    setFormData((prev: any) => ({ ...prev, variables_example: newVars }));
  };

  const addButton = (type: "quick_reply" | "website" | "phone_call" | "copy_code") => {
    const existingButtons = formData.buttons || [];
    const normalizedType = type === "website" ? "url" : type;
    const count = existingButtons.filter((b: any) => b.type === normalizedType).length;

    const limits: Record<string, number> = {
      quick_reply: 10,
      url: 2,
      phone_call: 1,
      copy_code: 1,
    };

    if (count >= (limits[normalizedType] || 0)) {
      return toast.error(`You can only add up to ${limits[normalizedType]} ${normalizedType.replace("_", " ")} buttons.`);
    }

    const newBtn = { id: makeId(), type: normalizedType, text: "", url: type === "website" ? "" : undefined, phone_number: type === "phone_call" ? "" : undefined };
    setFormData((prev: any) => ({ ...prev, buttons: [...(prev.buttons || []), newBtn] }));
  };
  const removeButton = (id: string) => setFormData((prev: any) => ({ ...prev, buttons: prev.buttons.filter((b: any) => b.id !== id) }));
  const updateButton = (id: string, updates: any) => setFormData((prev: any) => ({ ...prev, buttons: prev.buttons.map((b: any) => (b.id === id ? { ...b, ...updates } : b)) }));

  const addProductCard = () => setProductCards((p) => [...p, defaultProductCard()]);
  const removeProductCard = (id: string) => setProductCards((p) => p.filter((c) => c.id !== id));
  const updateProductCard = (id: string, updates: Partial<ProductCard>) => setProductCards((p) => p.map((c) => (c.id === id ? { ...c, ...updates } : c)));

  const addMediaCard = () => setMediaCards((p) => [...p, defaultMediaCard(mediaButtonTemplates)]);
  const removeMediaCard = (id: string) => setMediaCards((p) => p.filter((c) => c.id !== id));
  const updateMediaCard = (id: string, updates: Partial<MediaCard>) => setMediaCards((p) => p.map((c) => (c.id === id ? { ...c, ...updates } : c)));

  const addMediaButtonTemplate = (type: "url" | "quick_reply") => {
    const newTmpl: ButtonTemplate = { id: makeId(), type };
    setMediaButtonTemplates((p) => [...p, newTmpl]);
    setMediaCards((p) => p.map((c) => ({ ...c, buttonValues: [...c.buttonValues, { templateId: newTmpl.id, text: "", url: type === "url" ? "" : undefined }] })));
  };
  const removeMediaButtonTemplate = (tmplId: string) => {
    setMediaButtonTemplates((p) => p.filter((t) => t.id !== tmplId));
    setMediaCards((p) => p.map((c) => ({ ...c, buttonValues: c.buttonValues.filter((v) => v.templateId !== tmplId) })));
  };
  const updateMediaCardButtonValue = (cardId: string, tmplId: string, updates: Partial<{ templateId: string; text: string; url?: string }>) => {
    setMediaCards((p) => p.map((c) => (c.id === cardId ? { ...c, buttonValues: c.buttonValues.map((v) => (v.templateId === tmplId ? { ...v, ...updates } : v)) } : c)));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.language) return toast.error("Language is required");
    if (!formData.category) return toast.error("Category is required");
    if (!formData.template_name) return toast.error("Template name is required");
    if (formData.category !== "AUTHENTICATION" && !formData.message_body) return toast.error("Message body is required");
    if (formData.category === "AUTHENTICATION" && !authData.message_body) return toast.error("Message body is required");
    if (isLimitedTimeOffer && !formData.offer_text) return toast.error("Offer text is required");
    if (formData.marketing_type === "carousel_product" && productCards.length < 2) return toast.error("At least 2 product cards required");
    if (formData.marketing_type === "carousel_media" && mediaCards.length < 2) return toast.error("At least 2 media cards required");

    const messageBody = turndownService.turndown(formData.message_body);
    const sectorPayload = { sector: formData.sector || undefined, template_category: formData.template_category || undefined };

    // Authentication
    if (formData.category === "AUTHENTICATION") {
      const payload: any = {
        template_name: formData.template_name,
        language: formData.language,
        category: "AUTHENTICATION",
        message_body: authData.message_body,
        footer_text: authData.footer_text || undefined,
        add_security_recommendation: authData.add_security_recommendation,
        code_expiration_minutes: authData.code_expiration_minutes !== "" ? authData.code_expiration_minutes : undefined,
        otp_code_length: authData.otp_code_length !== "" ? authData.otp_code_length : undefined,
        otp_buttons: authData.otp_buttons,
        variable_examples: authData.variables_example,
        ...sectorPayload,
      };
      try {
        if (templateId) await updateTemplate({ id: templateId, data: payload }).unwrap();
        else await createTemplate(payload).unwrap();
        toast.success("Template saved successfully");
        router.push("/templates_library");
      } catch {
        toast.error("Failed to save template");
      }
      return;
    }

    // Catalog
    if (formData.marketing_type === "catalog") {
      const payload = { template_name: formData.template_name, language: formData.language, category: formData.category, message_body: messageBody, header_text: "", footer_text: "", variable_examples: formData.variables_example, buttons: [{ type: "catalog", text: formData.catalog_button_text || "View catalog" }], ...sectorPayload };
      try {
        if (templateId) await updateTemplate({ id: templateId, data: payload }).unwrap();
        else await createTemplate(payload).unwrap();
        toast.success("Template saved successfully");
        router.push("/templates_library");
      } catch {
        toast.error("Failed to save template");
      }
      return;
    }

    // Call Permission
    if (formData.marketing_type === "call_permission") {
      const payload = { template_name: formData.template_name, language: formData.language, category: formData.category, message_body: messageBody, header_text: "", footer_text: "", variable_examples: formData.variables_example, call_permission: "true", ...sectorPayload };
      try {
        if (templateId) await updateTemplate({ id: templateId, data: payload }).unwrap();
        else await createTemplate(payload).unwrap();
        toast.success("Template saved successfully");
        router.push("/templates_library");
      } catch {
        toast.error("Failed to save template");
      }
      return;
    }

    // Carousel Product
    if (formData.marketing_type === "carousel_product") {
      const payload = {
        template_name: formData.template_name,
        language: formData.language,
        category: "marketing",
        template_type: "carousel_product",
        message_body: messageBody,
        variable_examples: formData.variables_example?.[0] || undefined,
        carousel_cards: productCards.map((card) => ({
          components: [
            { type: "header", format: "product" },
            { type: "buttons", buttons: [{ type: "spm", text: card.button_text || "View" }] },
          ],
        })),
        ...sectorPayload,
      };
      try {
        if (templateId) await updateTemplate({ id: templateId, data: payload }).unwrap();
        else await createTemplate(payload).unwrap();
        toast.success("Template saved successfully");
        router.push("/templates_library");
      } catch {
        toast.error("Failed to save template");
      }
      return;
    }

    // Carousel Media
    if (formData.marketing_type === "carousel_media") {
      const fd = new FormData();
      fd.append("template_name", formData.template_name);
      fd.append("language", formData.language);
      fd.append("category", "marketing");
      fd.append("template_type", "carousel_media");
      fd.append("message_body", messageBody);
      if (formData.variables_example?.[0]) fd.append("variable_examples", JSON.stringify(formData.variables_example[0]));
      if (formData.sector) fd.append("sector", formData.sector);
      if (formData.template_category) fd.append("template_category", formData.template_category);
      const cardsPayload = mediaCards.map((card) => ({
        components: [
          { type: "header", format: "image" },
          ...(card.body_text ? [{ type: "body", text: card.body_text }] : []),
          {
            type: "buttons",
            buttons: mediaButtonTemplates.map((tmpl) => {
              const val = card.buttonValues.find((v) => v.templateId === tmpl.id);
              return tmpl.type === "url" ? { type: "url", text: val?.text || "", url: val?.url || "" } : { type: "quick_reply", text: val?.text || "" };
            }),
          },
        ],
      }));
      fd.append("carousel_cards", JSON.stringify(cardsPayload));
      mediaCards.forEach((card) => {
        if (card.file) fd.append("card_media", card.file);
      });
      try {
        if (templateId) await updateTemplate({ id: templateId, data: fd }).unwrap();
        else await createTemplate(fd).unwrap();
        toast.success("Template saved successfully");
        router.push("/templates_library");
      } catch {
        toast.error("Failed to save template");
      }
      return;
    }

    // Standard / LTO / Coupon
    const cleanButtons = formData?.buttons
      ? formData.buttons.map((btn: any) => {
          const { id: _, ...rest } = btn;
          if (rest.type === "url" || rest.type === "website") {
            const url = rest.url || rest.website_url;
            return { type: "url", text: rest.text, url, example: [url] };
          }
          if (rest.type === "copy_code") return { type: "copy_code", text: rest.text };
          return rest;
        })
      : undefined;

    const hasFile = headerFile && formData.template_type !== "none" && formData.template_type !== "text";
    let payload: any;
    if (hasFile) {
      payload = new FormData();
      payload.append("template_name", formData.template_name);
      payload.append("category", formData.category);
      payload.append("language", formData.language);
      payload.append("message_body", messageBody);
      payload.append("header_text", formData.header_text || "");
      payload.append("footer_text", formData.footer_text || "");
      if (cleanButtons) payload.append("buttons", JSON.stringify(cleanButtons));
      payload.append("variables_example", JSON.stringify(formData.variables_example));
      payload.append("is_limited_time_offer", isLimitedTimeOffer);
      if (isLimitedTimeOffer) {
        payload.append("offer_text", formData.offer_text);
        payload.append("has_expiration", "true");
      }
      payload.append("file", headerFile);
      if (formData.sector) payload.append("sector", formData.sector);
      if (formData.template_category) payload.append("template_category", formData.template_category);
    } else {
      payload = { template_name: formData.template_name, category: formData.category, language: formData.language, message_body: messageBody, header_text: formData.header_text || "", footer_text: formData.footer_text || "", buttons: cleanButtons, variables_example: formData.variables_example, is_limited_time_offer: isLimitedTimeOffer, offer_text: isLimitedTimeOffer ? formData.offer_text : undefined, has_expiration: isLimitedTimeOffer ? true : undefined, ...sectorPayload };
    }

    try {
      if (templateId) await updateTemplate({ id: templateId, data: payload }).unwrap();
      else await createTemplate(payload).unwrap();
      toast.success("Template saved successfully");
      router.push("/templates_library");
    } catch {
      toast.error("Failed to save template");
    }
  };

  return {
    router,
    isCreating,
    formData,
    setFormData,
    authData,
    setAuthData,
    productCards,
    mediaCards,
    mediaButtonTemplates,
    isMarketingCarousel,
    isLimitedTimeOffer,
    isCouponCode,
    isCatalog,
    isCallPermission,
    hideHeaderFooter,
    headerFile,
    setHeaderFile,
    handleBodyChange,
    addVariable,
    updateVariable,
    addButton,
    removeButton,
    updateButton,
    addProductCard,
    removeProductCard,
    updateProductCard,
    addMediaCard,
    removeMediaCard,
    updateMediaCard,
    addMediaButtonTemplate,
    removeMediaButtonTemplate,
    updateMediaCardButtonValue,
    onSubmit,
    setEditor,
  };
};
