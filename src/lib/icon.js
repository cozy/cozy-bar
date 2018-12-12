const cache = {}

const mimeTypes = {
  gif: 'image/gif',
  ico: 'image/vnd.microsoft.icon',
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  png: 'image/png',
  svg: 'image/svg+xml'
}

module.exports = async function getIcon(
  cozyUrl,
  fetchHeaders,
  app = {},
  useCache = true
) {
  if (useCache && cache.icons && cache.icons[url]) return cache.icons[url]

  const url = app.links && app.links.icon
  if (!url) return ''
  let icon

  try {
    const resp = await fetch(`${cozyUrl}${url}`, fetchHeaders)
    if (!resp.ok)
      throw new Error(`Error while fetching icon ${resp.statusText}: ${url}`)
    icon = await resp.blob()
  } catch (error) {
    throw error
  }
  if (!icon.type) {
    // iOS10 does not set correctly mime type for images, so we assume
    // that an empty mime type could mean that the app is running on iOS10.
    // For regular images like jpeg, png or gif it still works well in the
    // Safari browser but not for SVG.
    // So let's set a mime type manually. We cannot always set it to
    // image/svg+xml and must guess the mime type based on the icon attribute
    // from app/manifest
    // See https://stackoverflow.com/questions/38318411/uiwebview-on-ios-10-beta-not-loading-any-svg-images
    if (!app.icon) {
      throw new Error(`${app.name}: Cannot detect mime type for icon ${url}`)
    }

    const extension = app.icon.split('.').pop()

    if (!extension) {
      throw new Error(
        `${app.name}: Unable to detect icon mime type from extension (${
          app.icon
        })`
      )
    }

    if (!mimeTypes[extension]) {
      throw new Error(`${app.name}: 'Unexpected icon extension (${app.icon})`)
    }

    icon = new Blob([icon], { type: mimeTypes[extension] })
  }

  if (icon.type.match(/^image\/.*$/)) {
    const iconURL = URL.createObjectURL(icon)
    if (useCache) {
      cache.icons = cache.icons || {}
      cache.icons[url] = iconURL
    }

    return iconURL
  }
  throw new Error(`${app.name}: icon ${url} is not an image.`)
}
