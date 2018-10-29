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

// selectors
export const getApps = state => {
  if (__TARGET__ !== 'mobile') {
    return state.apps && state.apps.data
  }

  if (!state.apps || !state.apps.data) return []
  return state.apps.data.filter(app =>
    (app.name !== state.appName || app.name_prefix !== state.appNamePrefix) && !app.comingSoon
  )
}
export const isAppListFetching = state => state.apps ? state.apps.isFetching : false
export const isAppListForbidden = state => state.apps ? state.apps.forbidden : false
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

// actions async
export const fetchApps = () => async dispatch => {
  try {
    dispatch(({ type: FETCH_APPS }))
    const rawAppList = await stack.get.apps()
    const comingSoonApps = await fetchComingSoonApps()
    const apps = rawAppList.filter(app => !EXCLUDES.includes(app.attributes.slug))
    // TODO load only one time icons
    const icons = await Promise.all(apps.map(app => stack.get.icon(app, true)))
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
        : null
    }))
    let appsList = appsWithIcons
    if (comingSoonApps && comingSoonApps.length) {
      comingSoonApps.map(csApp => {
        if (!apps.find(
          app => app.attributes.slug === csApp.slug
        )) {
          // add coming soon apps only if not already installed
          appsList.push(csApp)
        }
      })
    }
    dispatch(receiveAppList(appsList))
  } catch (e) {
    if (e.constructor === ForbiddenException) {
      dispatch(receiveAppListForbidden())
    } else {
      console.warn(e.message ? e.message : e)
    }
  }
}

const fetchComingSoonApps = () => {
  return stack.get.context()
    .then(context => {
      const comingSoonApps = (context.data && context.data.attributes &&
      context.data.attributes['coming_soon'] &&
      Object.values(context.data.attributes['coming_soon'])) || []
      return comingSoonApps.map(app => {
        let icon
        try {
          icon = app.slug && {
            cached: true,
            src: require(`../../assets/icons/comingsoon/icon-${app.slug}.svg`)
          }
        } catch (error) {
          console.warn && console.warn(`Cannot retrieve icon for app ${app.name}:`, error.message)
        }
        return Object.assign({}, app, {
          comingSoon: true,
          icon: icon
        })
      })
    })
    .catch(error => {
      console.warn && console.warn(`Cozy-bar cannot fetch comming soon apps: ${error.message}`)
      return []
    })
}

// reducers
const defaultState = {
  apps: { data: null, forbidden: false },
  isFetching: false,
  appName: null,
  appNamePrefix: null
}

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case FETCH_APPS:
      return { ...state, apps: { ...state.apps, isFetching: true } }
    case RECEIVE_APP_LIST:
      return { ...state, apps: { ...state.apps, data: action.apps, forbidden: false, isFetching: false } }
    case RECEIVE_APP_LIST_FORBIDDEN:
      return { ...state, apps: { ...state.apps, forbidden: true, isFetching: false } }
    case SET_INFOS:
      return { ...state, appName: action.appName, appNamePrefix: action.appNamePrefix }
    default:
      return state
  }
}

export default reducer
