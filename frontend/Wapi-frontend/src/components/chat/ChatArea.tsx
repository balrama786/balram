/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/src/elements/ui/button";
import { Textarea } from "@/src/elements/ui/textarea";
import { cn } from "@/src/lib/utils";
import { useGetMessagesQuery, useSendMessageMutation, useUpdateChatStatusMutation } from "@/src/redux/api/chatApi";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { clearReplyToMessage, selSelectPhoneNumber, setIsMobileScreen, setLeftSidebartoggle, setProfileToggle, updateSelectedChatStatus } from "@/src/redux/reducers/messenger/chatSlice";
import { openPreview } from "@/src/redux/reducers/previewSlice";
import { RootState } from "@/src/redux/store";
import { Attachment } from "@/src/types/components";
import { SendMessagePayload, SuggestReplyMessage } from "@/src/types/components/chat";
import { getInitials } from "@/src/utils";
import { maskSensitiveData } from "@/src/utils/masking";
import { BotMessageSquare, CheckCircle2, ChevronLeft, FileText, Filter, Image as ImageIcon, LayoutTemplate, Loader2, Mic, MoreVertical, Search, Send, Sparkles, Video, X } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import AiTextTransformModal from "../feature/chat/AiTextTransformModal";
import SuggestReplyModal from "../feature/chat/SuggestReplyModal";
import AudioRecorder from "./AudioRecorder";
import ChatAttachmentMenu from "./ChatAttachmentMenu";
import EmojiPicker from "./EmojiPicker";
import ExpiredWindowBanner from "./ExpiredWindowBanner";
import InteractiveMessageModal from "./InteractiveMessageModal";
import MediaSelectionModal from "./MediaSelectionModal";
import MessageDateFilterModal from "./MessageDateFilterModal";
import ChatMessageList from "./messages/ChatMessageList";
import MessageSearchOverlay from "./MessageSearchOverlay";
import ResolvedChatBanner from "./ResolvedChatBanner";
import WhatsAppTimer from "./WhatsAppTimer";

const LocationPickerModal = dynamic(() => import("./LocationPickerModal"), {
  ssr: false,
});

interface ChatAreaProps {
  contactId?: string;
  phoneNumberId?: string;
  contactName?: string;
  contactNumber?: string;
  contactAvatar?: string;
  isModal?: boolean;
}

