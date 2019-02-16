/* global __TARGET__ */
/* eslint-env browser */

import internal from 'lib/stack-internal.js'
import getIcon from 'lib/icon'

import {
  ForbiddenException,
  ServerErrorException,
  NotFoundException,
  MethodNotAllowedException,
  UnavailableStackException,
  UnauthorizedStackException
} from './exceptions'

const errorStatuses = {
  '401': UnauthorizedStackException,
  '403': ForbiddenException,
  '404': NotFoundException,
  '405': MethodNotAllowedException,
  '500': ServerErrorException
}

/**
 * Cozy client instance
 * @private
 */
let cozyClient

/**
 * Get the stackClient from the cozy-client instance
 *
 * @private
 * @function
 * @returns {Object} cozy-stack-client instance
 */
const getStackClient = function() {
  return cozyClient.getStackClient()
}

/**
 * Logout and disconnect the user
 * @function
 * @TODO move this to cozy-stack-client
 * @returns {Promise}
 */
const logout = function() {
  return getStackClient().fetch('DELETE', '/auth/login').then(
    resp => {
      if (resp.status === 401) {
        throw new UnauthorizedStackException()
      } else if (resp.status === 204) {
        window.location.reload()
      }
      return true
    }
  ).catch(
    () => { 
      throw new UnavailableStackException()
    }
  )
}

/**
 * Get a cozy URL object
 *
 * @function
 * @returns {URL} 
 */
const getCozyURL = function() {
  return new URL(getStackClient().uri)
}

/**
 * Get a the cozy origin as an URL string
 * 
 * @function
 * @returns {string}
 */
const getCozyURLOrigin = function() {
  return getCozyURL().origin
}

/**
 * @deprecated
 * @private
 */
const updateAccessToken = function(token) {
  throw new Error("updateAccessToken should not be used with a cozy-client instance initialization")
}

/**
 * Fetch a resource with cozy-client
 *
 * Utility to maintain the compatibility with the legacy 
 * standalone cozy-bar client
 *
 * @function
 * @private
 * @returns {Promise} the full raw JSON playload
 */
const fetchJSON = function(method, path, body, options={}) {
  
  // We mirror here a few lines from cozy-stack-client
  // because we want a customized fetchJSON 
  const headers = (options.headers = options.headers || {})
  headers['Accept'] = 'application/json'
  if (method !== 'GET' && method !== 'HEAD' && body !== undefined) {
    if (!headers['Content-Type']) {
      headers['Content-Type'] = 'application/json'
      body = JSON.stringify(body)
    }
  }

  return getStackClient().fetch(method, path, body, options).then(
    resp => {
      if (typeof errorStatuses[resp.status] === 'function') {
        throw new errorStatuses[resp.status]()
      }    
      const contentType = resp.headers.get('content-type')
      const isJson = contentType.includes('json')
      if (!isJson) {
        throw new Error("Server response not in JSON")
      }
      return resp.json()
    }
  )
}

/**
 * Test if an error is from an HTTP 404
 *
 * @function
 * @private
 * @param {Function} error - received from a fetch
 * @returns {boolean}
 */
const is404 = function(error) {
  return ['NotFoundException', 'NotFound', 'FetchError'].includes(error.name) &&
     error.status && 
     error.status === 404
} 

/**
 * Memoize the result of a function which does an HTTP fetch
 * 
 * If a call throws an error because the 
 * underlying HTTP request returned a 404
 * then this function returns a default value
 * 
 * In the absence of any other error, the result is
 * cached and reused in the next call to the function.
 * 
 *
 * @function
 * @param {Function} fn - the function to memoize. It will be
 *                        called without any parameter
 * @param {Object} defaultValue - returned in case of 404
 * @returns {Function} async function
 */                  
const withCache = function(fn, defaultValue) {
  let cache = undefined
  return async function() {
    if (cache === undefined) {
      try {
        cache = await fn() 
      } catch(error) {
        cache = is404(error) ? defaultValue : undefined
      }
    } 
    return cache
  }
}

