import { combineReducers } from 'redux'
import * as content from 'lib/reducers/content'
import * as locale from 'lib/reducers/locale'
import * as theme from 'lib/reducers/theme'
import * as unserializable from 'lib/reducers/unserializable'
import appsReducer, * as apps from 'lib/reducers/apps'
import settingsReducer, * as settings from 'lib/reducers/settings'
import contextReducer, * as context from 'lib/reducers/context'

const proxy = (attr, method) => {
  return (state, ...args) => {
    return method(state[attr], ...args)
  }
}

const setContent = content.setContent
const unsetContent = content.unsetContent
const setLocale = locale.setLocale
const setTheme = theme.setTheme
const setWebviewContext = unserializable.setWebviewContext
const fetchApps = apps.fetchApps
const setInfos = apps.setInfos
const fetchSettingsData = settings.fetchSettingsData
const logOut = settings.logOut
const fetchContext = context.fetchContext
export {
  setContent,
  unsetContent,
  setLocale,
  setTheme,
  setWebviewContext,
  fetchApps,
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
export const isCurrentApp = proxy('apps', apps.isCurrentApp)
export const hasFetched = proxy('apps', apps.hasFetched)
export const getStorageData = proxy('settings', settings.getStorageData)
export const getSettingsAppURL = proxy('settings', settings.getSettingsAppURL)
export const isSettingsBusy = proxy('settings', settings.isSettingsBusy)
export const isFetchingSettings = proxy('settings', settings.isFetchingSettings)
export const getHelpLink = proxy('context', context.getHelpLink)
export const getWebviewContext = proxy(
  'unserializable',
  unserializable.getWebviewContext
)

// realtime handlers
export const onRealtimeCreate = apps.receiveApp
export const onRealtimeDelete = apps.deleteApp

export const reducers = {
  apps: appsReducer,
  content: content.reducer,
  context: contextReducer,
  locale: locale.reducer,
  settings: settingsReducer,
  theme: theme.reducer,
  unserializable: unserializable.reducer
}

export default combineReducers(reducers)
