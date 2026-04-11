import i18n from '../i18n'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const loadTranslations = (locale: string, translations: Record<string, any>) => {
  if (!translations || typeof translations !== 'object') {
    return
  }

  i18n.addResourceBundle(locale, 'translations', translations, true, true)
  i18n.reloadResources(locale, 'translations')
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const loadTranslationsFromStatic = (locale: string, translationJson: Record<string, any> | null) => {
  if (!translationJson) {
    return
  }

  const translations = translationJson.translations || translationJson
  loadTranslations(locale, translations)
}

