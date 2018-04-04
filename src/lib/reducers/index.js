import { combineReducers } from 'redux'
import * as content from './content'
import * as locale from './locale'
import appsReducer, * as apps from './apps'

const proxy = (attr, method) => {
  return (state, ...args) => {
    return method(state[attr], ...args)
  }
}

const setContent = content.setContent
const setLocale = locale.setLocale
const fetchApps = apps.fetchApps
const setInfos = apps.setInfos
export { setContent, setLocale, fetchApps, setInfos }

export const getContent = proxy('content', content.getContent)
export const getLocale = proxy('locale', locale.getLocale)
export const getApps = proxy('apps', apps.getApps)
export const isAppListForbidden = proxy('apps', apps.isAppListForbidden)
export const getCurrentApp = proxy('apps', apps.getCurrentApp)

export const reducers = {
  content: content.reducer,
  locale: locale.reducer,
  apps: appsReducer
}

export default combineReducers(reducers)
