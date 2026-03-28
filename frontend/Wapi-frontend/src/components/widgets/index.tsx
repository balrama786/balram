/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useParams } from "next/navigation";
import { useGetWidgetByIdQuery, useGetWidgetByPhoneNoIdQuery } from "@/src/redux/api/widgetApi";
import { useState, useMemo, useCallback } from "react";
import { WidgetData, WidgetResponse } from "@/src/types/widget";
import WidgetWizardForm from "@/src/components/widgets/WidgetWizardForm";
import ChatbotPreview from "@/src/components/widgets/ChatbotPreview";
import CommonHeader from "@/src/shared/CommonHeader";
import { Loader2, Code2, Copy, Check, Eye } from "lucide-react";
import { Button } from "@/src/elements/ui/button";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/src/elements/ui/dialog";
import WidgetInfoBox from "./WidgetInfoBox";

const DEFAULTS: Partial<WidgetData> = {
  welcome_text: "Welcome to our support! \n\nThank you for reaching out to us on WhatsApp.",
  default_open_popup: false,
  default_user_message: "Hi, I need help !!",
  widget_position: "bottom-right",
  widget_color: "#059669",
  header_text: "Chat with us",
  header_text_color: "#ffffff",
  header_background_color: "#059669",
  body_background_color: "#f0faf6",
  welcome_text_color: "#1a2a2a",
  welcome_text_background: "#ffffff",
  start_chat_button_text: "Start Chat on WhatsApp",
  start_chat_button_background: "#059669",
  start_chat_button_text_color: "#ffffff",
};

function normalizeServerData(data: Partial<WidgetData> & { widget_image_url?: string }): Partial<WidgetData> {
  const result = { ...data };
  if (data.widget_image_url && !data.widget_image) {
    result.widget_image = data.widget_image_url;
  }
  return result;
}

function EmbedCodeButton({ code }: { code: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Script copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <Button variant="outline" onClick={() => setOpen((p) => !p)} className="h-10 gap-2 border-primary/30 text-primary hover:bg-primary/5 font-semibold">
        <Code2 size={16} />
        Embed Code
      </Button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 rtl:left-0! rtl:right-[unset] top-12 z-50 w-120 max-w-[90vw] bg-white dark:bg-(--card-color) rounded-lg border border-slate-200 dark:border-(--card-border-color) shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-(--card-border-color)">
              <div>
                <p className="font-bold text-sm text-slate-800 dark:text-white">Widget Embed Script</p>
                <p className="text-xs text-slate-400 mt-0.5">Paste before the closing &lt;/body&gt; tag</p>
              </div>
              <Button variant="ghost" size="sm" onClick={handleCopy} className="gap-1.5 text-primary hover:text-primary/80">
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
            <div className="p-4">
              <pre className="bg-slate-900 text-emerald-400 text-xs p-4 rounded-lg overflow-x-auto font-mono leading-relaxed whitespace-pre-wrap break-all border border-slate-800">{code}</pre>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const WidgetPage: React.FC<{ isStandalone?: boolean; existingId?: string }> = ({ isStandalone = false, existingId }) => {
  const params = useParams();
  const phoneNoId = (params.id as string) || "";

  const {
    data: widgetByIdResponse,
    isLoading: isByIdLoading,
    refetch: refetchById,
  } = useGetWidgetByIdQuery(existingId!, {
    skip: !existingId,
  });
  const {
    data: widgetByPhoneResponse,
    isLoading: isByPhoneLoading,
    refetch: refetchByPhone,
  } = useGetWidgetByPhoneNoIdQuery(phoneNoId, {
    skip: !!existingId || !phoneNoId,
  });

  const isLoading = isByIdLoading || isByPhoneLoading;
  const widgetResponse: WidgetResponse | undefined = existingId ? widgetByIdResponse : widgetByPhoneResponse;

  const [localOverrides, setLocalOverrides] = useState<Partial<WidgetData>>({});
  const [bodyBgImagePreview, setBodyBgImagePreview] = useState<string | null>(null);

  const serverData: WidgetData | undefined = widgetResponse?.data;

  const widgetData = useMemo<Partial<WidgetData>>(
    () => ({
      ...DEFAULTS,
      ...(serverData ? normalizeServerData(serverData) : {}),
      ...localOverrides,
      ...(existingId ? {} : !isStandalone ? { whatsapp_phone_number: phoneNoId } : {}),
    }),
    [existingId, serverData, localOverrides, isStandalone, phoneNoId]
  );

  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const resolvedBodyBgImagePreview = useMemo(() => {
    if (bodyBgImagePreview) return bodyBgImagePreview;
    if (serverData?.body_background_image) return serverData.body_background_image;
    return null;
  }, [bodyBgImagePreview, serverData?.body_background_image]);

  const handleUpdateField = useCallback((field: keyof WidgetData, value: any) => {
    setLocalOverrides((prev) => ({ ...prev, [field]: value }));
  }, []);

  const existingEmbedCode = serverData?.embed_code || serverData?.script_tag;

  if (isLoading) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-slate-400">Loading widget configuration...</p>
      </div>
    );
  }

  return (
    <div className="sm:p-8 p-4 space-y-6">
      <CommonHeader
        backBtn
        title="Chatbot Widget Configuration"
        description="Customize your WhatsApp chatbot widget and generate the integration script."
        rightContent={
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="xl:hidden h-10 gap-2 border-primary/30 text-primary hover:bg-primary/5 font-semibold">
                  <Eye size={16} />
                  Live Preview
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md p-0 overflow-hidden border-none bg-transparent shadow-none">
                <DialogHeader className="hidden">
                  <DialogTitle>Chatbot Preview</DialogTitle>
                </DialogHeader>
                <div className="p-4 flex items-center justify-center">
                  <ChatbotPreview data={widgetData} bodyBgImagePreview={resolvedBodyBgImagePreview} />
                </div>
              </DialogContent>
            </Dialog>
            {existingEmbedCode && <EmbedCodeButton code={existingEmbedCode} />}
          </div>
        }
      />

      <div className="flex flex-col xl:flex-row gap-6 flex-1">
        <div className="flex-1 min-w-0">
          <WidgetWizardForm
            data={widgetData}
            onChange={handleUpdateField}
            onSuccess={() => (existingId ? refetchById?.() : refetchByPhone?.())}
            existingId={serverData?._id || existingId}
            isStandalone={isStandalone}
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            onBodyBgImageChange={(url, _file) => setBodyBgImagePreview(url)}
          />
        </div>

        <div className="w-full xl:w-85 xl:flex-none">
          <div className="hidden xl:flex xl:flex-col xl:items-center xl:sticky xl:top-0 h-[calc(100vh-200px)] justify-end">
            <ChatbotPreview data={widgetData} bodyBgImagePreview={resolvedBodyBgImagePreview} />
          </div>
        </div>
      </div>

      <WidgetInfoBox />
    </div>
  );
};

export default WidgetPage;
