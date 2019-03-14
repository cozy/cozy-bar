import { cozyFetchJSON } from 'lib/stack'

// This is a function that does the bare minimum in order to bypass the normal intent flow. To be replaced in th next version of intents.
export function fetchRawIntent(action, type, data = {}, permissions = []) {
  return cozyFetchJSON(null, 'POST', '/intents', {
    data: {
      type: 'io.cozy.intents',
      attributes: {
        action: action,
        type: type,
        data: data,
        permissions: permissions
      }
    }
  })
}

/*********************************************
This following code should never be changed here since it's must be the exact same than in cozy-client-js/src/intents.js
Service creating functions have been removed since it's not used by the bar
**********************************************/

const intentClass = 'coz-intent'

// helper to serialize/deserialize an error for/from postMessage
const errorSerializer = (() => {
  function mapErrorProperties(from, to) {
    const result = Object.assign(to, from)
    const nativeProperties = ['name', 'message']
    return nativeProperties.reduce((result, property) => {
      if (from[property]) {
        to[property] = from[property]
      }
      return result
    }, result)
  }
  return {
    serialize: error => mapErrorProperties(error, {}),
    deserialize: data => mapErrorProperties(data, new Error(data.message))
  }
})()

// inject iframe for service in given element
function injectService(url, element, intent, data, onReadyCallback) {
  const document = element.ownerDocument
  if (!document)
    throw new Error('Cannot retrieve document object from given element')

  const window = document.defaultView
  if (!window) throw new Error('Cannot retrieve window object from document')

  const iframe = document.createElement('iframe')
  // if callback provided for when iframe is loaded
  if (typeof onReadyCallback === 'function') iframe.onload = onReadyCallback
  iframe.setAttribute('src', url)
  iframe.classList.add(intentClass)
  element.appendChild(iframe)

  // Keeps only http://domain:port/
  const serviceOrigin = url.split('/', 3).join('/')

  return new Promise((resolve, reject) => {
    let handshaken = false
    const messageHandler = event => {
      if (event.origin !== serviceOrigin) return

      if (event.data.type === 'load') {
        // Safari 9.1 (At least) send a MessageEvent when the iframe loads,
        // making the handshake fails.
        console.warn &&
          console.warn(
            'Cozy Client ignored MessageEvent having data.type `load`.'
          )
        return
      }

      if (event.data.type === `intent-${intent._id}:ready`) {
        handshaken = true
        return event.source.postMessage(data, event.origin)
      }

      if (handshaken && event.data.type === `intent-${intent._id}:resize`) {
        ;['width', 'height', 'maxWidth', 'maxHeight'].forEach(prop => {
          if (event.data.transition)
            element.style.transition = event.data.transition
          if (event.data.dimensions[prop])
            element.style[prop] = `${event.data.dimensions[prop]}px`
        })

        return true
      }

      window.removeEventListener('message', messageHandler)
      const removeIntentFrame = () => {
        // check if the parent node has not been already removed from the DOM
        iframe.parentNode && iframe.parentNode.removeChild(iframe)
      }

      if (
        handshaken &&
        event.data.type === `intent-${intent._id}:exposeFrameRemoval`
      ) {
        return resolve({ removeIntentFrame, doc: event.data.document })
      }

      removeIntentFrame()

      if (event.data.type === `intent-${intent._id}:error`) {
        return reject(errorSerializer.deserialize(event.data.error))
      }

      if (handshaken && event.data.type === `intent-${intent._id}:cancel`) {
        return resolve(null)
      }

      if (handshaken && event.data.type === `intent-${intent._id}:done`) {
        return resolve(event.data.document)
      }

      if (!handshaken) {
        return reject(
          new Error('Unexpected handshake message from intent service')
        )
      }

      // We may be in a state where the messageHandler is still attached to then
      // window, but will not be needed anymore. For example, the service failed
      // before adding the `unload` listener, so no `intent:cancel` message has
      // never been sent.
      // So we simply ignore other messages, and this listener will stay here,
      // waiting for a message which will never come, forever (almost).
    }

    window.addEventListener('message', messageHandler)
  })
}

export function create(cozy, action, type, data = {}, permissions = []) {
  if (!action)
    throw new Error(`Misformed intent, "action" property must be provided`)
  if (!type)
    throw new Error(`Misformed intent, "type" property must be provided`)

  const createPromise = cozyFetchJSON(cozy, 'POST', '/intents', {
    data: {
      type: 'io.cozy.intents',
      attributes: {
        action: action,
        type: type,
        data: data,
        permissions: permissions
      }
    }
  })

  createPromise.start = (element, onReadyCallback) => {
    return createPromise.then(intent => {
      let service = intent.attributes.services && intent.attributes.services[0]

      if (!service) {
        return Promise.reject(new Error('Unable to find a service'))
      }

      return injectService(service.href, element, intent, data, onReadyCallback)
    })
  }

  return createPromise
}
