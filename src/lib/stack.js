/* eslint-env browser */
/* global __SERVER__ */

import 'babel-polyfill'

import {
  ForbiddenException,
  ServerErrorException,
  NotFoundException,
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

let COZY_URL = __SERVER__
let COZY_TOKEN

const errorStatuses = {
  '401': UnauthorizedStackException,
  '403': ForbiddenException,
  '404': NotFoundException,
  '500': ServerErrorException
}

function getApps () {
  return fetch(`${COZY_URL}/apps/`, fetchOptions())
  .then(res => {
    if (res.status === 401) {
      throw new UnauthorizedStackException()
    }
    return res.json()
  })
  .then(json => json.data)
  .catch(e => {
    throw new UnavailableStackException()
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

function getDiskUsage () {
  return fetchJSON(`${COZY_URL}/settings/disk-usage`, fetchOptions())
  .then(json => parseInt(json.data.attributes.used, 10))
  .catch(e => {
    throw new UnavailableStackException()
  })
}

function getDiskQuota () {
  return fetchJSON(`${COZY_URL}/settings/disk-usage`, fetchOptions())
  .then(json => {
    const quota = parseInt(json.data.attributes.quota, 10)
    if (Number.isInteger(quota)) {
      return quota
    } else {
      return 100000000000 // @TODO Waiting for instructions about how to deal with limitless instances
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
  }
}

function getApp (slug) {
  return getApps().then(apps => apps.find(item => item.attributes.slug === slug))
}

async function getIcon (url) {
  const res = await fetch(`${COZY_URL}${url}`, fetchOptions())
  // res.text if SVG, otherwise res.blob  (mainly for safari support)
  const resClone = res.clone() // res must be cloned to be used twice
  const blob = await res.blob()
  const text = await resClone.text()

  try {
    return 'data:image/svg+xml;base64,' + btoa(text)
  } catch (e) { // eslint-disable-line
    return URL.createObjectURL(blob)
  }
}

function hasApp (slug) {
  return getApp(slug).then(app => !!(app && app.attributes.state === 'ready'))
}

const cache = {}

module.exports = {
  init ({cozyURL, token}) {
    COZY_URL = `//${cozyURL}`
    COZY_TOKEN = token
  },
  has: {
    /**
     * has.settings() allow to check if the Settings app is available in the
     * stack or not. It returns a boolean.
     * Exceptionnally, as the Settings app is a critical app (w/o it, no
     * password update, language change, etc), it also throw an exception if
     * the Settings app isn't available.
     */
    async settings () {
      let hasSettings

      try {
        hasSettings = await hasApp('settings')
      } catch (e) {
        hasSettings = false
        throw new UnavailableSettingsException()
      }

      if (!hasSettings) {
        throw new UnavailableSettingsException()
      }

      return hasSettings
    }
  },
  get: {
    app: getApp,
    apps: getApps,
    context: getContext(cache),
    diskUsage: getDiskUsage,
    diskQuota: getDiskQuota,
    icon: getIcon,
    cozyURL () {
      return COZY_URL
    },
    settingsBaseURI () {
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
  }
}
