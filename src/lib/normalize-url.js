/**
 * Gives an URL object from a partial URL
 *
 * Mobile apps give us full URL with domain and protocol.
 * Web apps may also initialize with a full URL
 * but they usually don't, and we the use the
 * domain given by the stack through a DOM node
 * in the HTML page (despite it not being a full URL).
 *
 * This function normalizes these different cases
 * and returns a full URL object.
 *
 * The `secure` parameter, if given, always has the
 * priority over the one from the URL.
 * We use a secure protocol by default if we can't decide.
 *
 * @param {String} cozyURL - full URL or domain of the cozy
 * @param {boolean} secure - optional, force the protocol to use ssl (or not)
 * @returns {URL}
 */
export default function normalizeURL(cozyURL, secure) {
  if (typeof cozyURL === 'undefined') {
    throw new Error('Please give the Cozy URL when initializing the cozy-bar')
  }

  if (cozyURL.match(/:\/\//)) {
    // This is a full URL, probably received from a mobile app.
    // The secure parameter overrides the protocol.
    if (secure !== undefined) {
      cozyURL = cozyURL.replace(/^https?:/, secure ? 'https:' : 'http:')
    }
  } else {
    // We only have the domain, not a real URL.
    // Let's decide what protocol we should use.
    if (secure === undefined) {
      if (window && window.location && window.location.protocol) {
        secure = window.location.protocol === 'https:'
      } else {
        secure = true
      }
    }
    cozyURL = (secure ? 'https://' : 'http://') + cozyURL
  }
  return new URL(cozyURL)
}
