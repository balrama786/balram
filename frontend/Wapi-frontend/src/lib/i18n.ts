import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enTranslation from "@/src/locales/en/translation.json";
import esTranslation from "@/src/locales/es/translation.json";

const resources = {
  en: { translation: enTranslation as Record<string, unknown> },
  es: { translation: esTranslation as Record<string, unknown> },
};

// Get saved language from localStorage (safe for SSR)
const getSavedLanguage = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const saved = localStorage.getItem("selected_language");
    return saved || null;
  } catch {
    return null;
  }
};

const savedLanguage = getSavedLanguage();

i18n.use(initReactI18next).init({
  resources,
  lng: savedLanguage || "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
