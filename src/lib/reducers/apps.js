/* global __TARGET__ */
import stack from '../stack'
import { ForbiddenException } from '../exceptions'

// constants
const RECEIVE_APP_LIST = 'RECEIVE_APP_LIST'
const RECEIVE_APP_LIST_FORBIDDEN = 'RECEIVE_APP_LIST_FORBIDDEN'
const FETCH_APPS = 'FETCH_APPS'
const SET_INFOS = 'SET_INFOS'
const EXCLUDES = ['settings', 'onboarding']
const CATEGORIES = ['cozy', 'partners', 'ptnb']
const DEFAULT_CATEGORY = 'others'

const isCurrentApp = (state, app) =>
  app.slug === state.appSlug

// selectors
const onMobile = __TARGET__ !== 'mobile'
export const getApps = (state, mobile = onMobile) => {
  if (!state.apps) return []

  const appsWithCurrentApp = state.apps.map(app => {
    if (isCurrentApp(state, app)) {
      return Object.assign({}, app, { isCurrentApp: true })
    } else {
      return app
    }
  })

  if (!mobile) {
    return appsWithCurrentApp
  }

  return appsWithCurrentApp.filter(app => !isCurrentApp(state, app))
}

export const isAppListFetching = state => {
  return state ? state.isFetching : false
}

export const hasFetched = state => state.hasFetched
export const getCurrentApp = state => `${state.appNamePrefix} ${state.appName}`

// actions
const receiveAppList = apps => ({ type: RECEIVE_APP_LIST, apps })
const receiveAppListForbidden = () => ({ type: RECEIVE_APP_LIST_FORBIDDEN })
export const setInfos = (appName, appNamePrefix) => ({ type: SET_INFOS, appName, appNamePrefix })

const _getCategory = (manifest) => {
  if (!manifest.categories && manifest.category && CATEGORIES.includes(manifest.category)) {
    return manifest.category
  } else if (manifest.categories) {
    // the first authorized categories will be used by the bar
    return manifest.categories.find(cat => CATEGORIES.includes(cat)) || DEFAULT_CATEGORY
  } else {
    return DEFAULT_CATEGORY
  }
}
export const setInfos = (appName, appNamePrefix, appSlug) => ({ type: SET_INFOS, appName, appNamePrefix, appSlug })

// actions async
export const fetchApps = () => async dispatch => {
  try {
    dispatch(({ type: FETCH_APPS }))
    const rawAppList = await stack.get.apps()
    const apps = rawAppList.filter(app => !EXCLUDES.includes(app.attributes.slug))
    // TODO load only one time icons
    const icons = await Promise.all(apps.map(app => stack.get.icon(app.links.icon)))
    const appsWithIcons = apps.map((app, idx) => ({
      namePrefix: app.attributes.name_prefix,
      name: app.attributes.name,
      slug: app.attributes.slug,
      href: app.links.related,
      category: _getCategory(app.attributes),
      icon: icons[idx]
        ? {
          src: icons[idx],
          cached: true
        }
        : undefined
    }))
    dispatch(receiveAppList(appsWithIcons))
  } catch (e) {
    if (e.constructor === ForbiddenException) {
      dispatch(receiveAppListForbidden())
    } else {
      console.warn(e.message ? e.message : e)
    }
  }
}

// reducers
const defaultState = {
  apps: [],
  isFetching: false,
  appName: null,
  appNamePrefix: null,
  appSlug: null,
  hasFetched: false
}

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case FETCH_APPS:
      return { ...state, isFetching: true }
    case RECEIVE_APP_LIST:
      return { ...state, isFetching: false, hasFetched: true, apps: action.apps }
    case RECEIVE_APP_LIST_FORBIDDEN:
      return { ...state, isFetching: false }
    case SET_INFOS:
      return { ...state, appName: action.appName, appNamePrefix: action.appNamePrefix, appSlug: action.appSlug }
    default:
      return state
  }
}

export default reducer
