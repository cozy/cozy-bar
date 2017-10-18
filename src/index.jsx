/* global __TARGET__, __VERSION__, __DEVELOPMENT__ */

'use strict'

import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'

import { I18n } from './lib/I18n'
import stack from './lib/stack'
import BarStore, { Provider } from './lib/BarStore'

import Bar from './components/Bar'

const APP_SELECTOR = '[role=application]'

if (__DEVELOPMENT__) {
  // Enables React dev tools for Preact
  // Cannot use import as we are in a condition
  require('preact/devtools')

  // Export React to window for the devtools
  window.React = React
}

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
  // store
  const store = new BarStore()

  // method to put cozy-bar z-index on the top when Drawer visible and vice versa
  data.onDrawer = (visible) => {
    barNode.dataset.drawerVisible = visible
  }

  render((
    <Provider store={store}>
      <I18n
        lang={data.lang}
        dictRequire={(lang) => require(`./locales/${lang}`)}
      >
        <Bar {...data} />
      </I18n>
    </Provider>
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

const getDefaultLang = () => {
  return document.documentElement.getAttribute('lang') || 'en'
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
  lang = getDefaultLang(),
  appName,
  appEditor = getEditor(),
  iconPath = getDefaultIcon(),
  cozyURL = getDefaultStackURL(),
  token = getDefaultToken(),
  replaceTitleOnMobile = false,
  displayOnMobile = false,
  isPublic = false
} = {}) => {
  // Force public mode in `/public` URLs
  if (/^\/public/.test(window.location.pathname)) {
    isPublic = true
  }

  stack.init({cozyURL, token})
  injectBarInDOM({lang, appName, appEditor, iconPath, replaceTitleOnMobile, displayOnMobile, isPublic})
}

module.exports = { init, version: __VERSION__ }
