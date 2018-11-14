/* global __TARGET__, __VERSION__ */

'use strict'

import stack from './lib/stack'
import {
  deleteApp,
  getLocale,
  receiveApp,
  setLocale,
  setInfos
} from './lib/reducers'

import {
  locations as APILocations,
  getJsApiName,
  getReactApiName
} from 'lib/api/helpers'

require('./styles')
require('./lib/importIcons')

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
  const Bar = require('./components/Bar').default

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
      <EnhancedI18n dictRequire={lang => require(`./locales/${lang}`)}>
        <Bar {...data} />
      </EnhancedI18n>
    </Provider>
  )

  render(barComponent, barNode)
  // for testing only
  return barComponent
}

const getDefaultStackURL = () => {
  const appNode = document.querySelector(APP_SELECTOR)
  if (!appNode || !appNode.dataset.cozyDomain) {
    console.warn(
      `Cozy-bar can't discover the cozy's URL, and will probably fail to initialize the connection with the stack.`
    )
    return ''
  }
  return appNode.dataset.cozyDomain
}

const getDefaultToken = () => {
  const appNode = document.querySelector(APP_SELECTOR)
  if (!appNode || !appNode.dataset.cozyToken) {
    console.warn(
      `Cozy-bar can't discover the app's token, and will probably fail to initialize the connection with the stack.`
    )
    return ''
  }
  return appNode.dataset.cozyToken
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
  const appNode = document.querySelector(APP_SELECTOR)
  return appNode.dataset.cozyAppNamePrefix || null
}

const getAppSlug = () => {
  const appNode = document.querySelector(APP_SELECTOR)
  return appNode.dataset.cozyAppSlug
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

const determineSSL = (ssl, cozyURL) => {
  if (typeof ssl !== 'undefined') return ssl

  let parsedURL
  try {
    parsedURL = new URL(cozyURL)
    return parsedURL.protocol === 'https:'
  } catch (error) {
    console.warn(
      `cozyURL parameter passed to Cozy-bar is not a valid URL (${
        error.message
      }). Cozy-bar will rely on window.location to detect SSL.`
    )
  }

  if (window && window.location && window.location.protocol) {
    return window.location.protocol === 'https:'
  }

  console.warn('Cozy-bar cannot detect SSL and will use default value (true)')
  return true
}

let exposedAPI = {}

const init = async ({
  appName,
  appNamePrefix = getAppNamePrefix(),
  appSlug = getAppSlug(),
  lang,
  iconPath = getDefaultIcon(),
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
  const createReduxStore = require('lib/store').default
  const reduxStore = createReduxStore()

  reduxStore.dispatch(setInfos(appName, appNamePrefix, appSlug))
  stack.init({
    cozyURL,
    token,
    onCreateApp: app => reduxStore.dispatch(receiveApp(app)),
    onDeleteApp: app => reduxStore.dispatch(deleteApp(app)),
    ssl: determineSSL(ssl, cozyURL)
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
const apiReferences = {}
APILocations.forEach(location => {
  apiReferences[getJsApiName(location)] = value => {
    if (exposedAPI[getJsApiName(location)]) {
      return exposedAPI[getJsApiName(location)](value)
    } else {
      console.error(
        `You tried to use the CozyBar API (${getJsApiName(
          location
        )}) but the CozyBar is not initialised yet via cozy.bar.init(...).`
      )
    }
  }
  apiReferences[getReactApiName(location)] = props => {
    const React = require('react')
    if (exposedAPI[getReactApiName(location)]) {
      return React.createElement(exposedAPI[getReactApiName(location)], props)
    } else {
      console.error(
        `You tried to use the CozyBar API (${getReactApiName(
          location
        )}) but the CozyBar is not initialised yet via cozy.bar.init(...).`
      )
    }
  }
})

module.exports = {
  init,
  version: __VERSION__,
  ...apiReferences,
  updateAccessToken
}