const ChatArea: React.FC<ChatAreaProps> = ({ contactId, phoneNumberId, contactName, contactNumber, contactAvatar, isModal = false }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const { is_demo_mode } = useAppSelector((state) => state.setting);
  const isAgent = user?.role === "agent";
  const { selectedChat, selectedPhoneNumberId, isMobileScreen, replyToMessage } = useAppSelector((state: RootState) => state.chat);
  const { selectedWorkspace } = useAppSelector((state) => state.workspace);
  const isBaileys = selectedWorkspace?.waba_type === "baileys";

  const currentContactId = contactId || selectedChat?.contact.id;
  const currentPhoneNumberId = phoneNumberId || selectedPhoneNumberId;
  const currentContactName = contactName || selectedChat?.contact.name;
  const currentContactNumber = contactNumber || selectedChat?.contact.number;
  const currentContactAvatar = contactAvatar || selectedChat?.contact.avatar;

  const { allow_media_send, app_name } = useAppSelector((state: RootState) => state.setting);

  const [messageText, setMessageText] = useState("");
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<Attachment[]>([]);
  const scrollListRef = useRef<{ scrollToTop: () => void; scrollToBottom: () => void }>(null);
  const [isSuggestReplyModalOpen, setIsSuggestReplyModalOpen] = useState(false);
  const [isAiTransformModalOpen, setIsAiTransformModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isWindowExpired, setIsWindowExpired] = useState(false);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);
  const [isInteractiveModalOpen, setIsInteractiveModalOpen] = useState(false);
  const [isAudioRecording, setIsAudioRecording] = useState(false);
  const [interactiveType, setInteractiveType] = useState<"button" | "list">("button");
  const [dateFilters, setDateFilters] = useState<{ startDate?: string; endDate?: string }>({});
  const activeFilterCount = Object.keys(dateFilters).length;

  const { data: messagesData, isLoading } = useGetMessagesQuery(
    {
      contact_id: currentContactId,
      whatsapp_phone_number_id: currentPhoneNumberId || undefined,
      start_date: dateFilters.startDate,
      end_date: dateFilters.endDate,
    },
    { skip: !currentContactId || !currentPhoneNumberId }
  );

  const lastInboundTime = (() => {
    if (!messagesData?.messages) return null;
    const allInbound = messagesData.messages
      .flatMap((dg) => dg.messageGroups)
      .flatMap((mg) => mg.messages)
      .filter((m) => m.direction === "inbound");

    if (allInbound.length === 0) return null;
    return allInbound.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0].createdAt;
  })();

  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
  const [updateStatus, { isLoading: isStatusUpdating }] = useUpdateChatStatusMutation();

  const handleToggleStatus = async () => {
    if (!selectedChat || !selectedPhoneNumberId) return;
    const newStatus = selectedChat.contact.chat_status === "open" ? "resolved" : "open";
    try {
      await updateStatus({
        contact_id: currentContactId!,
        whatsapp_phone_number_id: currentPhoneNumberId!,
        status: newStatus,
      }).unwrap();
      dispatch(updateSelectedChatStatus(newStatus));
      toast.success(`Chat marked as ${newStatus}`);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update chat status");
    }
  };

  const handleImageClick = (url: string, isFromInput = false) => {
    let allImages: string[] = [];

    if (isFromInput) {
      allImages = selectedMedia.filter((m) => m.mimeType.startsWith("image/")).map((m) => m.fileUrl);
    } else {
      allImages = messagesData?.messages.flatMap((dateGroup) => dateGroup.messageGroups.flatMap((group) => group.messages.filter((m) => m.messageType === "image").map((m) => m.fileUrl!))) || [];
    }

    const index = allImages.indexOf(url);
    dispatch(openPreview({ images: allImages, index: index >= 0 ? index : 0 }));
  };

  const handleSend = async () => {
    if ((!messageText.trim() && selectedMedia.length === 0) || !selectedChat || !selectedPhoneNumberId) return;
    try {
      const payload: SendMessagePayload = {
        whatsapp_phone_number_id: currentPhoneNumberId!,
        contact_id: currentContactId!,
        message: messageText,
        type: "text",
        messageType: "text",
        replyMessageId: replyToMessage?.wa_message_id,
        provider: "business_api",
      } as SendMessagePayload;

      if (selectedMedia.length > 0) {
        payload.mediaUrls = selectedMedia.map((media) => media.fileUrl);
      } else {
        payload.type = "text";
      }

      if (selectedMedia.length === 1) {
        const firstMedia = selectedMedia[0];
        payload.messageType = firstMedia.mimeType.startsWith("image/") ? "image" : firstMedia.mimeType.startsWith("video/") ? "video" : "document";
        payload.type = payload.messageType;
      }

      await sendMessage(payload).unwrap();
      setMessageText("");
      setSelectedMedia([]);
      dispatch(clearReplyToMessage());
    } catch (error: any) {
      toast.error(error?.message || "Failed to send message");
    }
  };

  const handleAudioSend = async (blob: Blob) => {
    if (!selectedChat || !selectedPhoneNumberId) return;
    try {
      const formData = new FormData();
      formData.append("file_url", blob, "audio_message.ogg");
      formData.append("contact_id", currentContactId!);
      formData.append("whatsapp_phone_number_id", currentPhoneNumberId!);
      formData.append("type", "audio");
      formData.append("messageType", "audio");
      formData.append("message", "");
      if (replyToMessage?.wa_message_id) {
        formData.append("replyMessageId", replyToMessage.wa_message_id);
      }

      await sendMessage(formData).unwrap();
      dispatch(clearReplyToMessage());
      setIsAudioRecording(false);
      toast.success("Audio message sent");
    } catch (error: any) {
      toast.error(error?.data?.error || error?.message || "Failed to send audio message");
    }
  };

  const handleLocationSend = async (location: { latitude: number; longitude: number; address?: string }) => {
    if (!selectedChat || !selectedPhoneNumberId) return;

    try {
      const payload: SendMessagePayload = {
        whatsapp_phone_number_id: currentPhoneNumberId!,
        contact_id: currentContactId!,
        type: "location",
        messageType: "location",
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
          address: location.address || "Location",
          name: location.address || "Location",
        },
        replyMessageId: replyToMessage?.wa_message_id,
      };

      await sendMessage(payload).unwrap();
      dispatch(clearReplyToMessage());
      toast.success("Location shared successfully");
    } catch (error: any) {
      toast.error(error?.message || "Failed to share location");
    }
  };

  const handleInteractiveClick = (type: "button" | "list") => {
    setInteractiveType(type);
    setIsInteractiveModalOpen(true);
  };

  const handleInteractiveSend = async (interactivePayload: Partial<SendMessagePayload>) => {
    if (!selectedChat || !selectedPhoneNumberId) return;

    try {
      const payload: SendMessagePayload = {
        whatsapp_phone_number_id: currentPhoneNumberId!,
        contact_id: currentContactId!,
        type: "interactive",
        messageType: "interactive",
        replyMessageId: replyToMessage?.wa_message_id,
        ...interactivePayload,
      } as SendMessagePayload;

      await sendMessage(payload).unwrap();
      dispatch(clearReplyToMessage());
    } catch (error: any) {
      toast.error(error?.message || "Failed to send interactive message");
    }
  };

  const handleFileSelect = (file: File) => {
    console.log("File selected:", file);
  };

  const handleMediaSelect = (media: Attachment[]) => {
    setSelectedMedia((prev) => {
      const existingIds = new Set(prev.map((m) => m._id));
      const newMedia = media.filter((m) => !existingIds.has(m._id));
      return [...prev, ...newMedia];
    });
  };

  const removeMedia = (id: string) => {
    setSelectedMedia((prev) => prev.filter((m) => m._id !== id));
  };

  const addEmoji = (emoji: string) => {
    setMessageText((prev) => prev + emoji);
  };

  const onToggleProfile = () => {
    dispatch(setProfileToggle());
  };

  const getChatContextMessages = (): SuggestReplyMessage[] | null => {
    if (!messagesData?.messages) return null;

    const allMessages = messagesData.messages.flatMap((dg) => dg.messageGroups.flatMap((mg) => mg.messages.filter((m) => m.messageType === "text")));

    if (allMessages.length === 0) return null;

    return allMessages.slice(-10).map((m) => ({
      role: m.direction === "inbound" ? "customer" : "agent",
      content: m.content || "",
    }));
  };

  const handleUseReply = (reply: string) => {
    setMessageText(reply);
  };

  const handleTransformSuccess = (transformedText: string) => {
    setMessageText(transformedText);
  };

  const handleSidebar = () => {
    dispatch(
      setLeftSidebartoggle({
        isMobile: window.innerWidth <= 991,
      })
    );
  };

  useEffect(() => {
    if (lastInboundTime) {
      const now = new Date();
      const expiry = new Date(new Date(lastInboundTime).getTime() + 24 * 60 * 60 * 1000);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsWindowExpired(now > expiry);
    } else {
      setIsWindowExpired(false);
    }
  }, [lastInboundTime]);

  useEffect(() => {
    const updateScreen = () => {
      dispatch(setIsMobileScreen(window.innerWidth <= 991));
    };

    updateScreen();
    window.addEventListener("resize", updateScreen);
    return () => window.removeEventListener("resize", updateScreen);
  }, [dispatch]);

  const handleMessageSelect = (messageId: string) => {
    const messageElement = document.getElementById(`message-${messageId}`);
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: "smooth", block: "center" });
      messageElement.classList.add("bg-primary/10", "dark:bg-primary/30", "transition-colors", "duration-500", "py-5");
      setTimeout(() => {
        messageElement.classList.remove("bg-primary/10", "dark:bg-primary/30", "transition-colors", "duration-500", "py-5");
      }, 2000);
    } else {
      toast.error("Message not found in current view");
    }
  };

  const handleGoToFullChat = () => {
    if (currentPhoneNumberId) {
      dispatch(selSelectPhoneNumber({ id: currentPhoneNumberId, skipClearChat: true }));
    }
    router.push(`/chat?contact_id=${currentContactId}`);
  };

  if (!currentContactId) return null;

  return (
    <div className={cn("relative flex-1 flex flex-col h-full dark:bg-(--card-color) text-slate-900 dark:text-white bg-white border dark:border-(--card-border-color) rounded-t-none rounded-lg border-gray-100", !isModal && "max-w-[calc(100vw-364px)] [@media(max-width:991px)]:max-w-full")}>
      <div className="h-14 whitespace-nowrap flex-wrap [@media(min-width:768px)_and_(max-width:817px)]:h-30  dark:bg-(--card-color) [@media(max-width:430px)]:flex-wrap [@media(max-width:553px)]:h-35 [@media(max-width:430px)]:h-25 [@media(max-width:430px)]:gap-3 [@media(max-width:430px)]:p-2 [@media(max-width:452px)]:h-25 rounded-t-lg border-b border-gray-200 dark:border-(--card-border-color) flex items-center justify-between sm:px-4 px-2 sticky top-0 z-10 cursor-pointer">
        {isMobileScreen && (
          <div onClick={handleSidebar} className="cursor-pointer">
            <ChevronLeft size={20} />
          </div>
        )}
        <div className="flex items-center gap-3 contact-info [@media(max-width:991px)]:mr-auto" onClick={() => !isModal && onToggleProfile()}>
          <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold overflow-hidden">{currentContactAvatar ? <Image src={currentContactAvatar} alt={currentContactName || ""} width={40} height={40} className="object-cover" unoptimized /> : getInitials(app_name || "")}</div>
          <div>
            <h3 className="font-semibold text-sm truncate  [@media(max-width:390px)]:max-w-16.5">{isAgent && user?.is_phoneno_hide ? "Customer" : maskSensitiveData(currentContactNumber, "phone", is_demo_mode)}</h3>
          </div>
        </div>
        <div className="flex items-center sm:gap-1 gap-0 [@media(max-width:430px)]:ml-auto rtl:[@media(max-width:430px)]:ml-0 rtl:[@media(max-width:430px)]:mr-auto [@media(max-width:430px)]:flex-wrap">
          {lastInboundTime && !isBaileys && (
            <div className="mr-2">
              <WhatsAppTimer key={currentContactId} lastInboundTime={lastInboundTime} onExpire={() => setIsWindowExpired(true)} />
            </div>
          )}
          {isModal && (
            <Button variant="ghost" size="icon" onClick={handleGoToFullChat} className="text-slate-600 hover:text-primary dark:hover:text-primary dark:text-white" title="Go to Full Chat">
              <ChevronLeft className="rotate-180" size={20} />
            </Button>
          )}

          <Button variant="ghost" size="sm" onClick={handleToggleStatus} disabled={isStatusUpdating} className={cn("flex items-center gap-1.5 h-9 px-3 rounded-lg transition-all font-bold text-[12px] tracking-wider", selectedChat?.contact?.chat_status === "resolved" ? "border border-primary/20 bg-primary/10 text-primary hover:text-primary/70 hover:bg-primary20 dark:bg-emerald-500/20 dark:text-primary" : "border border-slate-300 bg-slate-100 text-slate-600 dark:border-(--card-border-color) hover:bg-slate-200 dark:bg-(--page-body-bg) dark:text-gray-400 hover:text-primary")}>
            {isStatusUpdating ? <Loader2 size={14} className="animate-spin" /> : selectedChat?.contact?.chat_status === "open" ? <Sparkles size={14} /> : <CheckCircle2 size={14} />}
            {selectedChat?.contact?.chat_status === "open" ? "Resolve" : "Reopen"}
          </Button>
          {!isAgent && !isBaileys && (
            <Button variant="ghost" size="icon" onClick={() => router.push(`/campaigns/create?contact_id=${currentContactId}&redirect_to=${isModal ? "/contacts" : "/chat"}`)} className="text-slate-600 dark:hover:bg-(--table-hover) dark:text-white hover:text-primary dark:hover:text-primary" title="Send Template">
              <LayoutTemplate size={20} />
            </Button>
          )}
          {!isModal && (
            <>
              <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(!isSearchOpen)} className={isSearchOpen ? "text-emerald-500 bg-emerald-50 dark:bg-(--card-color) dark:hover:bg-(--table-hover) " : "text-slate-600 hover:text-primary dark:hover:text-primary dark:text-white"}>
                <Search size={20} />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setIsDateFilterOpen(true)} className={`relative ${activeFilterCount > 0 ? "text-primary bg-emerald-50 dark:bg-(--dark-sidebar) dark:hover:bg-(--table-hover)" : "text-slate-600 hover:text-primary dark:hover:text-primary dark:text-white"}`}>
                <Filter size={20} />
                {activeFilterCount > 0 && <span className="absolute top-2 right-2 h-2 w-2 bg-primary rounded-full" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={onToggleProfile}>
                <MoreVertical size={20} className="text-slate-600 dark:text-white hover:text-primary dark:hover:text-primary" />
              </Button>
            </>
          )}
        </div>
      </div>

      {currentContactId && currentPhoneNumberId && !isModal && <MessageSearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} contactId={currentContactId} phoneNumberId={currentPhoneNumberId} onMessageSelect={handleMessageSelect} />}

      <div className="flex-1 overflow-hidden flex flex-col relative">
        <div className="absolute inset-0 z-0 opacity-[.4] pointer-events-none grayscale bg-[url('/assets/images/1.png')] bg-cover bg-center bg-no-repeat" />
        <div className="flex-1 relative z-10 flex flex-col min-h-0 pt-2">
          <ChatMessageList ref={scrollListRef} data={messagesData} isLoading={isLoading} onImageClick={(url) => handleImageClick(url, false)} />
        </div>
      </div>

      {selectedMedia.length > 0 && (
        <div className="relative p-3 bg-slate-50 dark:bg-(--table-hover) border-t border-gray-200 dark:border-(--card-border-color)">
          <div className="flex justify-between pb-2">
            <div className="flex flex-col justify-center">
              <span className="text-xs font-semibold text-primary bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-100 dark:border-emerald-500/20">{selectedMedia.length} files selected</span>
            </div>
            <button onClick={() => setSelectedMedia([])} className="absolute top-2 right-2 text-slate-400 hover:text-rose-500 transition-colors">
              <X size={18} />
            </button>
          </div>
          <div className="flex flex-wrap gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
            {selectedMedia.map((media) => (
              <div key={media._id} className="relative group w-20 h-20 border border-slate-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 shadow-sm cursor-pointer" onClick={() => media.mimeType.startsWith("image/") && handleImageClick(media.fileUrl, true)}>
                {media.mimeType.startsWith("image/") ? (
                  <>
                    <Image src={media.fileUrl} alt={media.fileName} width={80} height={80} className="w-full h-full rounded-lg object-cover transition-transform group-hover:scale-110" unoptimized />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity flex items-center justify-center">
                      <Search size={16} className="text-white scale-75 group-hover:scale-100 transition-transform duration-300" />
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-1 text-center">
                    <span className="text-2xl mb-1">📄</span>
                    <span className="text-[10px] text-slate-500 truncate w-full px-1">{media.fileName}</span>
                  </div>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeMedia(media._id);
                  }}
                  className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10 hover:bg-rose-600"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedChat?.contact?.chat_status === "resolved" ? (
        <ResolvedChatBanner contactId={currentContactId!} phoneNumberId={currentPhoneNumberId!} />
      ) : (!isWindowExpired || isBaileys) && (lastInboundTime || isBaileys) ? (
        <div className="relative border-t border-gray-200 dark:border-(--card-border-color) rounded-b-lg overflow-hidden">
          {replyToMessage && (
            <div className="mx-2 mt-2 p-2 bg-slate-100 dark:bg-(--page-body-bg) border-l-4 border-primary rounded-r-lg flex justify-between items-start animate-in slide-in-from-bottom-1 duration-200">
              <div className="flex-1 min-w-0 pr-2">
                <div className="text-[10px] font-bold text-primary uppercase mb-0.5 flex items-center gap-1.5">
                  {replyToMessage.messageType === "image" && <ImageIcon size={10} />}
                  {replyToMessage.messageType === "video" && <Video size={10} />}
                  {replyToMessage.messageType === "audio" && <Mic size={10} />}
                  {replyToMessage.messageType === "document" && <FileText size={10} />}
                  Replying to {replyToMessage.messageType}
                </div>
                <div className="text-[13px] text-slate-600 dark:text-gray-400 break-all mt-2">{replyToMessage.content}</div>
              </div>
              <button onClick={() => dispatch(clearReplyToMessage())} className="text-slate-400 hover:text-rose-500 transition-colors">
                <X size={16} />
              </button>
            </div>
          )}
          {isAudioRecording ? (
            <div className="w-full bg-white dark:bg-(--card-color)">
              <AudioRecorder onSend={handleAudioSend} onCancel={() => setIsAudioRecording(false)} />
            </div>
          ) : (
            <div className="relative flex items-center gap-3 p-2 dark:bg-(--card-color) [@media(max-width:535px)]:flex-col group">
              <div className="flex items-center gap-2 pl-2 [@media(max-width:535px)]:mr-auto rtl:[@media(max-width:535px)]:mr-0 rtl:[@media(max-width:535px)]:ml-auto">
                <EmojiPicker onEmojiSelect={addEmoji} />

                <Button variant="ghost" size="icon" onClick={() => setIsSuggestReplyModalOpen(true)} className="text-slate-500 hover:text-primary bg-gray-100 rounded-lg dark:bg-(--page-body-bg) dark:hover:bg-(--table-hover) dark:text-gray-400 hover:bg-emerald-100/40 transition-colors">
                  <BotMessageSquare size={22} />
                </Button>

                {allow_media_send && <ChatAttachmentMenu isBaileys={isBaileys} onFileSelect={handleFileSelect} onMediaLibraryOpen={() => setIsMediaModalOpen(true)} onLocationClick={() => setIsLocationModalOpen(true)} onInteractiveClick={handleInteractiveClick} onAudioClick={() => setIsAudioRecording(true)} />}
              </div>

              {/* Input Center */}
              <div className="flex-1 relative flex items-center gap-2 bg-slate-50/50 dark:bg-(--card-color) [@media(max-width:535px)]:w-[85%] [@media(max-width:380px)]:w-[70%] [@media(max-width:535px)]:mr-auto rtl:[@media(max-width:535px)]:ml-auto rtl:[@media(max-width:535px)]:mr-0 rounded-lg dark:border-(--card-border-color) transition-all">
                <Textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  disabled={isLoading}
                  placeholder={isLoading ? "Loading messages..." : "Type a message..."}
                  className="custom-scrollbar whitespace-break-spaces break-all flex-1 min-h-10 max-h-30 py-2.5 px-4 bg-(--input-color) text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm font-medium resize-none overflow-y-auto"
                />

                {messageText.trim() && (
                  <button onClick={() => setIsAiTransformModalOpen(true)} className="p-1.5 rounded-lg text-primary hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-(--table-hover) dark:bg-(--dark-sidebar) transition-all group" title="AI Text Transform">
                    <Sparkles size={18} className="group-hover:animate-pulse" />
                  </button>
                )}
              </div>

              <div className="pr-1 [@media(max-width:535px)]:absolute [@media(max-width:535px)]:right-2.5 [@media(max-width:535px)]:bottom-2">
                <Button onClick={handleSend} disabled={(!messageText.trim() && selectedMedia.length === 0) || isSending || isLoading} className={cn("h-10 w-10 rounded-lg flex items-center justify-center transition-all duration-300", messageText.trim() || selectedMedia.length > 0 ? "bg-primary text-white shadow-emerald-500/20" : "bg-slate-100 dark:bg-primary dark:text-gray-300 text-slate-400")}>
                  {isSending || isLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <ExpiredWindowBanner contactId={currentContactId!} isAgent={isAgent} isNew={!lastInboundTime} />
      )}

      <MediaSelectionModal isOpen={isMediaModalOpen} onClose={() => setIsMediaModalOpen(false)} onSelect={handleMediaSelect} />
      <SuggestReplyModal isOpen={isSuggestReplyModalOpen} onClose={() => setIsSuggestReplyModalOpen(false)} lastMessages={getChatContextMessages()} onUseReply={handleUseReply} />
      <AiTextTransformModal isOpen={isAiTransformModalOpen} onClose={() => setIsAiTransformModalOpen(false)} message={messageText} onSuccess={handleTransformSuccess} />
      <LocationPickerModal isOpen={isLocationModalOpen} onClose={() => setIsLocationModalOpen(false)} onSend={handleLocationSend} />
      <InteractiveMessageModal isOpen={isInteractiveModalOpen} onClose={() => setIsInteractiveModalOpen(false)} type={interactiveType} onSend={handleInteractiveSend} />
      <MessageDateFilterModal isOpen={isDateFilterOpen} onClose={() => setIsDateFilterOpen(false)} onApply={setDateFilters} initialFilters={dateFilters} />
    </div>
  );
};

export default ChatArea;
