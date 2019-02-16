import internal from 'lib/stack-internal.js'

import {
  UnavailableStackException,
  UnauthorizedStackException
} from './exceptions'

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
    token: cozyClient.getStackClient().token.token
  }
  return internal.init(legacyOptions)
} 

export default { 
  ...internal, 
  get: { 
    ...internal.get,
    cozyURL: getCozyURLOrigin
  }, 
  updateAccessToken, 
  logout, 
  init 
}