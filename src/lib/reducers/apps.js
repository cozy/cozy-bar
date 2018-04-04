/* global __TARGET__ */
import stack from '../stack'
import { ForbiddenException } from '../exceptions'

// constants
const RECEIVE_APP_LIST = 'RECEIVE_APP_LIST'
const RECEIVE_APP_LIST_FORBIDDEN = 'RECEIVE_APP_LIST_FORBIDDEN'
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
    (app.name !== state.appName || app.editor !== state.editor) && !app.comingSoon
  )
}
export const isAppListForbidden = state => state.apps ? state.apps.forbidden : false
export const getCurrentApp = state => `${state.editor} ${state.appName}`

// actions
const receiveAppList = apps => ({ type: RECEIVE_APP_LIST, apps })
const receiveAppListForbidden = () => ({ type: RECEIVE_APP_LIST_FORBIDDEN })
export const setInfos = (appName, editor) => ({ type: SET_INFOS, appName, editor })

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
    const rawAppList = await stack.get.apps()
    const comingSoonApps = await fetchComingSoonApps()
    const apps = rawAppList.filter(app => !EXCLUDES.includes(app.attributes.slug))
    // TODO load only one time icons
    const icons = await Promise.all(apps.map(app => stack.get.icon(app.links.icon)))
    const appsWithIcons = apps.map((app, idx) => ({
      editor: app.attributes.editor,
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
  appName: null,
  editor: null
}

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case RECEIVE_APP_LIST:
      return { ...state, apps: { ...state.apps, data: action.apps, forbidden: false } }
    case RECEIVE_APP_LIST_FORBIDDEN:
      return { ...state, apps: { ...state.apps, forbidden: true } }
    case SET_INFOS:
      return { ...state, appName: action.appName, editor: action.editor }
    default:
      return state
  }
}

export default reducer
