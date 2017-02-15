/* eslint-env browser */
import 'babel-polyfill'

import { UnavailableStackException } from './exceptions'

// the option credentials:include tells fetch to include the cookies in the
// request even for cross-origin requests
const fetchOptions = {
  credentials: 'include'
}

module.exports = {
  get: {
    async apps () {
      try {
        const response = await fetch('http://cozy.local:8080/apps/', fetchOptions)
        const data = await response.json()
        return data.data
      } catch (e) {
        throw new UnavailableStackException()
      }
    },
    async diskUsage () {
      try {
        const response = await fetch('http://cozy.local:8080/settings/disk-usage', fetchOptions)
        const data = await response.json()
        return data.data
      } catch (e) {
        throw new UnavailableStackException()
      }
    }
  }
}
