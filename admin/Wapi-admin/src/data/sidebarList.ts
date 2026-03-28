import { Award, CreditCard, Diamond, FileText, Globe, HandCoins, HelpCircle, Home, LayoutDashboard, LayoutTemplate, Link, MailWarning, Receipt, Settings, ShoppingCart, Sparkles, ThumbsUp, Users } from "lucide-react";

export interface MenuItem {
  icon: string;
  label: string;
  path?: string;
  hasSubmenu?: boolean;
  submenu?: SubMenuItem[];
}

export interface SubMenuItem {
  label: string;
  path: string;
}

export interface MenuSection {
  title: string;
  items: MenuItem[];
}

export const sidebarMenuData: MenuSection[] = [
  {
    title: "nav.main_navigation",
    items: [
      {
        icon: "LayoutDashboard",
        label: "nav.dashboard",
        path: "/dashboard",
      },
      {
        icon: "CreditCard",
        label: "nav.manage_plan",
        path: "/manage_plans",
      },
      {
        icon: "Award",
        label: "nav.subscription_plans",
        path: "/subscription_plans",
      },
      {
        icon: "Receipt",
        label: "nav.payments_transaction",
        path: "/payment_transactions",
      },
      {
        icon: "Users",
        label: "nav.manage_user",
        path: "/manage_users",
        hasSubmenu: true,
        submenu: [
          { label: "nav.all_users", path: "/manage_users" },
          { label: "nav.add_user", path: "/manage_users/add" },
        ],
      },
      {
        icon: "Link",
        label: "nav.link_generator",
        path: "/users_links",
      },
    ],
  },
  {
    title: "nav.content_management",
    items: [
      {
        icon: "HelpCircle",
        label: "nav.faq",
        path: "/manage_faqs",
      },
      {
        icon: "ThumbsUp",
        label: "nav.testimonial",
        path: "/manage_testimonials",
      },
      {
        icon: "Globe",
        label: "nav.landing_page",
        path: "/manage_landing",
      },
      {
        icon: "LayoutTemplate",
        label: "nav.templates",
        path: "/templates_library",
      },
    ],
  },
  {
    title: "nav.system_settings",
    items: [
      {
        icon: "HandCoins",
        label: "nav.payment_gateway",
        path: "/payment_gateways",
      },
      {
        icon: "Settings",
        label: "nav.setting",
        path: "/settings",
      },
      {
        icon: "Sparkles",
        label: "nav.ai_models",
        path: "/ai_models",
      },
      {
        icon: "MailWarning",
        label: "nav.contact_inquiries",
        path: "/contact_inquiries",
      },
    ],
  },
];

// Icon mapping helper
export const iconMap = {
  Home,
  LayoutDashboard,
  CreditCard,
  Users,
  ShoppingCart,
  Diamond,
  HelpCircle,
  FileText,
  ThumbsUp,
  Settings,
  Receipt,
  Globe,
  Sparkles,
  HandCoins,
  MailWarning,
  LayoutTemplate,
  Award,
  Link
};
