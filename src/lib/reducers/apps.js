/* global __TARGET__ */
import stack from '../stack'

// constants
const RECEIVE_APP_LIST = 'RECEIVE_APP_LIST'
const RECEIVE_HOME_APP = 'RECEIVE_HOME_APP'
const FETCH_APPS = 'FETCH_APPS'
const SET_INFOS = 'SET_INFOS'
const EXCLUDES = ['settings', 'onboarding']

const isCurrentApp = (state, app) =>
  app.slug === state.appSlug

// selectors
const onMobile = __TARGET__ === 'mobile'
export const getApps = (state, mobile = onMobile) => {
  if (!state.apps) return []

  const appsWithCurrentApp = state.apps
    .filter(app => app.slug !== (state.homeApp && state.homeApp.slug))

  if (!mobile) {
    return appsWithCurrentApp
  }

  return appsWithCurrentApp.filter(app => !app.isCurrentApp)
}

export const getHomeApp = state => {
  return state.homeApp
}

export const isFetchingApps = state => {
  return state ? state.isFetching : false
}

export const hasFetched = state => state.hasFetched
export const getCurrentApp = state => `${state.appNamePrefix} ${state.appName}`

// actions
const receiveAppList = apps => ({ type: RECEIVE_APP_LIST, apps })
const receiveHomeApp = homeApp => ({ type: RECEIVE_HOME_APP, homeApp })
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
      icon: icons[idx]
        ? {
          src: icons[idx],
          cached: true
        }
        : undefined
    }))
    await dispatch(setHomeApp(appsWithIcons))
    await dispatch(receiveAppList(appsWithIcons))
  } catch (e) {
    console.warn(e.message ? e.message : e)
  }
}

const setHomeApp = appsList => async dispatch => {
  return stack.get.context()
    .then(context => {
      const homeLink = context.data && context.data.attributes &&
      context.data.attributes.default_redirection
      const slugRegexp = /^([^/]+)\/.*/
      const homeSlug = homeLink && homeLink.match(slugRegexp) && homeLink.match(slugRegexp)[1]
      if (!homeSlug) return appsList
      const homeApp = appsList.find(app => app.slug === homeSlug)
      return dispatch(receiveHomeApp(homeApp))
    })
    .catch(error => {
      console.warn && console.warn(`Cozy-bar cannot fetch home app data: ${error.message}`)
      return appsList
    })
}

// reducers
const defaultState = {
  apps: [],
  homeApp: null,
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
      const appsList = action.apps.map(app => {
        if (isCurrentApp(state, app)) {
          return {
            ...app,
            isCurrentApp: true
          }
        } else {
          return app
        }
      })
      return { ...state, isFetching: false, hasFetched: true, apps: appsList }
    case RECEIVE_HOME_APP:
      const homeApp = action.homeApp
      return isCurrentApp(state, homeApp)
        ? {
          ...state,
          homeApp: {...homeApp, isCurrentApp: true}
        } : { ...state, homeApp }
    case SET_INFOS:
      return { ...state, appName: action.appName, appNamePrefix: action.appNamePrefix, appSlug: action.appSlug }
    default:
      return state
  }
}

export default reducer
