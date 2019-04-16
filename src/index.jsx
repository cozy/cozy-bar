/* global __TARGET__, __VERSION__ */

'use strict'

import stack from 'lib/stack'
import {
  getLocale,
  onRealtimeCreate,
  onRealtimeDelete,
  setLocale,
  setInfos
} from 'lib/reducers'

import {
  locations as APILocations,
  getJsApiName,
  getReactApiName
} from 'lib/api/helpers'

require('styles')
require('lib/importIcons')

const APP_SELECTOR = '[role=application]'

const createBarElement = () => {
  const barNode = document.createElement('div')
  barNode.setAttribute('id', 'coz-bar')
  barNode.setAttribute('role', 'banner')
  barNode.classList.add(`coz-target--${__TARGET__}`)
  return barNode
}

const injectBarInDOM = data => {
  if (document.getElementById('coz-bar') !== null) {
    return
  }
  // import React related modules on init only
  const React = require('react')
  const { render } = require('react-dom')
  const { connect, Provider } = require('react-redux')
  const I18n = require('cozy-ui/react/I18n').default
  const Bar = require('components/Bar').default
  const CozyProvider = require('cozy-client').CozyProvider

  const { cozyClient } = data

  const barNode = createBarElement()
  const appNode = document.querySelector(APP_SELECTOR)
  if (!appNode) {
    console.warn(
      `Cozy-bar is looking for a "${APP_SELECTOR}" tag that contains your application and can't find it :'(… The BAR is now disabled`
    )
    return null
  }

  document.body.insertBefore(barNode, appNode)

  // method to put cozy-bar z-index on the top when Drawer visible and vice versa
  data.onDrawer = visible => {
    barNode.dataset.drawerVisible = visible
  }

  // specific layout behaviour if banner displayed
  if (data.userActionRequired) {
    document.body.classList.add('has-banner')
  }

  // we connect the I18n component to the store to listen
  // locale change from the api setLocale()
  const EnhancedI18n = connect(state => ({
    lang: getLocale(state)
  }))(I18n)

  const barComponent = (
    <Provider store={data.reduxStore}>
      <EnhancedI18n dictRequire={lang => require(`locales/${lang}`)}>
        {cozyClient ? (
          <CozyProvider client={cozyClient}>
            <Bar {...data} />
          </CozyProvider>
        ) : (
          <Bar {...data} />
        )}
      </EnhancedI18n>
    </Provider>
  )

  render(barComponent, barNode)
  // for testing only
  return barComponent
}

// return an empty object by default to avoid checking existance
const getAppNodeDataSet = () => {
  const appNode = document.querySelector(APP_SELECTOR)
  if (!appNode || !appNode.dataset) return {}
  return appNode.dataset
}

const getDefaultStackURL = () => {
  const data = getAppNodeDataSet()
  if (!data.cozyDomain) {
    console.warn(
      `Cozy-bar can't discover the cozy's URL, and will probably fail to initialize the connection with the stack.`
    )
    return ''
  }
  return data.cozyDomain
}

const getDefaultToken = () => {
  const data = getAppNodeDataSet()
  if (!data.cozyToken) {
    console.warn(
      `Cozy-bar can't discover the app's token, and will probably fail to initialize the connection with the stack.`
    )
    return ''
  }
  return data.cozyToken
}

const getDefaultIcon = () => {
  const linkNode = document.querySelector('link[rel="icon"][sizes^="32"]')
  if (linkNode !== null) {
    return linkNode.getAttribute('href')
  } else {
    return 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
  }
}

const getAppNamePrefix = () => {
  const data = getAppNodeDataSet()
  return data.cozyAppNamePrefix || null
}

const getAppSlug = () => {
  const data = getAppNodeDataSet()
  return data.cozyAppSlug || null
}

const getUserActionRequired = () => {
  const meta = document.querySelector('meta[name=user-action-required]')
  const data = meta && meta.dataset
  if (data) {
    const { title, code, detail, links } = data
    if (code) {
      // we suppose that at least code will always exist
      return { title, code, detail, links }
    }
  }
  return undefined
}

