/* eslint-env browser */
/* global __SERVER__ */

import 'babel-polyfill'

import {
  UnavailableStackException,
  UnavailableSettingsException
} from './exceptions'

// the option credentials:include tells fetch to include the cookies in the
// request even for cross-origin requests
const fetchOptions = {
  credentials: 'include'
}

let COZY_URL = __SERVER__

async function getApps () {
  try {
    const response = await fetch(`${COZY_URL}/apps/`, fetchOptions)
    const data = await response.json()
    return data.data
  } catch (e) {
    throw new UnavailableStackException()
  }
}

async function getDiskUsage () {
  try {
    const response = await fetch(`${COZY_URL}/settings/disk-usage`, fetchOptions)
    const data = await response.json()
    return data.data
  } catch (e) {
    throw new UnavailableStackException()
  }
}

async function getApp (slug) {
  return (await getApps()).find(item => item.attributes.slug === slug)
}

async function hasApp (slug) {
  return !!getApp(slug)
}

module.exports = {
  init ({cozyURL}) {
    COZY_URL = `//${cozyURL}`
  },
  has: {
    async settings () {
      return await hasApp('settings')
    }
  },
  get: {
    app: getApp,
    apps: getApps,
    diskUsage: getDiskUsage,
    cozyURL () {
      return COZY_URL
    },
    async settingsBaseURI () {
      const settings = await getApp('settings')
      if (!settings) {
        throw new UnavailableSettingsException()
      }
      return settings ? settings.links.related : false
    }
  }
}
