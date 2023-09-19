import { extend as extendI18n } from 'cozy-ui/transpiled/react/providers/I18n'
import { SET_LOCALE } from 'lib/reducers/locale'

const extendI18nWithApp = lang => app => {
  const { langs, locales } = app

  const hasLangs = langs && langs.length
  if (!hasLangs) {
    // TODO The app does not provide langs, we should probably warn the developer
    // when the app is published on the registry.
    return app
  }

  const providesLang = hasLangs && langs.includes(lang)
  const currentLang = providesLang ? lang : langs[0]

  const localeKeys = locales && Object.keys(locales)
  const providesLocales =
    localeKeys && localeKeys.length && localeKeys.includes(currentLang)

  if (!providesLocales) {
    // TODO The app does not provide locales, we should probably warn the developer
    // when the app is published on the regisry.
    return app
  }

  extendI18n({ [app.slug]: locales[currentLang] })
  return app
}

const useLang = (apps, lang) => {
  apps && apps.forEach(extendI18nWithApp(lang))
}

export const appsI18nMiddleware = ({ getState }) => next => action => {
  const state = getState()
  switch (action.type) {
    case SET_LOCALE: {
      const apps = state.apps && state.apps.apps
      useLang(apps, action.lang)
      break
    }
    case 'RECEIVE_APP_LIST':
      action.apps &&
        action.apps.length &&
        action.apps.forEach(extendI18nWithApp(state.locale))
      break
    case 'RECEIVE_APP':
      action.app &&
        extendI18nWithApp(state.locale && state.locale.lang)(action.app)
      break
  }

  return next(action)
}

export default appsI18nMiddleware
