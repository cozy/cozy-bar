import { combineReducers } from 'redux'
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

const setTheme = theme.setTheme
const setWebviewContext = unserializable.setWebviewContext
const fetchApps = apps.fetchApps
const setInfos = apps.setInfos
const fetchSettingsData = settings.fetchSettingsData
const logOut = settings.logOut
const fetchContext = context.fetchContext
export {
  setTheme,
  setWebviewContext,
  fetchApps,
  setInfos,
  fetchSettingsData,
  logOut,
  fetchContext
}

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
  context: contextReducer,
  settings: settingsReducer,
  theme: theme.reducer,
  unserializable: unserializable.reducer
}

export default combineReducers(reducers)
