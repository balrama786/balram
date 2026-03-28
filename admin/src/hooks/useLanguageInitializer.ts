'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const LANGUAGE_STORAGE_KEY = 'selected_language'

export const useLanguageInitializer = () => {
  const { i18n } = useTranslation()
  const [isLanguageReady, setIsLanguageReady] = useState(false)

  useEffect(() => {
    const initializeLanguage = async () => {
      const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY)

      if (savedLanguage && savedLanguage !== 'en') {
        // Check if translation is already loaded (they should be preloaded in i18n/index.ts)
        if (i18n.hasResourceBundle(savedLanguage, 'translations')) {
          // Language already loaded, just switch to it
          await i18n.changeLanguage(savedLanguage)
          await i18n.reloadResources(savedLanguage, 'translations')
        }
      } else if (!savedLanguage) {
        // No saved language, ensure it's set to 'en' or default
        const currentLang = i18n.resolvedLanguage || i18n.language || 'en'
        if (currentLang !== 'en') {
          await i18n.changeLanguage('en')
        }
      }

      setIsLanguageReady(true)
    }

    initializeLanguage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return isLanguageReady
}

