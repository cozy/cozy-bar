'use strict'

import BarView from './views/bar'

const createElement = function CozyBarCreateElement () {
  const barNode = document.createElement('div')
  barNode.setAttribute('id', 'coz-bar')
  barNode.setAttribute('role', 'banner')

  return barNode
}

const injectDOM = function CozyBarInjectDOM ({lang, appName, iconPath}) {
  if (document.getElementById('coz-bar') !== null) { return }

  require('./styles/bar')

  const barNode = createElement()
  const appNode = document.querySelector('[role=application]')
  document.body.insertBefore(barNode, appNode)

  cozy.bar.__view__ = new BarView({
    target: barNode,
    data: {lang, appName, iconPath}
  })
}

const init = function CozyBarInit ({lang = document.documentElement.getAttribute('lang'), appName, iconPath}) {
  injectDOM({lang, appName, iconPath})
}

const Cozy = window.Cozy || class Cozy {}

Object.assign(Cozy.prototype, {
  bar: {
    init
  }
})

const cozy = window.cozy || new Cozy()

if ((typeof window) !== 'undefined' && window.cozy == null) {
  window.cozy = cozy
  window.Cozy = Cozy
}

export default cozy
export { Cozy }
