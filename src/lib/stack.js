import internal from 'lib/stack-internal.js'
import client from "lib/stack-client"


/**
 * Reference to the current client depending
 * on which one has been initialized
 *
 * @private
 * @TODO We should set it to `undefined`
 * and throw an error when it is not initialized
 * Leaving with that default for today
 * so I do not need to rewrite deeply the tests
 * (they test some components without initializing
 * the stack client first, and rely on non-initialized
 * legacy client behaviour)
 */
let stack = internal

/**
 * Get the current stack client (legacy or cozy-client based)
 * based on which one has been initialized
 *
 * @returns {Object} functions to call the stack
 */
const current = function() {
  if (stack === undefined) {
    throw new Error("client not initialized in cozy-bar")
  }
  return stack
}

/**
 * Initializes the functions to call the cozy stack
 *
 * @function
 * @param {Object}  arg
 * @param {string}  arg.cozyURL - URL or domain of the stack
 * @param {boolean} arg.ssl     - Tells if we should use a secure protocol
 *                            required if cozyURL does not have a protocol
 * @param {string}  arg.token   - Access token for the stack
 * @param {Function} arg.onCreateApp 
 * @param {Function} arg.onDeleteApp
 * @returns {Promise}
 */
const init = function(options) {
  stack = internal
  return stack.init(options)
} 

const get = {
  app: (...args) => current().get.app(...args), 
  apps: (...args) => current().get.apps(...args), 
  context: (...args) => current().get.context(...args),
  storageData: (...args) => current().get.storageData(...args),
  iconProps: (...args) => current().get.iconProps(...args),
  cozyURL: (...args) => current().get.cozyURL(...args),
}

export default {
  init, 
  get, 
  updateAccessToken: (...args) => current().updateAccessToken(...args), 
  logout: (...args) => current().logout(...args), 
  cozyFetchJSON: (...args) => current().cozyFetchJSON(...args)
}
