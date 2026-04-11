export interface ButtonData {
  text: string;
  link: string;
  _id?: string;
}

export interface FloatingImage {
  url: string;
  position: "left-top" | "right-top" | "left-bottom" | "right-bottom";
  _id?: string;
}

export interface HeroSection {
  badge: string;
  title: string;
  description: string;
  primary_button: ButtonData;
  hero_image: string;
  floating_images: FloatingImage[];
  _id?: string;
}

export interface FeatureItem {
  title: string;
  description: string;
  icon: string;
  image: string;
  _id?: string;
}

export interface FeaturesSection {
  badge: string;
  title: string;
  description: string;
  cta_button: ButtonData;
  features: FeatureItem[];
  _id?: string;
}

export interface PlatformItem {
  step: number;
  tagline: string;
  title: string;
  description: string;
  bullets: string[];
  image: string;
  _id?: string;
}

export interface PlatformSection {
  badge: string;
  title: string;
  items: PlatformItem[];
  _id?: string;
}

export interface PricingSection {
  title: string;
  badge: string;
  description: string;
  subscribed_count: string;
  subscribed_user?: string;
  plans: string[] | any[]; // string[] for IDs while updating, any[] for populated objects
  _id?: string;
}

export interface TestimonialsSection {
  title: string;
  badge: string;
  testimonials: string[] | any[];
  _id?: string;
}

export interface FaqSection {
  title: string;
  description?: string;
  badge: string;
  faqs: string[] | any[];
  _id?: string;
}

export interface ContactSection {
  title: string;
  subtitle: string;
  description?: string;
  form_enabled: boolean;
  phone_no: string;
  email: string;
  _id?: string;
}

export interface FooterSection {
  cta_title: string;
  cta_description: string;
  cta_buttons: ButtonData[];
  social_links: {
    twitter?: string;
    linkedin?: string;
    facebook?: string;
    instagram?: string;
    _id?: string;
  }[];
  copy_rights_text: string;
  _id?: string;
}

export interface LandingPageData {
  _id?: string;
  hero_section: HeroSection;
  features_section: FeaturesSection;
  platform_section?: PlatformSection;
  pricing_section: PricingSection;
  testimonials_section: TestimonialsSection;
  faq_section: FaqSection;
  contact_section: ContactSection;
  footer_section: FooterSection;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetLandingPageResponse {
  success: boolean;
  data: LandingPageData;
}

export interface UpdateLandingPageResponse {
  success: boolean;
  message: string;
  data: LandingPageData;
}

export interface UploadLandingImageResponse {
  success: boolean;
  message: string;
  imageUrl: string;
}
