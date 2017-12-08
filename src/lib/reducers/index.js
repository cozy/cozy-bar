import { combineReducers } from 'redux'
import * as content from './content'
import * as locale from './locale'
import appsReducers, { getApps as getAppsWithoutProxy, fetchApps } from './apps'

const proxy = (attr, method) => {
  return (state, ...args) => {
    return method(state[attr], ...args)
  }
}

const setContent = content.setContent
const setLocale = locale.setLocale
export { setContent, setLocale, fetchApps }

export const getContent = proxy('content', content.getContent)
export const getLocale = proxy('locale', locale.getLocale)
export const getApps = proxy('apps', getAppsWithoutProxy)

export const reducers = {
  content: content.reducer,
  locale: locale.reducer,
  apps: appsReducers
}

export default combineReducers(reducers)
