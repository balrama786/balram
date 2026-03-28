/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCreateTemplateMutation, useGetTemplateQuery, useUpdateTemplateMutation } from "@/src/redux/api/templateApi";
import { useGetAdminTemplateByIdQuery } from "@/src/redux/api/adminTemplateApi";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import TurndownService from "turndown";
import { AuthFormData, ButtonTemplate, CardButtonValue, MarketingType, MediaCard, ProductCard, UseTemplateFormProps } from "@/src/types/components/Template";

export const makeId = () => Math.random().toString(36).substr(2, 9);

export const defaultProductCard = (): ProductCard => ({ id: makeId(), button_text: "View" });

export const defaultMediaCard = (buttonTemplates: ButtonTemplate[]): MediaCard => ({
  id: makeId(),
  body_text: "",
  file: null,
  buttonValues: buttonTemplates.map((t) => ({ templateId: t.id, text: "", url: t.type === "url" ? "" : undefined })),
});

export const useTemplateForm = ({ wabaId, templateId, adminTemplateId }: UseTemplateFormProps) => {
  const router = useRouter();
  const turndownService = new TurndownService({ emDelimiter: "_" });
  turndownService.escape = (text) => text;

  const [createTemplate, { isLoading: isCreating }] = useCreateTemplateMutation();
  const [updateTemplate, { isLoading: isEditing }] = useUpdateTemplateMutation();
  const { data: templateResponse } = useGetTemplateQuery(templateId!, { skip: !templateId });
  const { data: adminTemplateResponse } = useGetAdminTemplateByIdQuery(adminTemplateId!, { skip: !adminTemplateId });

  const [isInitialized, setIsInitialized] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
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
    marketing_type: "none" as MarketingType,
    offer_text: "",
  });

  // Carousel card states
  const [productCards, setProductCards] = useState<ProductCard[]>([defaultProductCard(), defaultProductCard()]);
  const [mediaButtonTemplates, setMediaButtonTemplates] = useState<ButtonTemplate[]>([]);
  const [mediaCards, setMediaCards] = useState<MediaCard[]>([defaultMediaCard([]), defaultMediaCard([])]);

  // Authentication form state
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

  // Derived states
  const isMarketingCarousel = useMemo(() => ["carousel_product", "carousel_media"].includes(formData.marketing_type), [formData.marketing_type]);
  const isLimitedTimeOffer = useMemo(() => formData.marketing_type === "limited_time_offer", [formData.marketing_type]);
  const isCouponCode = useMemo(() => formData.marketing_type === "coupon_code", [formData.marketing_type]);
  const isCatalog = useMemo(() => formData.marketing_type === "catalog", [formData.marketing_type]);
  const isCallPermission = useMemo(() => formData.marketing_type === "call_permission", [formData.marketing_type]);
  const isSpecialMarketing = useMemo(() => formData.marketing_type !== "none" && formData.category === "MARKETING", [formData.marketing_type, formData.category]);
  const hideHeaderFooter = isSpecialMarketing;

  // Helper to map a template object (user or admin) into formData
  const mapTemplateToFormData = (template: any) => {
    let marketing_type: MarketingType = "none";

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
    };
  };

  useEffect(() => {
    if (templateResponse?.data && !isInitialized) {
      const template = templateResponse.data as any;
      const mapped = mapTemplateToFormData(template);

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(mapped);

      // Handle Carousels
      if (mapped.marketing_type === "carousel_product" && template.carousel_cards) {
        setProductCards(
          template.carousel_cards.map((c: any) => {
            const button = c.components?.find((comp: any) => comp.type === "buttons")?.buttons?.[0];
            return {
              id: makeId(),
              button_text: button?.text || "View",
            };
          })
        );
      }

      if (mapped.marketing_type === "carousel_media" && template.carousel_cards) {
        // Extract button templates from the first card
        const firstCard = template.carousel_cards[0];
        const buttonsComp = firstCard.components?.find((comp: any) => comp.type === "buttons");
        const buttons = (buttonsComp?.buttons || []).map((btn: any) => ({
          id: makeId(),
          type: btn.type === "url" ? "url" : "quick_reply",
        }));

        setMediaButtonTemplates(buttons);

        setMediaCards(
          template.carousel_cards.map((c: any) => {
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

      // Populate auth data if editing an AUTHENTICATION template
      if (template.category === "AUTHENTICATION") {
        setAuthData({
          message_body: template.message_body || "",
          footer_text: template.footer_text || "",
          add_security_recommendation: (template as any).add_security_recommendation ?? true,
          code_expiration_minutes: (template as any).code_expiration_minutes ?? 10,
          otp_code_length: (template as any).otp_code_length ?? 6,
          otp_buttons: (template as any).otp_buttons ?? [{ otp_type: "COPY_CODE", copy_button_text: "Copy Code" }],
          variables_example: template.variables_example || template.variables || [{ key: "1", example: "" }],
        });
      }

      setIsInitialized(true);
    }
  }, [templateResponse, isInitialized]);

  // Pre-fill from admin template (create mode only — no templateId)
  useEffect(() => {
    if (adminTemplateResponse?.data && !isInitialized && !templateId) {
      const template = adminTemplateResponse.data;
      const mappedFormData = mapTemplateToFormData(template);

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData((prev: any) => ({
        ...mappedFormData,
        // Keep name as is but user can change it (WA names must be unique)
        template_name: template.template_name || "",
        // Preserve user's current waba context
        waba_id: prev.waba_id,
      }));

      // Handle Carousels
      if (mappedFormData.marketing_type === "carousel_product" && template.carousel_cards) {
        const cards = template.carousel_cards.map((c: any) => {
          const button = c.components?.find((comp: any) => comp.type === "buttons")?.buttons?.[0];
          return {
            id: makeId(),
            button_text: button?.text || "View",
          };
        });
        if (cards.length > 0) setProductCards(cards);
      }

      if (mappedFormData.marketing_type === "carousel_media" && template.carousel_cards) {
        // Extract button templates from the first card's components
        const firstCard = template.carousel_cards[0];
        const buttonsComp = firstCard.components?.find((comp: any) => comp.type === "buttons");
        const buttons = (buttonsComp?.buttons || []).map((btn: any) => ({
          id: makeId(),
          type: btn.type === "url" ? "url" : "quick_reply",
        }));

        setMediaButtonTemplates(buttons);

        const cards = template.carousel_cards.map((c: any) => {
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
        });
        if (cards.length > 0) setMediaCards(cards);
      }

      if (template.category === "AUTHENTICATION") {
        setAuthData({
          message_body: template.message_body || "",
          footer_text: template.footer_text || "",
          add_security_recommendation: (template as any).add_security_recommendation ?? true,
          code_expiration_minutes: (template as any).code_expiration_minutes ?? 10,
          otp_code_length: (template as any).otp_code_length ?? 6,
          otp_buttons: (template as any).otp_buttons ?? [{ otp_type: "COPY_CODE", copy_button_text: "Copy Code" }],
          variables_example: template.body_variables || template.variables_example || template.variables || [{ key: "1", example: "" }],
        });
      }

      setIsInitialized(true);
    }
  }, [adminTemplateResponse, isInitialized, templateId]);

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

    if (isAuth) {
      if (stripped.length > 1600 && stripped.length > (authData.message_body || "").replace(/<[^>]*>/g, "").length) {
        return;
      }
      const variableMatches = data.match(/{{([^}]+)}}/g);
      const uniqueKeys = variableMatches ? Array.from(new Set(variableMatches.map((m) => m.replace(/{{|}}/g, "")))) : [];
      const existingVars = authData.variables_example || [];
      const newVars = uniqueKeys.map((key) => existingVars.find((v) => v.key === key) || { key, example: "" });
      setAuthData((prev) => ({ ...prev, message_body: data, variables_example: newVars }));
      return;
    }

    const variableMatches = data.match(/{{([^}]+)}}/g);
    const uniqueKeys = variableMatches ? Array.from(new Set(variableMatches.map((m) => m.replace(/{{|}}/g, "")))) : [];
    setFormData((prev: any) => {
      const existingVars = prev.variables_example || [];
      const newVars = uniqueKeys.map((key) => existingVars.find((v: any) => v.key === key) || { key, example: "" });
      return { ...prev, message_body: data, variables_example: newVars };
    });
  };

  const addVariable = () => {
    const nextKey = (formData.variables_example?.length || 0) + 1;
    if (editor) {
      editor.model.change((writer: any) => {
        writer.insertText(`{{${nextKey}}}`, editor.model.document.selection.getFirstPosition());
      });
      handleBodyChange(editor.getData());
    } else {
      handleBodyChange(formData.message_body + ` {{${nextKey}}}`);
    }
  };

  const updateVariable = (index: number, value: string) => {
    const newVars = [...formData.variables_example];
    newVars[index] = { ...newVars[index], example: value };
    setFormData((prev: any) => ({ ...prev, variables_example: newVars }));
  };

  // Button (regular template)
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

    const newBtn = {
      id: makeId(),
      type: normalizedType,
      text: "",
      url: type === "website" ? "" : undefined,
      phone_number: type === "phone_call" ? "" : undefined,
    };
    setFormData((prev: any) => ({ ...prev, buttons: [...(prev.buttons || []), newBtn] }));
  };

  const removeButton = (id: string) => {
    setFormData((prev: any) => ({ ...prev, buttons: prev.buttons.filter((b: any) => b.id !== id) }));
  };

  const updateButton = (id: string, updates: any) => {
    setFormData((prev: any) => ({
      ...prev,
      buttons: prev.buttons.map((b: any) => (b.id === id ? { ...b, ...updates } : b)),
    }));
  };

  // Product card
  const addProductCard = () => setProductCards((p) => [...p, defaultProductCard()]);
  const removeProductCard = (id: string) => setProductCards((p) => p.filter((c) => c.id !== id));
  const updateProductCard = (id: string, updates: Partial<ProductCard>) => setProductCards((p) => p.map((c) => (c.id === id ? { ...c, ...updates } : c)));

  // Media card / button template
  const addMediaCard = () => setMediaCards((p) => [...p, defaultMediaCard(mediaButtonTemplates)]);
  const removeMediaCard = (id: string) => setMediaCards((p) => p.filter((c) => c.id !== id));
  const updateMediaCard = (id: string, updates: Partial<MediaCard>) => setMediaCards((p) => p.map((c) => (c.id === id ? { ...c, ...updates } : c)));

  const addMediaButtonTemplate = (type: "url" | "quick_reply") => {
    const newTmpl: ButtonTemplate = { id: makeId(), type };
    setMediaButtonTemplates((p) => [...p, newTmpl]);
    setMediaCards((p) =>
      p.map((c) => ({
        ...c,
        buttonValues: [...c.buttonValues, { templateId: newTmpl.id, text: "", url: type === "url" ? "" : undefined }],
      }))
    );
  };

  const removeMediaButtonTemplate = (tmplId: string) => {
    setMediaButtonTemplates((p) => p.filter((t) => t.id !== tmplId));
    setMediaCards((p) => p.map((c) => ({ ...c, buttonValues: c.buttonValues.filter((v) => v.templateId !== tmplId) })));
  };

  const updateMediaCardButtonValue = (cardId: string, tmplId: string, updates: Partial<CardButtonValue>) => {
    setMediaCards((p) => p.map((c) => (c.id === cardId ? { ...c, buttonValues: c.buttonValues.map((v) => (v.templateId === tmplId ? { ...v, ...updates } : v)) } : c)));
  };

  // AI success handler
  const handleAISuccess = (aiData: any) => {
    setFormData((prev: any) => ({
      ...prev,
      template_name: aiData.template_name || prev.template_name,
      category: aiData.category || prev.category,
      language: aiData.language || prev.language,
      header_text: aiData.header_text || prev.header_text,
      message_body: aiData.message_body || prev.message_body,
      footer_text: aiData.footer_text || prev.footer_text,
      template_type: aiData.header_text ? "text" : "none",
    }));
    if (aiData.message_body) handleBodyChange(aiData.message_body);
  };

  // Submit
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.language) return toast.error("Language is required");
    if (!formData.category) return toast.error("Category is required");
    if (!formData.template_name) return toast.error("Template name is required");
    // For authentication templates, message body lives in authData
    if (formData.category !== "AUTHENTICATION" && !formData.message_body) return toast.error("Message body is required");
    if (formData.category === "AUTHENTICATION" && !authData.message_body) return toast.error("Message body is required");
    if (isLimitedTimeOffer && !formData.offer_text) return toast.error("Offer text is required");
    if (formData.marketing_type === "carousel_product" && productCards.length < 2) return toast.error("At least 2 product cards required");
    if (formData.marketing_type === "carousel_media" && mediaCards.length < 2) return toast.error("At least 2 media cards required");

    const messageBody = turndownService.turndown(formData.message_body);

    // Authentication template
    if (formData.category === "AUTHENTICATION") {
      const payload: any = {
        waba_id: wabaId,
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
      };
      try {
        if (templateId) await updateTemplate({ id: templateId, data: payload }).unwrap();
        else await createTemplate(payload).unwrap();
        toast.success("Template saved successfully");
        router.push(`/templates/${wabaId}`);
      } catch {
        toast.error("Failed to save template");
      }
      return;
    }

    if (formData.marketing_type === "catalog") {
      const payload = {
        waba_id: wabaId,
        template_name: formData.template_name,
        language: formData.language,
        category: formData.category,
        message_body: messageBody,
        header_text: "",
        footer_text: "",
        variable_examples: formData.variables_example,
        template_type: "catalog",
        buttons: [{ type: "catalog", text: formData.catalog_button_text || "View catalog" }],
      };
      try {
        if (templateId) await updateTemplate({ id: templateId, data: payload }).unwrap();
        else await createTemplate(payload).unwrap();
        toast.success("Template saved successfully");
        router.push(`/templates/${wabaId}`);
      } catch {
        toast.error("Failed to save template");
      }
      return;
    }

    // Call Permission template — body + call_permission flag
    if (formData.marketing_type === "call_permission") {
      const payload = {
        waba_id: wabaId,
        template_name: formData.template_name,
        language: formData.language,
        category: formData.category,
        message_body: messageBody,
        header_text: "",
        footer_text: "",
        variable_examples: formData.variables_example,
        template_type: "call_permission",
        call_permission: true,
      };
      try {
        if (templateId) await updateTemplate({ id: templateId, data: payload }).unwrap();
        else await createTemplate(payload).unwrap();
        toast.success("Template saved successfully");
        router.push(`/templates/${wabaId}`);
      } catch {
        toast.error("Failed to save template");
      }
      return;
    }

    //  Carousel Product (JSON)
    if (formData.marketing_type === "carousel_product") {
      const payload = {
        waba_id: wabaId,
        template_name: formData.template_name,
        language: formData.language,
        category: "MARKETING",
        template_type: "carousel_product",
        message_body: messageBody,
        variable_examples: formData.variables_example?.[0] || undefined,
        carousel_cards: productCards.map((card) => ({
          components: [
            { type: "header", format: "product" },
            { type: "buttons", buttons: [{ type: "spm", text: card.button_text || "View" }] },
          ],
        })),
      };
      try {
        if (templateId) await updateTemplate({ id: templateId, data: payload }).unwrap();
        else await createTemplate(payload).unwrap();
        toast.success("Template saved successfully");
        router.push(`/templates/${wabaId}`);
      } catch {
        toast.error("Failed to save template");
      }
      return;
    }

    // Carousel Media (FormData)
    if (formData.marketing_type === "carousel_media") {
      const payload = new FormData();
      payload.append("waba_id", wabaId);
      payload.append("template_name", formData.template_name);
      payload.append("language", formData.language);
      payload.append("category", "MARKETING");
      payload.append("template_type", "carousel_media");
      payload.append("message_body", messageBody);
      if (formData.variables_example?.[0]) payload.append("variable_examples", JSON.stringify(formData.variables_example[0]));

      const cardsPayload = mediaCards.map((card) => ({
        components: [
          { type: "header", format: "image" },
          ...(card.body_text ? [{ type: "body", text: card.body_text }] : []),
          {
            type: "buttons",
            buttons: mediaButtonTemplates.map((tmpl) => {
              const val = card.buttonValues.find((v) => v.templateId === tmpl.id);
              if (tmpl.type === "url") return { type: "url", text: val?.text || "", url: val?.url || "" };
              return { type: "quick_reply", text: val?.text || "" };
            }),
          },
        ],
      }));
      payload.append("carousel_cards", JSON.stringify(cardsPayload));
      mediaCards.forEach((card) => {
        if (card.file) payload.append("card_media", card.file);
      });
      try {
        if (templateId) await updateTemplate({ id: templateId, data: payload }).unwrap();
        else await createTemplate(payload).unwrap();
        toast.success("Template saved successfully");
        router.push(`/templates/${wabaId}`);
      } catch {
        toast.error("Failed to save template");
      }
      return;
    }

    // Standard / LTO / Coupon Code
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
      payload.append("waba_id", wabaId);
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
    } else {
      payload = {
        waba_id: wabaId,
        template_name: formData.template_name,
        category: formData.category,
        language: formData.language,
        message_body: messageBody,
        header_text: formData.header_text || "",
        footer_text: formData.footer_text || "",
        buttons: cleanButtons,
        variables_example: formData.variables_example,
        is_limited_time_offer: isLimitedTimeOffer,
        offer_text: isLimitedTimeOffer ? formData.offer_text : undefined,
        has_expiration: isLimitedTimeOffer ? true : undefined,
      };
    }

    try {
      if (templateId) await updateTemplate({ id: templateId, data: payload }).unwrap();
      else await createTemplate(payload).unwrap();
      toast.success("Template saved successfully");
      router.push(`/templates/${wabaId}`);
    } catch {
      toast.error("Failed to save template");
    }
  };

  return {
    router,
    isCreating,
    isEditing,
    isAIModalOpen,
    setIsAIModalOpen,
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
    handleAISuccess,
    onSubmit,
    setEditor,
  };
};
