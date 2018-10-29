/* global __TARGET__ */
/* eslint-env browser */

import realtime from 'cozy-realtime'

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
function fetchOptions() {
  return {
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${COZY_TOKEN}`,
      Accept: 'application/json'
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

function getApps() {
  return fetchJSON(`${COZY_URL}/apps/`, fetchOptions()).then(json => {
    if (json.error) throw new Error(json.error)
    else return json.data
  })
}

function fetchJSON(url, options) {
  return fetch(url, options).then(res => {
    if (typeof errorStatuses[res.status] === 'function') {
      throw new errorStatuses[res.status]()
    }

    return res.json()
  })
}

// fetch function with the same interface than in cozy-client-js
function cozyFetchJSON(cozy, method, path, body) {
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
  return fetchJSON(`${COZY_URL}${path}`, requestOptions).then(json => {
    const responseData = Object.assign({}, json.data)
    if (responseData.id) responseData._id = responseData.id
    return Promise.resolve(responseData)
  })
}

function getStorageData() {
  return fetchJSON(`${COZY_URL}/settings/disk-usage`, fetchOptions())
    .then(json => {
      return {
        usage: parseInt(json.data.attributes.used, 10),
        // TODO Better handling when no quota provided
        quota: parseInt(json.data.attributes.quota, 10) || 100000000000,
        isLimited: json.data.attributes.is_limited
      }
    })
    .catch(() => {
      throw new UnavailableStackException()
    })
}

function getContext(cache) {
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

function getApp(slug) {
  if (!slug) {
    throw new Error('Missing slug')
  }
  return fetchJSON(`${COZY_URL}/apps/${slug}`, fetchOptions()).then(json => {
    if (json.error) throw new Error(json.error)
    else return json.data
  })
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

async function initializeRealtime({
  onCreateApp,
  onDeleteApp,
  ssl,
  url,
  token
}) {
  // Let's check the url. By default it's just the domain, but some apps are
  // passing a full URL with protocol.
  let parsedURL
  try {
    parsedURL = new URL(url)
  } catch (error) {
    console.warn(
      `Cannot parse URL for realtime, using ${url} as domain (${error.message})`
    )
  }

  const realtimeConfig = { token }
  if (parsedURL) {
    realtimeConfig.url = url
  } else {
    realtimeConfig.url = `${ssl ? 'https:' : 'http:'}${url}`
  }

  try {
    const realtimeApps = await realtime.subscribeAll(
      realtimeConfig,
      'io.cozy.apps'
    )

    realtimeApps.onCreate(async app => {
      // Fetch direclty the app to get attributes `related` as well.
      let fullApp
      try {
        fullApp = await getApp(app.slug)
      } catch (error) {
        throw new Error(`Cannont fetch app ${app.slug}: ${error.message}`)
      }

      if (typeof onCreateApp === 'function') {
        onCreateApp(fullApp)
      }
    })

    realtimeApps.onDelete(app => {
      if (typeof onDeleteApp === 'function') {
        onDeleteApp(app)
      }
    })
  } catch (error) {
    console.warn(`Cannot initialize realtime in Cozy-bar: ${error.message}`)
  }
}

module.exports = {
  async init({ cozyURL, token, onCreateApp, onDeleteApp, ssl }) {
    COZY_URL = `${__TARGET__ === 'mobile' ? '' : '//'}${cozyURL}`
    COZY_TOKEN = token
    await initializeRealtime({
      onCreateApp,
      onDeleteApp,
      token: COZY_TOKEN,
      url: COZY_URL,
      ssl
    })
  },
  updateAccessToken(token) {
    COZY_TOKEN = token
  },
  get: {
    app: getApp,
    apps: getApps,
    context: getContext(cache),
    storageData: getStorageData,
    icon: getIcon,
    cozyURL() {
      return COZY_URL
    },
    settingsAppURL() {
      return getApp('settings').then(settings => {
        if (!settings) {
          throw new UnavailableSettingsException()
        }
        return settings.links.related
      })
    }
  },
  logout() {
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
      .catch(() => {
        throw new UnavailableStackException()
      })
  },
  cozyFetchJSON // used in intents library
}
