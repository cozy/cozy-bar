import { combineReducers } from 'redux'
import appsReducer, * as apps from 'lib/reducers/apps'
import settingsReducer, * as settings from 'lib/reducers/settings'
import contextReducer, * as context from 'lib/reducers/context'

const proxy = (attr, method) => {
  return (state, ...args) => {
    return method(state[attr], ...args)
  }
}

const fetchApps = apps.fetchApps
const setInfos = apps.setInfos
const fetchSettingsData = settings.fetchSettingsData
const logOut = settings.logOut
const fetchContext = context.fetchContext
export { fetchApps, setInfos, fetchSettingsData, logOut, fetchContext }

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

// realtime handlers
export const onRealtimeCreate = apps.receiveApp
export const onRealtimeDelete = apps.deleteApp

export const reducers = {
  apps: appsReducer,
  context: contextReducer,
  settings: settingsReducer
}

export default combineReducers(reducers)
