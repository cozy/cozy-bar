'use strict'

import i18n from './lib/i18n'

import BarView from './components/Bar'

const createElement = function CozyBarCreateElement () {
  const barNode = document.createElement('div')
  barNode.setAttribute('id', 'coz-bar')
  barNode.setAttribute('role', 'banner')

  return barNode
}

const injectDOM = function CozyBarInjectDOM ({lang, appName, iconPath}) {
  if (document.getElementById('coz-bar') !== null) { return }

  require('./styles/index.css')

  const barNode = createElement()
  const appNode = document.querySelector('[role=application]')
  document.body.insertBefore(barNode, appNode)

  bar.__view__ = new BarView({
    target: barNode,
    data: {lang, appName, iconPath}
  })
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

const init = function CozyBarInit ({lang = getDefaultLang(), appName, iconPath = getDefaultIcon()}) {
  i18n(lang)
  injectDOM({lang, appName, iconPath})
  document.body.addEventListener('click', () => {
    bar.__view__.fire('clickOutside')
  })
  console.debug('HELLO WORLD!')
}

const bar = { init }

module.exports = bar
