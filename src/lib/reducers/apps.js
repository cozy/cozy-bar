/* global __TARGET__ */
import stack from '../stack'
import unionWith from 'lodash.unionwith'

// constants
const DELETE_APP = 'DELETE_APP'
const RECEIVE_APP = 'RECEIVE_APP'
const RECEIVE_APP_LIST = 'RECEIVE_APP_LIST'
const RECEIVE_HOME_APP = 'RECEIVE_HOME_APP'
const FETCH_APPS = 'FETCH_APPS'
const SET_INFOS = 'SET_INFOS'
const EXCLUDES = ['settings', 'onboarding']

const isCurrentApp = (state, app) => app.slug === state.appSlug

// selectors
const onMobile = __TARGET__ === 'mobile'
export const getApps = (state, mobile = onMobile) => {
  if (!state.apps) return []

  const appsWithCurrentApp = state.apps.filter(
    app => app.slug !== (state.homeApp && state.homeApp.slug)
  )

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
export const deleteApp = app => ({ type: DELETE_APP, app })
export const receiveApp = app => ({ type: RECEIVE_APP, app })
const receiveAppList = apps => ({ type: RECEIVE_APP_LIST, apps })
const receiveHomeApp = homeApp => ({ type: RECEIVE_HOME_APP, homeApp })
export const setInfos = (appName, appNamePrefix, appSlug) => ({
  type: SET_INFOS,
  appName,
  appNamePrefix,
  appSlug
})

// actions async
export const fetchApps = () => async dispatch => {
  try {
    await dispatch({ type: FETCH_APPS })
    const rawAppList = await stack.get.apps()
    const apps = rawAppList
      .filter(app => !EXCLUDES.includes(app.attributes.slug))
      .map(mapApp)
    // TODO load only one time icons
    await dispatch(setHomeApp(apps))
    await dispatch(receiveAppList(apps))
  } catch (e) {
    console.warn(e.message ? e.message : e)
  }
}

const setHomeApp = appsList => async dispatch => {
  return stack.get
    .context()
    .then(context => {
      const homeLink =
        context.data &&
        context.data.attributes &&
        context.data.attributes.default_redirection
      const slugRegexp = /^([^/]+)\/.*/
      const homeSlug =
        homeLink && homeLink.match(slugRegexp) && homeLink.match(slugRegexp)[1]
      if (!homeSlug) return appsList
      const homeApp = appsList.find(app => app.slug === homeSlug)
      return dispatch(receiveHomeApp(homeApp))
    })
    .catch(error => {
      console.warn &&
        console.warn(`Cozy-bar cannot fetch home app data: ${error.message}`)
      return appsList
    })
}

// reducers
const defaultState = {
  apps: [],
  homeApp: null,
  isFetching: true,
  appName: null,
  appNamePrefix: null,
  appSlug: null,
  hasFetched: false
}

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case FETCH_APPS:
      return { ...state, isFetching: true }
    case RECEIVE_APP:
      return {
        ...state,
        apps: unionWith(
          state.apps,
          [mapApp(action.app)],
          (appA, appB) => appA.slug === appB.slug
        )
      }
    case RECEIVE_APP_LIST: {
      const appsList = action.apps.map(app => ({
        ...app,
        isCurrentApp: isCurrentApp(state, app)
      }))
      return { ...state, isFetching: false, hasFetched: true, apps: appsList }
    }
    case RECEIVE_HOME_APP: {
      const homeApp = action.homeApp
      return isCurrentApp(state, homeApp)
        ? {
            ...state,
            homeApp: { ...homeApp, isCurrentApp: true }
          }
        : { ...state, homeApp }
    }
    case DELETE_APP:
      return {
        ...state,
        apps: state.apps.filter(app => app.slug !== action.app.slug)
      }
    case SET_INFOS:
      return {
        ...state,
        appName: action.appName,
        appNamePrefix: action.appNamePrefix,
        appSlug: action.appSlug
      }
    default:
      return state
  }
}

export default reducer

// helpers
const camelCasify = object =>
  !!object &&
  Object.keys(object).reduce((acc, key) => {
    const camelCaseKey = key
      .split('_')
      .map(
        (segment, index) =>
          index ? segment.charAt(0).toUpperCase() + segment.slice(1) : segment
      )
      .join('')
    acc[camelCaseKey] = object[key]
    return acc
  }, {})

const mapApp = app => ({
  ...app,
  ...camelCasify(app.attributes),
  href: app.links && app.links.related
})
