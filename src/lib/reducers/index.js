import { combineReducers } from 'redux'
import appsReducer, * as apps from 'lib/reducers/apps'

const proxy = (attr, method) => {
  return (state, ...args) => {
    return method(state.cozyBar[attr], ...args)
  }
}

const fetchApps = apps.fetchApps
const setInfos = apps.setInfos
export { fetchApps, setInfos }

export const getIsSettingsAppInstalled = proxy(
  'apps',
  apps.getIsSettingsAppInstalled
)
export const getApps = proxy('apps', apps.getApps)
export const getHomeApp = proxy('apps', apps.getHomeApp)
export const isFetchingApps = proxy('apps', apps.isFetchingApps)
export const isCurrentApp = proxy('apps', apps.isCurrentApp)
export const hasFetched = proxy('apps', apps.hasFetched)

// realtime handlers
export const onRealtimeCreate = apps.receiveApp
export const onRealtimeDelete = apps.deleteApp

export const reducers = {
  cozyBar: combineReducers({
    apps: appsReducer
  })
}

export default combineReducers(reducers)
