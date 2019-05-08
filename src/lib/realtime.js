import CozyRealtime from 'cozy-realtime'

const APPS_DOCTYPE = 'io.cozy.apps'

/**
 * Initialize realtime sockets
 *
 * Returns function that closes the realtime and unsubscribe handlers
 *
 * @private
 * @param {object}
 * @returns {Promise}
 */
function initializeRealtime({ getApp, onCreate, onDelete, cozyClient }) {
  const handleAppCreation = async app => {
    // Fetch directly the app to get attributes `related` as well.
    let fullApp
    try {
      fullApp = await getApp(app.slug)
    } catch (error) {
      throw new Error(`Cannot fetch app ${app.slug}: ${error.message}`)
    }

    if (typeof onCreate === 'function') {
      onCreate(fullApp)
    }
  }

  const handleAppRemoval = app => {
    if (typeof onDelete === 'function') {
      onDelete(app)
    }
  }

  let realtime
  try {
    realtime = new CozyRealtime({ cozyClient })
    realtime.subscribe('created', APPS_DOCTYPE, handleAppCreation)
    realtime.subscribe('deleted', APPS_DOCTYPE, handleAppRemoval)
  } catch (error) {
    console.warn(`Cannot initialize realtime in Cozy-bar: ${error.message}`)
  }

  return () => {
    if (!realtime) {
      return
    }
    realtime.unsubscribe('created', APPS_DOCTYPE, handleAppCreation)
    realtime.unsubscribe('deleted', APPS_DOCTYPE, handleAppRemoval)
  }
}

export default initializeRealtime
