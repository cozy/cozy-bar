import stack from 'lib/stack'
import unionWith from 'lodash.unionwith'
import flag from 'cozy-flags'

// constants
const DELETE_APP = 'DELETE_APP'
const RECEIVE_APP = 'RECEIVE_APP'
const RECEIVE_APP_LIST = 'RECEIVE_APP_LIST'
const RECEIVE_HOME_APP = 'RECEIVE_HOME_APP'
const FETCH_APPS = 'FETCH_APPS'
const FETCH_APPS_FAILURE = 'FETCH_APPS_FAILURE'
const FETCH_APPS_SUCCESS = 'FETCH_APPS_SUCCESS'
const SET_INFOS = 'SET_INFOS'

export const isCurrentApp = (state, app) => app.slug === state.appSlug

// selectors
export const getApps = state => {
  if (!state.apps) return []
  return state.apps
}

export const getHomeApp = state => {
  return state.homeApp
}

export const isFetchingApps = state => {
  return state ? state.isFetching : false
}

export const hasFetched = state => state.hasFetched

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
    dispatch({ type: FETCH_APPS })
    const rawAppList = await stack.get.apps()
    const excludedApps = flag('apps.hidden') || []
    const apps = rawAppList
      .map(mapApp)
      .filter(app => !excludedApps.includes(app.slug))
    if (!rawAppList.length)
      throw new Error('No installed apps found by the bar')
    // TODO load only one time icons
    await dispatch(setDefaultApp(apps))
    await dispatch(receiveAppList(apps))
  } catch (e) {
    dispatch({ type: FETCH_APPS_FAILURE })
    // eslint-disable-next-line no-console
    console.warn(e.message ? e.message : e)
  }
}

/**
 *
 * @param {Array} appsList
 */
export const setDefaultApp = appsList => async dispatch => {
  try {
    const HOME_APP_SLUG = 'home'
    const homeApp = findAppInArray(HOME_APP_SLUG, appsList)

    if (homeApp) {
      return dispatch(receiveHomeApp(homeApp))
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(`Cozy-bar cannot fetch home app data: ${error.message}`)
  }
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
    case FETCH_APPS_SUCCESS:
      return { ...state, isFetching: false }
    case FETCH_APPS_FAILURE:
      return { ...state, isFetching: false }
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
      .map((segment, index) =>
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

const findAppInArray = (appSlug, apps) => apps.find(app => app.slug === appSlug)
