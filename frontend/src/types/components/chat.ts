/* eslint-disable @typescript-eslint/no-explicit-any */
export type MessageType = "text" | "image" | "video" | "audio" | "document" | "template" | "interactive" | "location" | "order" | "system_messages" | "reaction";

export interface InteractiveData {
  interactiveType: "button" | "list";
  buttons?: Array<{ id: string; title: string }>;
  list?: {
    header: string;
    body?: string;
    footer?: string;
    buttonTitle: string;
    sectionTitle: string;
    items: Array<{ id: string; title: string; description: string }>;
  };
}

export interface TemplateButton {
  type: "website" | "phone" | "quick_reply" | "copy_code" | "catalog" | "url" | "phone_call" | "spm";
  text: string;
  website_url?: string;
  phone_number?: string;
  url?: string;
  id?: string;
  media_url?: string;
}

export interface CarouselCard {
  components: Array<{
    type: string;
    format?: string;
    text?: string;
    buttons?: TemplateButton[];
  }>;
}

export interface TemplateData {
  _id: string;
  template_name: string;
  language: string;
  category: string;
  status: string;
  header: {
    format: "text" | "image" | "video" | "document" | "location";
    text?: string;
  } | null;
  message_body: string;
  body_variables?: any[];
  footer_text?: string | null;
  buttons?: TemplateButton[];
  meta_template_id: string;
  marketing_type?: string;
  offer_text?: string;
  is_limited_time_offer?: boolean;
  carousel_cards?: CarouselCard[];
  call_permission?: boolean;
}

export interface ChatParticipant {
  id: string;
  name: string;
  avatar: string | null;
}

export interface Reaction {
  emoji: string;
  users: ChatParticipant[];
}

export interface ChatMessage {
  id: string;
  wa_message_id?: string;
  content: string | null;
  interactiveData: InteractiveData | null;
  messageType: MessageType;
  fileUrl: string | null;
  template: TemplateData | null;
  createdAt: string;
  can_chat: boolean;
  delivered_at: string | null;
  delivery_status: "pending" | "sent" | "delivered" | "read" | "failed";
  is_delivered: boolean;
  is_seen: boolean;
  seen_at: string | null;
  wa_status: string | null;
  direction: "inbound" | "outbound";
  sender: ChatParticipant;
  recipient: ChatParticipant;
  reply_message?: ChatMessage | null;
  reaction_message_id?: string;
  reactions?: Reaction[];
}

export interface MessageGroup {
  senderId: string;
  sender: ChatParticipant;
  recipient: ChatParticipant;
  messages: ChatMessage[];
  createdAt: string;
  lastMessageTime: string;
}

export interface DateGroupedMessages {
  dateLabel: string;
  dateKey: string;
  messageGroups: MessageGroup[];
}

export interface GetMessagesResponse {
  success: boolean;
  messages: DateGroupedMessages[];
}

export interface SendMessagePayload {
  whatsapp_phone_number_id: string;
  contact_id: string;
  message?: string;
  type: MessageType;
  mediaUrls?: string[];
  messageType?: MessageType;
  interactiveType?: "button" | "list";
  replyMessageId?: string;
  buttonParams?: Array<{ id: string; title: string }>;
  listParams?: {
    header: string;
    body?: string;
    footer?: string;
    buttonTitle: string;
    sectionTitle: string;
    items: Array<{ id: string; title: string; description: string }>;
  };
  location?: {
    latitude: number;
    longitude: number;
    address: string;
    name: string;
  };
  reactionEmoji?: string;
  reactionMessageId?: string;
  provider?: string;
}

export interface ChatState {
  activeChatId: string | null;
  sidebarOpen: boolean;
  profileOpen: boolean;
}

export interface RecentChatResponseItem {
  contact: {
    id: string;
    number: string;
    name: string;
    avatar: string | null;
    labels: ContactLabel[];
    chat_status?: "open" | "resolved";
  };
  lastMessage: {
    id: string;
    wa_message_id?: string;
    content: string;
    messageType: string;
    createdAt: string;
    unreadCount: string;
  };
  is_pinned?: boolean;
}

export interface RecentChatData {
  data: RecentChatResponseItem[];
}

export interface SuggestReplyMessage {
  role: "customer" | "agent";
  content: string;
}

export interface SuggestReplyRequest {
  conversation: SuggestReplyMessage[] | null;
  tone: string;
}

export interface SuggestReplyResponse {
  success: boolean;
  data: {
    suggestedReplies: string[];
    count: number;
    modelId?: string;
    modelUsed?: string;
    tone?: string;
  };
}

export type AiTransformFeature = "translate" | "summarize" | "improve" | "formalize" | "casualize";

export interface AiTextTransformRequest {
  message: string;
  feature: AiTransformFeature;
  language?: string;
}

export interface AiTextTransformResponse {
  success: boolean;
  data: {
    original: string;
    transformed: string;
    feature: AiTransformFeature;
    language?: string;
    languageName?: string;
    modelUsed?: string;
    modelId?: string;
  };
}

export type ContactLabel = {
  label: string;
  color?: string;
  _id?: string;
};

export interface InteractiveMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "button" | "list";
  onSend: (payload: Partial<SendMessagePayload>) => Promise<void>;
}
