import internal from 'lib/stack-internal.js'
import client from 'lib/stack-client'

/**
 * Reference to the current client depending
 * on which one has been initialized
 *
 * @private
 */
let stack

/**
 * Get the current stack client (legacy or cozy-client based)
 * based on which one has been initialized
 *
 * @returns {Object} functions to call the stack
 */
const current = function() {
  if (!stack) {
    throw new Error('client not initialized in cozy-bar')
  }
  return stack
}

/**
 * Initializes the functions to call the cozy stack
 *
 * It can be initialized either with a cozy-client instance
 * or a { cozyURL, ssl, token } tupple.
 *
 * @function
 * @param {Object}  arg
 * @param {Object}  arg.cozyClient - a cozy client instance
 * @param {string}  arg.cozyURL - URL or domain of the stack
 * @param {boolean} arg.ssl     - Tells if we should use a secure protocol
 *                            required if cozyURL does not have a protocol
 * @param {string}  arg.token   - Access token for the stack
 * @param {Function} arg.onCreateApp
 * @param {Function} arg.onDeleteApp
 * @param {Boolean} arg.isPublic
 * @returns {Promise}
 */
const init = function(options) {
  stack = options.cozyClient.isFakeCozyClient ? internal : client
  return stack.init(options)
}

const get = {
  app: (...args) => current().get.app(...args),
  apps: (...args) => current().get.apps(...args),
  context: (...args) => current().get.context(...args),
  storageData: (...args) => current().get.storageData(...args),
  iconProps: (...args) => current().get.iconProps(...args),
  cozyURL: (...args) => current().get.cozyURL(...args),
  settingsAppURL: (...args) => current().get.settingsAppURL(...args)
}

const stackProxy = {
  init,
  get,
  updateAccessToken: (...args) => current().updateAccessToken(...args),
  logout: (...args) => current().logout(...args),
  cozyFetchJSON: (...args) => current().cozyFetchJSON(...args),
  // useful to connect some getters outside of this file without exposing
  // directly the private stack variable
  getStack: current,
  getIntents: () => current().get.intents()
}

export default stackProxy
export const { cozyFetchJSON, getIntents } = stackProxy
