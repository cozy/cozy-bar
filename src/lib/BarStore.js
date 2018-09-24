/* global fetch */

import { Component } from 'react'
import PropTypes from 'prop-types'

import stack from '../lib/stack'
import { create as createIntent } from '../lib/intents'

import CLAUDY_ACTIONS from '../config/claudyActions'

export default class BarStore {
  constructor () {
    this.claudyActions = null
    this.settingsData = null
    // cache
    this.helpLink = ''
    this.settingsAppURL = ''
  }

  getClaudyIntent (data) {
    return createIntent(null, 'CLAUDY', 'io.cozy.settings', data)
  }

  getSupportIntent (data) {
    return createIntent(null, 'SUPPORT', 'io.cozy.settings', data)
  }

  shouldEnableClaudy () {
    if (this.contextNoExist) return Promise.resolve(null)
    if (this.claudyActions) return Promise.resolve(this.claudyActions)
    return stack.get.context()
      .then(context => {
        const contextActions = (context.data && context.data.attributes && context.data.attributes['claudy_actions']) || null
        if (!contextActions) return false
        // get an arrays of action
        const claudyActions = contextActions.map(slug => {
          if (CLAUDY_ACTIONS.hasOwnProperty(slug)) {
          // adding also the action slug
            return Object.assign({}, CLAUDY_ACTIONS[slug], { slug })
          }
        }).filter(action => action)
        return !!claudyActions.length
      })
      .catch(error => {
        if (error.status && error.status === 404) this.contextNoExist = true
        console.warn && console.warn(`Cozy-bar cannot fetch Claudy: ${error.message}`)
        return false
      })
  }

  getHelpLink () {
    if (this.contextNoExist) return Promise.resolve(null)
    if (this.helpLink) return Promise.resolve(this.helpLink)
    return stack.get.context()
      .then(context => {
        this.helpLink = (context.data && context.data.attributes && context.data.attributes['help_link']) || null
        return this.helpLink
      })
      .catch(error => {
        if (error.status && error.status === 404) this.contextNoExist = true
        console.warn && console.warn('Cannot get Cozy help link')
        return null
      })
  }

  getStorageData () {
    return stack.get.storageData()
      .catch(e => {
        console.warn && console.warn('Cannot get Cozy storage informations')
        return null
      })
  }

  getSettingsAppURL () {
    // If the `settings` app is available, it will used to add the links 'Profile' and 'Connected Devices'
    if (this.settingsAppURL) return Promise.resolve(this.settingsAppURL)
    return stack.get.settingsAppURL()
      .then(settingsAppURL => {
        this.settingsAppURL = settingsAppURL
        return this.settingsAppURL
      })
      .catch(e => {
        console.warn && console.warn('Settings app is unavailable, settings links are disabled')
        return null
      })
  }

  async fetchSettingsData () {
    const storageData = await this.getStorageData()
    const settingsAppURL = await this.getSettingsAppURL()
    const helpLink = await this.getHelpLink()
    this.settingsData = { storageData, settingsAppURL, helpLink }
  }

  async logout () {
    this.settingsAppURL = ''
    this.helpLink = ''
    this.settingsData = null

    try {
      await stack.logout()
    } catch (e) {
      console.warn('Error while logging out in the cozy-bar', e)
    }
  }
}

export class Provider extends Component {
  getChildContext () {
    return { barStore: this.store }
  }

  constructor (props, context) {
    super(props, context)
    this.store = props.store
  }

  render () {
    const { children } = this.props
    return (children && children[0]) || null
  }
}

Provider.childContextTypes = { barStore: PropTypes.object.isRequired }
