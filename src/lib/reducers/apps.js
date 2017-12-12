import stack from '../stack'

// constants
const SET_APPS = 'SET_APPS'
const SET_INFOS = 'SET_INFOS'
const EXCLUDES = ['settings', 'onboarding']
const CATEGORIES = ['cozy', 'partners', 'ptnb']

// reducers
export const getApps = state => state.apps
export const getAppsFiltered = state => {
  if (!state.apps) return []
  return state.apps.filter(app =>
    app.name !== state.appName || app.editor !== state.editor
  )
}

// actions
const setApps = apps => ({ type: SET_APPS, apps })
export const setInfos = (appName, editor) => ({ type: SET_INFOS, appName, editor })

// actions async
export const fetchApps = () => async dispatch => {
  let apps
  try {
    apps = await Promise.all((await stack.get.apps())
      .filter(app => !EXCLUDES.includes(app.attributes.slug))
      .map(async app => {
        // TODO load only one time icons
        const srcIcon = await stack.get.icon(app.links.icon)
        const icon = srcIcon
          ? {
            src: srcIcon,
            cached: true
          }
          : undefined
        return {
          editor: app.attributes.editor,
          name: app.attributes.name,
          slug: app.attributes.slug,
          href: app.links.related,
          category: CATEGORIES.includes(app.attributes.category)
            ? app.attributes.category
            : 'others',
          icon
        }
      })
    )
    await dispatch(setApps(apps))
  } catch (e) {
    console.warn(e.message ? e.message : e)
  }
}

// reducers
const defaultState = {
  apps: null,
  appName: null,
  editor: null
}

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case SET_APPS:
      return { ...state, apps: action.apps }
    case SET_INFOS:
      return { ...state, appName: action.appName, editor: action.editor }
    default:
      return state
  }
}

export default reducer
