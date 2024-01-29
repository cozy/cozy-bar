const APP_SELECTOR = '[role=application]'

// return an empty object by default to avoid checking existance
const getCozyData = () => {
  const root = document.querySelector(APP_SELECTOR)
  if (!root || !root.dataset) return {}
  return JSON.parse(root.dataset.cozy)
}

const getDefaultIcon = () => {
  const data = getCozyData()
  if (data.app.icon) {
    return data.app.icon
  } else {
    return 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
  }
}

const getAppName = () => {
  const data = getCozyData()
  return data.app.name || null
}

const getAppNamePrefix = () => {
  const data = getCozyData()
  return data.app.prefix || null
}

const getAppSlug = () => {
  const data = getCozyData()
  return data.app.slug || null
}

const getUserActionRequired = () => {
  const meta = document.querySelector('meta[name=user-action-required]')
  const data = meta && meta.dataset
  if (data) {
    const { title, code, detail, links } = data
    if (code) {
      // we suppose that at least code will always exist
      return { title, code, detail, links }
    }
  }
  return undefined
}

export {
  getDefaultIcon,
  getAppName,
  getAppNamePrefix,
  getAppSlug,
  getUserActionRequired,
  APP_SELECTOR
}
