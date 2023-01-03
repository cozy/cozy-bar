/* global __VERSION__ */

import { isMobileApp } from 'cozy-device-helper'
import { BreakpointsProvider } from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

import stack from 'lib/stack'
import {
  getLocale,
  onRealtimeCreate,
  onRealtimeDelete,
  setLocale,
  setInfos
} from 'lib/reducers'

import { createBarAPI, createBarProxiedAPI } from 'lib/api'

import {
  getAppNamePrefix,
  getAppSlug,
  getDefaultIcon,
  getDefaultStackURL,
  getDefaultToken,
  getUserActionRequired,
  APP_SELECTOR
} from './dom'

import enLocale from 'locales/en.json'
import frLocale from 'locales/fr.json'
import esLocale from 'locales/es.json'
const locales = {
  en: enLocale,
  fr: frLocale,
  es: esLocale
}

import BarComponent from './components/BarComponent'

const createBarElement = () => {
  const targetName = isMobileApp() ? 'mobile' : 'browser'
  const barNode = document.createElement('div')
  barNode.setAttribute('id', 'coz-bar')
  barNode.setAttribute('role', 'banner')
  barNode.classList.add(`coz-target--${targetName}`)
  return barNode
}

const injectBarInDOM = data => {
  if (document.getElementById('coz-bar') !== null) {
    return
  }

  const barNode = createBarElement()
  const appNode = document.querySelector(APP_SELECTOR)
  if (!appNode) {
    // eslint-disable-next-line no-console
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

  return barNode
}

const renderBar = (barNode, options) => {
  // import React related modules on init only
  const React = require('react')
  const { render } = require('react-dom')
  const { connect, Provider } = require('react-redux')
  const I18n = require('cozy-ui/transpiled/react/I18n').default
  const Bar = require('components/Bar').default
  const CozyProvider = require('cozy-client').CozyProvider

  const { cozyClient } = options

  // we connect the I18n component to the store to listen
  // locale change from the api setLocale()
  const EnhancedI18n = connect(state => ({
    lang: getLocale(state)
  }))(I18n)

  const barComponent = (
    <Provider store={options.reduxStore}>
      <EnhancedI18n dictRequire={lang => locales[lang]}>
        <BreakpointsProvider>
          {cozyClient ? (
            <CozyProvider client={cozyClient}>
              <Bar {...options} />
            </CozyProvider>
          ) : (
            <Bar {...options} />
          )}
        </BreakpointsProvider>
      </EnhancedI18n>
    </Provider>
  )

  render(barComponent, barNode)
  // for testing only
  return barComponent
}

const makeCozyClientAutomatically = ({ cozyURL, token, isPublic }) => {
  const ccURI = cozyURL || getDefaultStackURL(isPublic)
  const ccToken = token || getDefaultToken(isPublic)
  const ccOptions = {
    uri: ccURI,
    token: ccToken
  }

  const CozyClient = require('cozy-client').default

  // eslint-disable-next-line no-console
  console.warn('Automatically made cozyClient. Options: ', ccOptions)
  return new CozyClient(ccOptions)
}

let exposedAPI = {}

/**
 * Initializes the cozy bar
 *
 * It can be initialized either with a cozyClient instance
 *
 * @param {Object} options - Options
 * @param {string} options.appName - App name to be displayed in the bar
 * @param {string} options.appNamePrefix - App name prefix to be displayed in the bar
 * @param {string} options.appSlug - App slug to be displayed in the bar
 * @param {string} options.lang - Language for the bar
 * @param {string} options.iconPath - Icon path for the bar
 * @param {string} options.isInvertedTheme - For use Home icon with inverted color
 * @param {Object} options.cozyClient - a cozy client instance
 * @param {string} options.cozyURL - URL or domain of the stack
 * @param {string} options.token - Access token for the stack
 * @param {boolean} options.replaceTitleOnMobile - Replace title on mobile (default: false)
 * @param {boolean} options.isPublic - Is public (default: false)
 * @param {Function} options.onLogout - On logout callback
 * @example
 * import cozyBar from 'cozy-bar'
 * cozyBar.init({ appName: 'My awesome app', appNamePrefix: 'Cozy', lang: 'en', iconPath: 'icon.svg', cozyClient: client })
 */
const init = async ({
  appName,
  appNamePrefix = getAppNamePrefix(),
  appSlug = getAppSlug(),
  lang,
  iconPath = getDefaultIcon(),
  isInvertedTheme,
  cozyClient,
  cozyURL,
  token,
  replaceTitleOnMobile = false,
  isPublic = false,
  onLogOut
} = {}) => {
  // Force public mode in `/public` URLs
  if (!isPublic && /^\/public/.test(window.location.pathname)) {
    isPublic = true
  }

  if (!cozyClient) {
    cozyClient = makeCozyClientAutomatically({ cozyURL, token, isPublic })
  }

  // store
  const getOrCreateStore = require('lib/store').default
  const reduxStore = getOrCreateStore()

  reduxStore.dispatch(setInfos(appName, appNamePrefix, appSlug))
  stack.init({
    cozyClient,
    onCreate: data => reduxStore.dispatch(onRealtimeCreate(data)),
    onDelete: data => reduxStore.dispatch(onRealtimeDelete(data))
  })
  if (lang) {
    reduxStore.dispatch(setLocale(lang))
  }

  // Assign all api methods to the bar object
  const apiMethods = createBarAPI(reduxStore)
  Object.assign(exposedAPI, apiMethods)

  const options = {
    appName,
    isInvertedTheme,
    appNamePrefix,
    appSlug,
    cozyClient,
    iconPath,
    replaceTitleOnMobile,
    isPublic,
    onLogOut,
    userActionRequired: getUserActionRequired(),
    reduxStore
  }

  const barNode = injectBarInDOM(options)
  renderBar(barNode, options)
}

const updateAccessToken = accessToken => {
  stack.updateAccessToken(accessToken)
}

const proxiedAPI = createBarProxiedAPI(exposedAPI)

const {
  setBarCenter,
  setBarLeft,
  setBarRight,
  setBarSearch,
  BarCenter,
  BarRight,
  BarLeft,
  BarSearch,
  setTheme,
  setWebviewContext
} = proxiedAPI

const version = __VERSION__

export {
  init,
  version,
  setBarCenter,
  setBarLeft,
  setBarRight,
  setBarSearch,
  BarLeft,
  BarRight,
  BarCenter,
  BarSearch,
  setTheme,
  setWebviewContext,
  setLocale,
  updateAccessToken,
  BarComponent
}
