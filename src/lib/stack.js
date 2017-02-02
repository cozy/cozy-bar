/* eslint-env browser */
import 'babel-polyfill'

import { UnavailableStackException } from './exceptions'

module.exports = {
  get: {
    async apps () {
      try {
        const response = await fetch('http://cozy.local:8080/apps/')
        const data = await response.json()
        return data.data
      } catch (e) {
        throw new UnavailableStackException()
      }
    }
  }
}
