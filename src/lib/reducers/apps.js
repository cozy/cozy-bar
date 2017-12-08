import stack from '../stack'

// constants
const SET_APPS = 'SET_APPS'
const EXCLUDES = ['settings', 'onboarding']
const CATEGORIES = ['cozy', 'partners', 'ptnb']

// reducers
export const getApps = state => state

// actions
const setApps = apps => ({ type: SET_APPS, apps })

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
const reducers = (state = [], action) => {
  switch (action.type) {
    case SET_APPS:
      return action.apps
    default:
      return state
  }
}

export default reducers
