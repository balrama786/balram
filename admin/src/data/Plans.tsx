export const numericFeatures = [
  { id: "contacts", label: "Contacts (0 = unlimited)", placeholder: "0 for unlimited" },
  { id: "template_bots", label: "Template Bots", placeholder: "0" },
  // { id: "message_bots", label: "Message Bots", placeholder: "0" },
  { id: "campaigns", label: "Campaigns", placeholder: "0" },
  // { id: "ai_prompts", label: "AI Prompts", placeholder: "0" },
  { id: "staff", label: "Agent (default: 1)", placeholder: "1" },
  // { id: "conversations", label: "Conversations (0 = unlimited)", placeholder: "0 for unlimited" },
  { id: "bot_flow", label: "Bot Flow", placeholder: "0" },
  { id: "custom_fields", label: "Custom Fields", placeholder: "0" },
  { id: "tags", label: "Tags", placeholder: "0" },
];

export const booleanFeatures = [
  {
    id: "rest_api",
    label: "Rest API",
    description: "Rest API (WA QR)",
    icon: <span className="text-(--text-green-primary) font-bold text-sm">☁️</span>,
  },
  {
    id: "whatsapp_webhook",
    label: "WhatsApp Webhook",
    description: "WhatsApp webhook support",
    icon: <span className="text-(--text-green-primary) font-bold text-sm">🔥</span>,
  },
  {
    id: "auto_replies",
    label: "Auto Replies",
    description: "Enable automatic responses",
    icon: <span className="text-(--text-green-primary) font-bold text-sm">🤖</span>,
  },
  {
    id: "analytics",
    label: "Analytics",
    description: "Enable analytics dashboard",
    icon: <span className="text-(--text-green-primary) font-bold text-sm">📊</span>,
  },
  {
    id: "priority_support",
    label: "Priority Support",
    description: "Get priority customer support",
    icon: <span className="text-(--text-green-primary) font-bold text-sm">⭐</span>,
  },
];
