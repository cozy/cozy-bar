/* global __VERSION__ */

import React from 'react'
import { render } from 'react-dom'
import { connect, Provider } from 'react-redux'

import { isMobileApp } from 'cozy-device-helper'
import I18n from 'cozy-ui/transpiled/react/I18n'
import { CozyProvider } from 'cozy-client'

import Bar from 'components/Bar'

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
import 'styles/index.styl'
import 'lib/importIcons'

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
  const { cozyClient } = options

  // we connect the I18n component to the store to listen
  // locale change from the api setLocale()
  const EnhancedI18n = connect(state => ({
    lang: getLocale(state)
  }))(I18n)

  const barComponent = (
    <Provider store={options.reduxStore}>
      <EnhancedI18n dictRequire={lang => require(`locales/${lang}`)}>
        {cozyClient ? (
          <CozyProvider client={cozyClient}>
            <Bar {...options} />
          </CozyProvider>
        ) : (
          <Bar {...options} />
        )}
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
 * or a { cozyURL, ssl, token } tupple.
 *
 * @function
 * @param {Object}  options
 * @param {string}  options.appName    - App name to be displayed in the bar
 * @param {string}  options.appNamePrefix
 * @param {string}  options.lang       - Language for the bar
 * @param {string}  options.iconPath   -
 * @param {Object}  options.cozyClient - a cozy client instance
 * @param {string}  options.cozyURL    - URL or domain of the stack
 * @param {boolean} options.ssl        - Tells if we should use a secure
 *                                   protocol required if cozyURL does
 *                                   not have a protocol
 * @param {string}  arg.token      - Access token for the stack
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
  setTheme
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
  setLocale,
  updateAccessToken
}
