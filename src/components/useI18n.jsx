import { createUseI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import enLocale from 'locales/en.json'
import frLocale from 'locales/fr.json'
import esLocale from 'locales/es.json'
const locales = {
  en: enLocale,
  fr: frLocale,
  es: esLocale
}

const useI18n = createUseI18n(locales)

export default useI18n