/**
 * List all installed applications
 *
 * Returns only the `data` key of the
 * whole JSON payload from the server
 *
 * @function
 * @returns {Promise} 
 */
const getApps = function () {
  return fetchJSON('GET', '/apps/').then(
    json => {
      if (json.error) {
        throw new Error(json.error)
      }
      return json.data
    }
  )
}

/**
 * Detail of an installed application by its slug
 *
 * Returns only the `data` key of the
 * whole JSON payload from the server
 *
 * @function
 * @param {string} slug 
 * @returns {Promise} 
 */
const getApp = function(slug) {
  if (!slug) {
    throw new Error('Missing slug')
  }
  return fetchJSON('GET', `/apps/${slug}`).then(
    json => {
      if (json.error) { 
        throw new Error(json.error) 
      }
      return json.data
    }
  )
}

/** 
 * default value when no quota is provided 
 * @private
 */
const defaultQuota = 10**12 // 1 Tera

/**
 * Get storage and quota usage
 *
 * When no quota is returned by the server
 * the quota used is the larger between 
 * `defaultQuota` and 10 * usage
 * 
 * @function
 * @returns {Object} {usage, quota, isLimited}
 */
const getStorageData = function() {
  return fetchJSON('GET', '/settings/disk-usage').then( 
    json => { 
      // parseInt because responses from the server are in text
      const usage = parseInt(json.data.attributes.used, 10)
      const realQuota = parseInt(json.data.attributes.quota, 10)
      // @TODO this is a workaround, we should certainly do smarter
      // and either not requiring this attribute
      // or set it to something more real
      const quota = realQuota || Math.max(defaultQuota, 10 * usage)
      const isLimited = json.data.attributes.is_limited
      return { usage, quota, isLimited }
    }
  ).catch( 
    error => {
      throw new UnavailableStackException()
    }
  )
}

/**
 * Fetch an icon data from its path
 * 
 * The purpose of this function is to be sent
 * to AppIcon components for mobile devices.
 * 
 * @private
 * @function
 * @param {string} iconPath - path of the icon in the stack
 * @returns {Blob}
 */
const iconFetcher = function(iconPath) {
  return getStackClient().fetch('GET', iconPath)
}

/**
 * Get a props object that can be sent to an AppIcon component
 *
 * Mobile devices and web browsers need different props
 * 
 * @function
 * @returns {Object}
 */
const getAppIconProps = function() {
  const isMobile = (__TARGET__ === 'mobile')
  
  const mobileAppIconProps = {
    fetchIcon: app => getIcon(iconFetcher, app, true)
  }

  const browserAppIconProps = {
    // we mustn't give the protocol here
    domain: getCozyURL().host,
    secure: (getCozyURL().protocol === 'https:')
  }

  return isMobile ? mobileAppIconProps : browserAppIconProps
}

/**
 * Get settings context
 *
 * @function
 * @return {Promise}
 * @see https://docs.cozy.io/en/cozy-stack/settings/#get-settingscontext
 */
const getContext = function() {
  return fetchJSON('GET', '/settings/context')
}

/**
 * Initializes the functions to call the cozy stack
 *
 * @function
 * @param {Object}  arg
 * @param {Object}  arg.cozyClient - a cozy client instance
 * @param {Function} arg.onCreateApp 
 * @param {Function} arg.onDeleteApp
 * @returns {Promise}
 */
const init = function(options) {
  cozyClient = options.cozyClient
  const legacyOptions = {
    ...options,
    cozyURL: getCozyURLOrigin(),
    token: getStackClient().token.token
  }
  return internal.init(legacyOptions)
} 

export default { 
  ...internal, 
  get: { 
    ...internal.get,
    app: getApp,
    apps: getApps,
    context: withCache(getContext, {}),
    storageData: getStorageData,
    iconProps: getAppIconProps,
    cozyURL: getCozyURLOrigin
  }, 
  updateAccessToken, 
  logout, 
  init 
}