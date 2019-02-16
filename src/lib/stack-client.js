import internal from 'lib/stack-internal.js'

/**
 * Cozy client instance
 * @private
 */
let cozyClient

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
    cozyURL: cozyClient.getStackClient().uri,
    token: cozyClient.getStackClient().token.token
  }
  return internal.init(legacyOptions)
} 

export default { ...internal, get: { ...internal.get}, init }