let exposedAPI = {}

/**
 * Initializes the cozy bar
 *
 * It can be initialized either with a cozyClient instance
 * or a { cozyURL, ssl, token } tupple.
 *
 * @function
 * @param {Object}  arg
 * @param {string}  arg.appName    - App name to be displayed in the bar
 * @param {string}  arg.appNamePrefix
 * @param {string}  arg.lang       - Language for the bar
 * @param {string}  arg.iconPath   -
 * @param {Object}  arg.cozyClient - a cozy client instance
 * @param {string}  arg.cozyURL    - URL or domain of the stack
 * @param {boolean} arg.ssl        - Tells if we should use a secure
 *                                   protocol required if cozyURL does
 *                                   not have a protocol
 * @param {string}  arg.token      - Access token for the stack
 * @param {boolean} arg.replaceTitleOnMobile
 * @param {boolean} arg.isPublic
 * @param {Function} arg.onLogout
 */
const init = async ({
  appName,
  appNamePrefix = getAppNamePrefix(),
  appSlug = getAppSlug(),
  lang,
  iconPath = getDefaultIcon(),
  cozyClient,
  cozyURL = getDefaultStackURL(),
  token = getDefaultToken(),
  replaceTitleOnMobile = false,
  isPublic = false,
  onLogOut,
  ssl
} = {}) => {
  // Force public mode in `/public` URLs
  if (/^\/public/.test(window.location.pathname)) {
    isPublic = true
  }
  // store
  const getOrCreateStore = require('lib/store').default
  const reduxStore = getOrCreateStore()

  reduxStore.dispatch(setInfos(appName, appNamePrefix, appSlug))
  stack.init({
    cozyClient,
    cozyURL,
    token,
    onCreate: data => reduxStore.dispatch(onRealtimeCreate(data)),
    onDelete: data => reduxStore.dispatch(onRealtimeDelete(data)),
    ssl
  })
  if (lang) {
    reduxStore.dispatch(setLocale(lang))
  }

  // init api
  const api = require('lib/api/index').default
  // Assign all api methods to the bar object
  exposedAPI = api(reduxStore)

  return injectBarInDOM({
    appName,
    appNamePrefix,
    appSlug,
    cozyClient,
    iconPath,
    replaceTitleOnMobile,
    isPublic,
    onLogOut,
    userActionRequired: getUserActionRequired(),
    reduxStore
  })
}

const updateAccessToken = accessToken => {
  stack.updateAccessToken(accessToken)
}

// Handle exceptions for API before init
const showAPIError = name =>
  console.error(
    `You tried to use the CozyBar API (${name}) but the CozyBar is not initialised yet via cozy.bar.init(...).`
  )
// apiReferences will be a proxy to the API
const apiReferences = {}
APILocations.forEach(location => {
  const jsAPIName = getJsApiName(location)
  const reactAPIName = getReactApiName(location)
  apiReferences[jsAPIName] = value => {
    if (exposedAPI[jsAPIName]) {
      return exposedAPI[jsAPIName](value)
    } else {
      showAPIError(jsAPIName)
    }
  }
  apiReferences[reactAPIName] = props => {
    const React = require('react')
    if (exposedAPI[reactAPIName]) {
      return React.createElement(exposedAPI[reactAPIName], props)
    } else {
      showAPIError(reactAPIName)
    }
  }
})

// setLocale API
apiReferences.setLocale = (...args) => {
  if (exposedAPI.setLocale) {
    return exposedAPI.setLocale(...args)
  } else {
    showAPIError('setLocale')
  }
}

// setTheme API
apiReferences.setTheme = (...args) => {
  if (exposedAPI.setTheme) {
    return exposedAPI.setTheme(...args)
  } else {
    showAPIError('setTheme')
  }
}

apiReferences.openDrawer = () => {
  if (exposedAPI.openDrawer) {
    return exposedAPI.openDrawer()
  } else {
    showAPIError('openDrawer')
  }
}

module.exports = {
  init,
  version: __VERSION__,
  ...apiReferences,
  updateAccessToken
}
