import realtime from 'cozy-realtime'

const APPS_DOCTYPE = 'io.cozy.apps'

/**
 * Initialize realtime sockets
 *
 * @private
 * @param {object}
 * @returns {Promise}
 */
async function initializeRealtime({ getApp, onCreate, onDelete, url, token }) {
  const realtimeConfig = { token, url }

  try {
    realtime
      .subscribe(realtimeConfig, APPS_DOCTYPE)
      .onCreate(async app => {
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
      })
      .onDelete(app => {
        if (typeof onDelete === 'function') {
          onDelete(app)
        }
      })
  } catch (error) {
    console.warn(`Cannot initialize realtime in Cozy-bar: ${error.message}`)
  }
}

export default initializeRealtime
