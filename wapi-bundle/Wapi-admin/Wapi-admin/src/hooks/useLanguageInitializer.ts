'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch } from '../redux/hooks'
import { setRTL } from '../redux/reducers/layoutSlice'
import { languageApi } from '../redux/api/languageApi'
import { loadTranslations } from '../utils/i18n-loader'

const LANGUAGE_STORAGE_KEY = 'selected_language'

export const useLanguageInitializer = () => {
  const { i18n } = useTranslation()
  const dispatch = useAppDispatch()
  const [isLanguageReady, setIsLanguageReady] = useState(false)

  // Use the initiate method from languageApi to fetch data in a hook-like way
  // but we'll do it inside useEffect to have more control over the flow
  const [getAllLanguages] = languageApi.useLazyGetAllLanguagesQuery()
  const [getTranslations] = languageApi.useLazyGetTranslationsQuery()

  useEffect(() => {
    const initializeLanguage = async () => {
      try {
        const savedLanguageLocale = localStorage.getItem(LANGUAGE_STORAGE_KEY) || 'en'
        
        // 1. Fetch all active languages to find the current one and its settings (like is_rtl)
        const languagesResult = await getAllLanguages({ status: true }).unwrap()
        const activeLanguages = languagesResult?.data?.languages || []
        const currentLanguage = activeLanguages.find(lang => lang.locale === savedLanguageLocale)
        
        if (currentLanguage) {
          // Fetch translations from the server for the current language
          try {
            const translationResult = await getTranslations(currentLanguage._id).unwrap()
            if (translationResult?.success && translationResult.data) {
              loadTranslations(savedLanguageLocale, translationResult.data)
            }
          } catch (error) {
            console.error(`Failed to load translations for ${savedLanguageLocale}:`, error)
            // If it's not English, we can try falling back to English
            if (savedLanguageLocale !== 'en') {
              await i18n.changeLanguage('en')
            }
          }
        }

        // 3. Switch i18n to the target language
        if (i18n.language !== savedLanguageLocale) {
          await i18n.changeLanguage(savedLanguageLocale)
        }

        // 4. Set RTL state based on language settings
        if (currentLanguage) {
          dispatch(setRTL(currentLanguage.is_rtl))
        } else if (savedLanguageLocale === 'en') {
          dispatch(setRTL(false))
        }

      } catch (error) {
        console.error('Language initialization failed:', error)
      } finally {
        setIsLanguageReady(true)
      }
    }

    initializeLanguage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return isLanguageReady
}

