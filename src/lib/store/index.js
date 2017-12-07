/* global __TARGET__ */
let createReduxStore

if (__TARGET__ === 'mobile') {
  createReduxStore = require('./mobile').default
} else {
  createReduxStore = require('./browser').default
}

export default createReduxStore
