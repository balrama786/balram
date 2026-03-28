// Campaign wizard shared types — re-exported from src/types/campaign.ts
// This file is kept for backward compatibility with existing imports
export type {
  CampaignCard,
  TemplateCarouselCard,
  CarouselProduct,
} from "@/src/types/campaign";

export const CONTACT_SYSTEM_FIELDS = [
  { label: "Contact Name", value: "name" },
  { label: "Phone Number", value: "phone_number" },
  { label: "Email Address", value: "email" },
];
