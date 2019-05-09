import CozyRealtime from 'cozy-realtime'
import CozyClient from 'cozy-client'

const APPS_DOCTYPE = 'io.cozy.apps'

const makeClient = (cozyURL, token) => {
  const client = new CozyClient()
  client.login({ uri: cozyURL, token })
  return client
}

/**
 * Initialize realtime sockets
 *
 * @private
 * @param {object}
 * @returns {Promise}
 */
async function initializeRealtime({
  getApp,
  onCreate,
  onDelete,
  cozyClient,
  cozyURL,
  token
}) {
  try {
    const realtime = new CozyRealtime({
      cozyClient: cozyClient || makeClient(cozyURL, token)
    })

    realtime.subscribe('created', APPS_DOCTYPE, async app => {
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

    realtime.subscribe('deleted', APPS_DOCTYPE, app => {
      if (typeof onDelete === 'function') {
        onDelete(app)
      }
    })
  } catch (error) {
    console.warn(`Cannot initialize realtime in Cozy-bar: ${error.message}`)
  }
}

export default initializeRealtime
