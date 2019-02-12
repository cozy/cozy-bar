import { combineReducers } from 'redux'
import * as content from './content'
import * as locale from './locale'
import * as theme from './theme'
import appsReducer, * as apps from './apps'
import settingsReducer, * as settings from './settings'
import contextReducer, * as context from './context'

const proxy = (attr, method) => {
  return (state, ...args) => {
    return method(state[attr], ...args)
  }
}

const deleteApp = apps.deleteApp
const setContent = content.setContent
const unsetContent = content.unsetContent
const setLocale = locale.setLocale
const setTheme = theme.setTheme
const fetchApps = apps.fetchApps
const receiveApp = apps.receiveApp
const setInfos = apps.setInfos
const fetchSettingsData = settings.fetchSettingsData
const logOut = settings.logOut
const fetchContext = context.fetchContext
export {
  deleteApp,
  setContent,
  unsetContent,
  setLocale,
  setTheme,
  fetchApps,
  receiveApp,
  setInfos,
  fetchSettingsData,
  logOut,
  fetchContext
}

export const getContent = proxy('content', content.getContent)
export const getLocale = proxy('locale', locale.getLocale)
export const getTheme = proxy('theme', theme.getTheme)
export const getApps = proxy('apps', apps.getApps)
export const getHomeApp = proxy('apps', apps.getHomeApp)
export const isFetchingApps = proxy('apps', apps.isFetchingApps)
export const getCurrentApp = proxy('apps', apps.getCurrentApp)
export const hasFetched = proxy('apps', apps.hasFetched)
export const getStorageData = proxy('settings', settings.getStorageData)
export const getSettingsAppURL = proxy('settings', settings.getSettingsAppURL)
export const isSettingsBusy = proxy('settings', settings.isSettingsBusy)
export const isFetchingSettings = proxy('settings', settings.isFetchingSettings)
export const getHelpLink = proxy('context', context.getHelpLink)
export const getClaudyActions = proxy('context', context.getClaudyActions)
export const shouldEnableClaudy = proxy('context', context.shouldEnableClaudy)

export const reducers = {
  content: content.reducer,
  locale: locale.reducer,
  theme: theme.reducer,
  apps: appsReducer,
  settings: settingsReducer,
  context: contextReducer
}

export default combineReducers(reducers)
