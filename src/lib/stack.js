/* global __TARGET__ */
/* eslint-env browser */

import {
  ForbiddenException,
  ServerErrorException,
  NotFoundException,
  MethodNotAllowedException,
  UnavailableStackException,
  UnavailableSettingsException,
  UnauthorizedStackException
} from './exceptions'

// the option credentials:include tells fetch to include the cookies in the
// request even for cross-origin requests
function fetchOptions () {
  return {
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${COZY_TOKEN}`
    }
  }
}

let COZY_URL
let COZY_TOKEN

const errorStatuses = {
  '401': UnauthorizedStackException,
  '403': ForbiddenException,
  '404': NotFoundException,
  '405': MethodNotAllowedException,
  '500': ServerErrorException
}

function getApps () {
  return fetchJSON(`${COZY_URL}/apps/`, fetchOptions())
    .then(json => json.data)
}

function fetchJSON (url, options) {
  return fetch(url, options)
    .then(res => {
      if (typeof errorStatuses[res.status] === 'function') {
        throw new errorStatuses[res.status]()
      }

      return res.json()
    })
}

// fetch function with the same interface than in cozy-client-js
function cozyFetchJSON (cozy, method, path, body, options = {}) {
  const requestOptions = Object.assign({}, fetchOptions(), {
    method
  })
  requestOptions.headers['Accept'] = 'application/json'
  if (method !== 'GET' && method !== 'HEAD' && body !== undefined) {
    if (requestOptions.headers['Content-Type']) {
      requestOptions.body = body
    } else {
      requestOptions.headers['Content-Type'] = 'application/json'
      requestOptions.body = JSON.stringify(body)
    }
  }
  return fetchJSON(`${COZY_URL}${path}`, requestOptions)
    .then(json => {
      const responseData = Object.assign({}, json.data)
      if (responseData.id) responseData._id = responseData.id
      return Promise.resolve(responseData)
    })
}

function getStorageData () {
  return fetchJSON(`${COZY_URL}/settings/disk-usage`, fetchOptions())
    .then(json => {
      return {
        usage: parseInt(json.data.attributes.used, 10),
        // TODO Better handling when no quota provided
        quota: parseInt(json.data.attributes.quota, 10) || 100000000000,
        isLimited: json.data.attributes.is_limited
      }
    })
    .catch(e => {
      throw new UnavailableStackException()
    })
}

function getContext (cache) {
  return () => {
    return cache['context']
      ? Promise.resolve(cache['context'])
      : fetchJSON(`${COZY_URL}/settings/context`, fetchOptions())
        .then(context => {
          cache['context'] = context
          return context
        })
        .catch(error => {
          if (error.status && error.status === 404) cache['context'] = {}
        })
  }
}

function getApp (slug) {
  return getApps().then(apps => apps.find(item => item.attributes.slug === slug))
}

const cache = {}

const mimeTypes = {
  gif: 'image/gif',
  ico: 'image/vnd.microsoft.icon',
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  png: 'image/png',
  svg: 'image/svg+xml'
}

async function getIcon(app = {}, useCache = true) {
  if (useCache && cache.icons && cache.icons[url]) return cache.icons[url]

  const url = app.links && app.links.icon
  if (!url) return ''
  let icon

  try {
    const resp = await fetch(`${COZY_URL}${url}`, fetchOptions())
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
    if (!(app.attributes && app.attributes.icon)) {
      throw new Error(`${app.attributes.name}: Cannot detect mime type for icon ${url}`)
    }

    const extension = app.attributes.icon.split('.').pop()

    if (!extension) {
      throw new Error(
        `${app.attributes.name}: Unable to detect icon mime type from extension (${
          app.attributes.icon
        })`
      )
    }

    if (!mimeTypes[extension]) {
      throw new Error(`${app.attributes.name}: 'Unexpected icon extension (${app.attributes.icon})`)
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
  throw new Error(`${app.attributes.name}: icon ${url} is not an image.`)
}

module.exports = {
  init ({cozyURL, token}) {
    COZY_URL = `${__TARGET__ === 'mobile' ? '' : '//'}${cozyURL}`
    COZY_TOKEN = token
  },
  updateAccessToken (token) {
    COZY_TOKEN = token
  },
  get: {
    app: getApp,
    apps: getApps,
    context: getContext(cache),
    storageData: getStorageData,
    icon: getIcon,
    cozyURL () {
      return COZY_URL
    },
    settingsAppURL () {
      return getApp('settings')
        .then(settings => {
          if (!settings) { throw new UnavailableSettingsException() }
          return settings.links.related
        })
    }
  },
  logout () {
    const options = Object.assign({}, fetchOptions(), {
      method: 'DELETE'
    })

    return fetch(`${COZY_URL}/auth/login`, options)
      .then(res => {
        if (res.status === 401) {
          throw new UnauthorizedStackException()
        } else if (res.status === 204) {
          window.location.reload()
        }
      })
      .catch(e => {
        throw new UnavailableStackException()
      })
  },
  cozyFetchJSON // used in intents library
}
