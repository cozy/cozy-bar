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

  require('./styles')

  const barNode = createElement()
  const appNode = document.querySelector(APP_SELECTOR)
  if (!appNode) {
    console.warn(`Cozy-bar is looking for a "${APP_SELECTOR}" tag that contains your application and can't find it :'(… The BAR is now disabled`)
    return null
  }

  document.body.insertBefore(barNode, appNode)
  return new BarView({
    target: barNode,
    data
  })
}

const bindEvents = function CozyBarBindEvents () {
  const body = document.body

  /** Fire a `clickOutside` event when clicking anywhere in the viewport */
  this._clickOutsideListener = () => this.fire('clickOutside')
  body.addEventListener('click', this._clickOutsideListener)

  if (__TARGET__ !== 'mobile') {
    const root = document.querySelector('[role=banner]')
    const aside = document.querySelector('.coz-drawer-wrapper aside')

    /**
     * Define update status helper, wrapped in a next frame to let the DOM
     * breathe
     */
    const updateVisibleStatus = () => {
      setTimeout(() => { root.dataset.drawerVisible = this.get('drawerVisible') }, 10)
    }

    const listener = () => {
      updateVisibleStatus()
      aside.removeEventListener('transitionend', listener)
    }

    /**
     * Set dataset attribute in mirror of drawerVisible state:
     * - immediately when switch to true
     * - after aside transition when switch to false
     */
    this._drawerVisibleObserver = this.observe('drawerVisible', drawerVisible => {
      if (drawerVisible) {
        updateVisibleStatus()
      } else {
        aside.addEventListener('transitionend', listener)
      }
    })

    /** Force default value update for drawerVisible */
    updateVisibleStatus()
  }
}

const unbindEvents = function CozyBarUnbindEvents () {
  const body = document.body

  body.removeEventListener('click', this._clickOutsideListener)

  if (__TARGET__ !== 'mobile') {
    this._drawerVisibleObserver.cancel()
  }
}

const getDefaultStackURL = function GetDefaultCozyURL () {
  const appNode = document.querySelector(APP_SELECTOR)
  if (!appNode) {
    console.warn(`Cozy-bar can't discover the cozy's URL, and will probably fail to initialize the connection with the stack.`)
    return ''
  }
  return appNode.dataset.cozyDomain
}

const getDefaultToken = function GetDefaultToken () {
  const appNode = document.querySelector(APP_SELECTOR)
  if (!appNode) {
    console.warn(`Cozy-bar can't discover the app's token, and will probably fail to initialize the connection with the stack.`)
    return ''
  }
  return appNode.dataset.cozyToken
}

const getDefaultLang = function GetDefaultLang () {
  return document.documentElement.getAttribute('lang') || 'en'
}

const getEditor = function GetEditor () {
  const appNode = document.querySelector(APP_SELECTOR)
  return appNode.dataset.cozyEditor || undefined
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
  appEditor = getEditor(),
  iconPath = getDefaultIcon(),
  cozyURL = getDefaultStackURL(),
  token = getDefaultToken(),
  replaceTitleOnMobile = false
} = {}) {
  i18n(lang)
  stack.init({cozyURL, token})
  const view = injectDOM({lang, appName, appEditor, iconPath, replaceTitleOnMobile})

  if (view) {
    bindEvents.call(view)
    view.on('teardown', unbindEvents.bind(view))
  }
}

module.exports = { init, version: __VERSION__ }
