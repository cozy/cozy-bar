export const SET_LOCALE = 'SET_LOCALE'
export const setLocale = lang => ({
  type: SET_LOCALE, lang
})

const getDefaultLang = () => {
  return document.documentElement.getAttribute('lang') || 'en'
}

export const reducer = (state = getDefaultLang(), action) => {
  if (action.type === SET_LOCALE) {
    return action.lang
  } else {
    return state
  }
}

export const getLocale = state => state
