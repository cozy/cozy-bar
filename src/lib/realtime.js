import realtime from 'cozy-realtime'


/**
 * Initialize realtime sockets
 * 
 * @private
 * @param {object}
 * @returns {Promise}
 */
async function initializeRealtime({ getApp, onCreateApp, onDeleteApp, url, token }) {
  const realtimeConfig = { token, url }

  try {
    realtime
      .subscribe(realtimeConfig, 'io.cozy.apps')
      .onCreate(async app => {
        // Fetch directly the app to get attributes `related` as well.
        let fullApp
        try {
          fullApp = await getApp(app.slug)
        } catch (error) {
          throw new Error(`Cannot fetch app ${app.slug}: ${error.message}`)
        }

        if (typeof onCreateApp === 'function') {
          onCreateApp(fullApp)
        }
      })
      .onDelete(app => {
        if (typeof onDeleteApp === 'function') {
          onDeleteApp(app)
        }
      })
  } catch (error) {
    console.warn(`Cannot initialize realtime in Cozy-bar: ${error.message}`)
  }
}

export default initializeRealtime
