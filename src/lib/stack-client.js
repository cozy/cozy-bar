import internal from 'lib/stack-internal.js'

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
    cozyURL: getCozyURLOrigin
  }, 
  updateAccessToken, 
  logout, 
  init 
}