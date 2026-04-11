'use client'

import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/src/elements/ui/dropdown-menu'
import { Globe, Check, Loader2 } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Flag } from '../../shared/Flag'
import { languageApi } from '@/src/redux/api/languageApi'
import { useDispatch } from 'react-redux'
import { setRTL } from '@/src/redux/reducers/layoutSlice'
import { loadTranslations } from '@/src/utils/i18n-loader'
import { ImageBaseUrl } from '@/src/constants'
import Image from 'next/image'
import { toast } from 'sonner'

const LANGUAGE_STORAGE_KEY = 'selected_language'

const LanguageDropdown = () => {
  const { i18n } = useTranslation()
  const { theme } = useTheme()
  const dispatch = useDispatch()
  const [mounted, setMounted] = useState(false)
  const [isChanging, setIsChanging] = useState(false)

  // Fetch all active languages from the database
  const { data: languagesData, isLoading: isLoadingLanguages } = languageApi.useGetAllLanguagesQuery({ status: true })
  const [getTranslations] = languageApi.useLazyGetTranslationsQuery()

  const activeLanguages = useMemo(() => languagesData?.data?.languages || [], [languagesData])
  const currentLanguageLocale = i18n.resolvedLanguage || 'en'

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLanguageChange = async (locale: string, langId: string, isRtl: boolean) => {
    if (locale === currentLanguageLocale || isChanging) return

    setIsChanging(true)
    try {
      // Fetch translations from the server for the selected language
      const translationResult = await getTranslations(langId).unwrap()
      if (translationResult?.success && translationResult.data) {
        loadTranslations(locale, translationResult.data)
      } else {
        throw new Error('Failed to load translation data')
      }

      // 2. Change language in i18n
      await i18n.changeLanguage(locale)
      localStorage.setItem(LANGUAGE_STORAGE_KEY, locale)

      // 3. Update RTL state
      dispatch(setRTL(isRtl))

      // 4. Force reload resources just in case (optional)
      await i18n.reloadResources(locale, 'translations')
      
      toast.success(`Language changed to ${locale.toUpperCase()}`)
    } catch (error) {
      console.error('Failed to change language:', error)
      toast.error('Failed to change language. Please try again.')
    } finally {
      setIsChanging(false)
    }
  }

  if (!mounted) return null
  const darkMode = theme === 'dark'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          disabled={isChanging || isLoadingLanguages}
          className={`
            p-2.5 rounded-lg transition-all duration-200 relative group
            ${darkMode
              ? 'bg-page-body text-slate-400 hover:text-white hover:bg-[#455645]'
              : 'bg-white text-slate-500 hover:text-(--text-green-primary) hover:bg-green-50 shadow-sm border border-slate-100'
            }
            ${(isChanging || isLoadingLanguages) ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {isChanging || isLoadingLanguages ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Globe className="w-5 h-5" />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="z-100 w-56 p-2 rounded-lg dark:bg-(--card-color) dark:border-(--card-border-color) shadow-2xl overflow-y-auto max-h-100">
        {activeLanguages.length > 0 ? (
          activeLanguages.map((lang) => (
            <DropdownMenuItem
              key={lang._id}
              onClick={() => handleLanguageChange(lang.locale, lang._id, lang.is_rtl)}
              className={`
                cursor-pointer rounded-lg flex items-center gap-3 p-2.5 mb-1 last:mb-0 transition-colors
                ${currentLanguageLocale === lang.locale
                  ? 'bg-green-50 text-(--text-green-primary) dark:bg-emerald-900/20 dark:text-(--text-green-primary)'
                  : 'hover:bg-slate-50 dark:hover:bg-(--dark-sidebar) focus:bg-slate-50 dark:focus:bg-[#455645]/30'
                }
              `}
              disabled={isChanging}
            >
              <div className="w-6 h-4.5 relative rounded-xs overflow-hidden border border-slate-200 dark:border-slate-800 shrink-0">
                {lang.flag ? (
                  <Image
                    src={`${ImageBaseUrl}/${lang.flag}`}
                    alt={lang.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <Flag countryCode={lang.locale === 'en' ? 'us' : lang.locale} size={20} />
                )}
              </div>
              <span className="flex-1 text-sm font-medium">{lang.name}</span>
              {currentLanguageLocale === lang.locale && <Check className="w-4 h-4 text-(--text-green-primary)" />}
            </DropdownMenuItem>
          ))
        ) : (
          <div className="p-4 text-center text-sm text-slate-500">No active languages found.</div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default LanguageDropdown
