import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import enTranslations from './locales/en.json'
import esTranslations from './locales/es.json'
import frTranslations from './locales/fr.json'

// Get saved language from localStorage (safe for SSR)
const getSavedLanguage = (): string | null => {
  if (typeof window === 'undefined') {
    return null
  }
  try {
    const saved = localStorage.getItem('selected_language')
    return saved || null
  } catch {
    return null
  }
}

const savedLanguage = getSavedLanguage()

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: savedLanguage || undefined,
    resources: {
      en: {
        translations: enTranslations,
      },
      es: {
        translations: esTranslations,
      },
      fr: {
        translations: frTranslations,
      },
    },
    fallbackLng: 'en',
    debug: false,
    ns: ['translations'],
    defaultNS: 'translations',
    keySeparator: '.',
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n

