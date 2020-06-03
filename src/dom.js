const APP_SELECTOR = '[role=application]'

// return an empty object by default to avoid checking existance
const getAppNodeDataSet = () => {
  const appNode = document.querySelector(APP_SELECTOR)
  if (!appNode || !appNode.dataset) return {}
  return appNode.dataset
}

const getDefaultStackURL = isPublic => {
  const data = getAppNodeDataSet()
  if (!data.cozyDomain) {
    if (!isPublic) {
      // eslint-disable-next-line no-console
      console.warn(
        `Cozy-bar can't discover the cozy's URL, and will probably fail to initialize the connection with the stack.`
      )
    }
    return ''
  }

  const protocol = window.location.protocol
  return `${protocol}//${data.cozyDomain}`
}

const getDefaultToken = isPublic => {
  const data = getAppNodeDataSet()
  if (!data.cozyToken) {
    if (!isPublic) {
      // eslint-disable-next-line no-console
      console.warn(
        `Cozy-bar can't discover the app's token, and will probably fail to initialize the connection with the stack.`
      )
    }
    return ''
  }
  return data.cozyToken
}

const getDefaultIcon = () => {
  const linkNode = document.querySelector('link[rel="icon"][sizes^="32"]')
  if (linkNode !== null) {
    return linkNode.getAttribute('href')
  } else {
    return 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
  }
}

const getAppNamePrefix = () => {
  const data = getAppNodeDataSet()
  return data.cozyAppNamePrefix || null
}

const getAppSlug = () => {
  const data = getAppNodeDataSet()
  return data.cozyAppSlug || null
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
  getDefaultStackURL,
  getDefaultToken,
  getDefaultIcon,
  getAppNamePrefix,
  getAppSlug,
  getUserActionRequired,
  APP_SELECTOR
}
