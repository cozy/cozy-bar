/* global __TARGET__, __VERSION__, __DEVELOPMENT__ */

'use strict'

import React from 'react'
import { render } from 'react-dom'

import I18n from 'cozy-ui/react/I18n'
import stack from './lib/stack'
import { getDefaultLang, setLocale } from './lib/locale'
import { getLocale } from './lib/reducers'

// For now we have two stores, the goal is to transfer everythin
// to the redux store
import BarStore, { Provider as BarProvider } from './lib/BarStore'
import { Provider as ReduxProvider } from 'react-redux'
import createStore from 'lib/store'

import Bar from './components/Bar'
import api from 'lib/api'

const APP_SELECTOR = '[role=application]'

if (__DEVELOPMENT__) {
  // Enables React dev tools for Preact
  // Cannot use import as we are in a condition
  require('preact/devtools')

  // Export React to window for the devtools
  window.React = React
}

// store
const barStore = new BarStore()
const reduxStore = createStore()

const createBarElement = () => {
  const barNode = document.createElement('div')
  barNode.setAttribute('id', 'coz-bar')
  barNode.setAttribute('role', 'banner')
  barNode.classList.add(`coz-target--${__TARGET__}`)
  return barNode
}

const injectBarInDOM = (data) => {
  if (document.getElementById('coz-bar') !== null) { return }

  require('./styles')

  const barNode = createBarElement()
  const appNode = document.querySelector(APP_SELECTOR)
  if (!appNode) {
    console.warn(`Cozy-bar is looking for a "${APP_SELECTOR}" tag that contains your application and can't find it :'(… The BAR is now disabled`)
    return null
  }

  document.body.insertBefore(barNode, appNode)

  // method to put cozy-bar z-index on the top when Drawer visible and vice versa
  data.onDrawer = (visible) => {
    barNode.dataset.drawerVisible = visible
  }

  render((
    <BarProvider store={barStore}>
      <ReduxProvider store={reduxStore}>
        <I18n
          lang={getLocale(reduxStore.getState())}
          dictRequire={(lang) => require(`./locales/${lang}`)}
        >
          <Bar {...data} />
        </I18n>
      </ReduxProvider>
    </BarProvider>
  ), barNode)
}

const getDefaultStackURL = () => {
  const appNode = document.querySelector(APP_SELECTOR)
  if (!appNode || !appNode.dataset.cozyDomain) {
    console.warn(`Cozy-bar can't discover the cozy's URL, and will probably fail to initialize the connection with the stack.`)
    return ''
  }
  return appNode.dataset.cozyDomain
}

const getDefaultToken = () => {
  const appNode = document.querySelector(APP_SELECTOR)
  if (!appNode || !appNode.dataset.cozyToken) {
    console.warn(`Cozy-bar can't discover the app's token, and will probably fail to initialize the connection with the stack.`)
    return ''
  }
  return appNode.dataset.cozyToken
}

const getEditor = () => {
  const appNode = document.querySelector(APP_SELECTOR)
  return appNode.dataset.cozyEditor || undefined
}

const getDefaultIcon = () => {
  const linkNode = document.querySelector('link[rel="icon"][sizes^="32"]')
  if (linkNode !== null) {
    return linkNode.getAttribute('href')
  } else {
    return 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
  }
}

const init = ({
  appName,
  appEditor = getEditor(),
  lang = getDefaultLang(),
  iconPath = getDefaultIcon(),
  cozyURL = getDefaultStackURL(),
  token = getDefaultToken(),
  replaceTitleOnMobile = false,
  displayOnMobile,
  isPublic = false
} = {}) => {
  // Force public mode in `/public` URLs
  if (/^\/public/.test(window.location.pathname)) {
    isPublic = true
  }

  if (displayOnMobile === undefined) {
    displayOnMobile = false
    if (__TARGET__ === 'mobile') console.warn('Deprecated: cozy-bar option `displayOnMobile` automatically set to `false`, but `true` will be the new default value in the next version. Please explicitly set the option to `false`.')
  }

  stack.init({cozyURL, token})
  reduxStore.dispatch(setLocale(lang))
  injectBarInDOM({appName, appEditor, iconPath, replaceTitleOnMobile, displayOnMobile, isPublic})
}

module.exports = { init, version: __VERSION__, ...api(reduxStore) }
