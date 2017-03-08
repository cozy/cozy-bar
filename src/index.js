/* global __TARGET__, __VERSION__ */

'use strict'

import 'babel-polyfill'

import i18n from './lib/i18n'
import stack from './lib/stack'

import BarView from './components/Bar'

const APP_SELECTOR = '[role=application]'

const createElement = function CozyBarCreateElement () {
  const barNode = document.createElement('div')
  barNode.setAttribute('id', 'coz-bar')
  barNode.setAttribute('role', 'banner')
  barNode.classList.add(`coz-target--${__TARGET__}`)

  return barNode
}

const injectDOM = function CozyBarInjectDOM (data) {
  if (document.getElementById('coz-bar') !== null) { return }

  require('./styles/index.css')

  const barNode = createElement()
  const appNode = document.querySelector(APP_SELECTOR)
  if (!appNode) {
    return console.warn(`Cozy-bar is looking for a "${APP_SELECTOR}" tag that contains your application and can't find it :'(… The BAR is now disabled`)
  }

  document.body.insertBefore(barNode, appNode)

  return new BarView({
    target: barNode,
    data
  })
}

const bindEvents = function CozyBarBindEvents () {
  this._clickOutsideListener = () => this.fire('clickOutside')
  document.body.addEventListener('click', this._clickOutsideListener)

  this._drawerObserver = this.observe('drawerVisible', drawerVisible => {
    document.querySelector('[role=banner]').dataset.drawerVisible = drawerVisible
  })
}

const unbindEvents = function CozyBarUnbindEvents () {
  document.body.removeEventListener('click', this._clickOutsideListener)
  this._drawerObserver.cancel()
}

const getDefaultStackURL = function GetDefaultCozyURL () {
  return document.querySelector('[role=application]').dataset.cozyDomain
}

const getDefaultToken = function GetDefaultToken () {
  return document.querySelector('[role=application]').dataset.cozyToken
}

const getDefaultLang = function GetDefaultLang () {
  return document.documentElement.getAttribute('lang') || 'en'
}

const getDefaultIcon = function GetDefaultIcon () {
  const linkNode = document.querySelector('link[rel="icon"][sizes^="32"]')
  if (linkNode !== null) {
    return linkNode.getAttribute('href')
  } else {
    return 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
  }
}

const init = function CozyBarInit ({
  lang = getDefaultLang(),
  appName,
  iconPath = getDefaultIcon(),
  cozyURL = getDefaultStackURL(),
  token = getDefaultToken()
} = {}) {
  i18n(lang)
  stack.init({cozyURL, token})
  const view = injectDOM({lang, appName, iconPath})

  if (view) {
    bindEvents.call(view)
    view.on('teardown', unbindEvents.bind(view))
  }
}

module.exports = { init, version: __VERSION__ }
