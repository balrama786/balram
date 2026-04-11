import { Award, ShieldCheck, CreditCard, Currency, Diamond, DiamondPlus, FileText, Form, Globe, HandCoins, HelpCircle, Home, Languages, LayoutDashboard, LayoutTemplate, Link, MailWarning, Receipt, Settings, ShoppingCart, Sparkles, ThumbsUp, Users } from "lucide-react";

export interface MenuItem {
  icon: string;
  label: string;
  path?: string;
  hasSubmenu?: boolean;
  submenu?: SubMenuItem[];
  permission?: string;
}

export interface SubMenuItem {
  label: string;
  path: string;
  permission?: string;
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
        permission: "view.admindashboard",
      },
      {
        icon: "Award",
        label: "nav.subscription",
        path: "/manage_plans",
        hasSubmenu: true,
        permission: "view.plans",
        submenu: [
          { label: "nav.manage_plan", path: "/manage_plans", permission: "view.plans" },
          { label: "nav.subscription_plans", path: "/subscriber_plans", permission: "view.plans" },
          { label: "nav.add_subscription", path: "/manage_plans/add", permission: "create.plans" },
        ],
      },
      {
        icon: "Receipt",
        label: "nav.payments_transaction",
        path: "/payment_transactions",
        permission: "view.payments",
      },
      {
        icon: "Users",
        label: "nav.manage_user",
        path: "/manage_users",
        hasSubmenu: true,
        permission: "view.users",
        submenu: [
          { label: "nav.all_users", path: "/manage_users", permission: "view.users" },
          { label: "nav.add_user", path: "/manage_users/add", permission: "create.users" },
        ],
      },
      {
        icon: "Link",
        label: "nav.link_generator",
        path: "/users_short_links",
        permission: "view.short_links",
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
        permission: "view.faqs",
      },
      {
        icon: "ThumbsUp",
        label: "nav.testimonial",
        path: "/manage_testimonials",
        permission: "view.testimonials",
      },
      {
        icon: "FileText",
        label: "nav.pages",
        path: "/manage_pages",
        permission: "view.pages",
      },
      {
        icon: "ShieldCheck",
        label: "nav.roles_permission",
        path: "/roles",
        permission: "view.roles",
      },
      {
        icon: "Globe",
        label: "nav.landing_page",
        path: "/manage_landing",
        permission: "update.landing_page",
      },
      {
        icon: "LayoutTemplate",
        label: "nav.templates",
        path: "/templates_library",
        permission: "view.admin_templates",
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
        permission: "view.payment_gateways",
      },
      {
        icon: "Settings",
        label: "nav.setting",
        path: "/settings",
        permission: "view.settings",
      },
      {
        icon: "Sparkles",
        label: "nav.ai_models",
        path: "/ai_models",
        permission: "view.ai_models",
      },
      {
        icon: "Languages",
        label: "nav.language",
        path: "/languages",
        permission: "view.languages",
      },
      {
        icon: "Currency",
        label: "nav.currencies",
        path: "/currencies",
        permission: "view.currencies",
      },
      {
        icon: "DiamondPlus",
        label: "nav.taxes",
        path: "/taxes",
        permission: "view.taxes",
      },
      {
        icon: "MailWarning",
        label: "nav.contact_inquiries",
        path: "/contact_inquiries",
        permission: "view.contact_inquiries",
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
  Link,
  Languages,
  Currency,
  Form,
  DiamondPlus,
  ShieldCheck,
};
