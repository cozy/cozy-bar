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

function getApps () {
  return fetchJSON(`${COZY_URL}/apps/`, fetchOptions())
    .then(json => {
      if (json.error) throw new Error(json.error)
      else return json.data
    })
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

async function getIcon (url, useCache = true) {
  if (useCache && cache.icons && cache.icons[url]) return cache.icons[url]

  if (!url) return ''
  let icon
  const resp = await fetch(`${COZY_URL}${url}`, fetchOptions())

  if (!resp.ok) {
    throw new Error(`Error while fetching icon: ${resp.statusText}: ${url}`)
  }

  icon = await resp.blob()

  // check if MIME type is an image
  if (!icon.type.match(/^image\/.*$/)) return ''
  const iconUrl = URL.createObjectURL(icon)

  if (useCache) {
    cache.icons = cache.icons || {}
    cache.icons[url] = iconUrl
  }

  return iconUrl
}

const cache = {}

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
