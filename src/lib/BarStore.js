
/* global fetch */

import { Component } from 'react'
import stack from '../lib/stack'

import CLAUDY_ACTIONS from '../config/claudyActions'

const EXCLUDES = ['settings', 'onboarding']
const CATEGORIES = ['cozy', 'partners', 'ptnb']

export default class BarStore {
  constructor () {
    this.claudyActions = null
    this.installedApps = [] // to cache already fetched apps icons
    this.appsList = [] // all apps, coming soons included
    this.helpLink = ''
    this.settingsAppURL = null
    this.settingsData = {}
  }

  async fetchApps () {
    let apps
    try {
      apps = await Promise.all((await stack.get.apps())
      .filter(app => !EXCLUDES.includes(app.attributes.slug))
      .map(async app => {
        const oldApp = this.installedApps.find(item => item.slug === app.attributes.slug)
        let icon

        if (oldApp && oldApp.icon.cached) {
          icon = oldApp.icon
        } else {
          icon = {
            src: await stack.get.icon(app.links.icon),
            cached: true
          }
        }

        return {
          editor: app.attributes.editor,
          name: app.attributes.name,
          slug: app.attributes.slug,
          href: app.links.related,
          category: CATEGORIES.includes(app.attributes.category) ? app.attributes.category : 'others',
          icon
        }
      }))
      this.installedApps = apps
    } catch (e) {
      apps = [{error: e}]
    }
    return apps
  }

  fetchComingSoonApps () {
    return stack.get.context()
    .then(context => {
      const comingSoonApps = (context.data && context.data.attributes &&
      context.data.attributes['coming_soon'] &&
      Object.values(context.data.attributes['coming_soon'])) || []

      return comingSoonApps.map(app => {
        let icon

        try {
          icon = app.slug && {
            cached: true,
            src: require(`../assets/icons/comingsoon/icon-${app.slug}.svg`)
          }
        } catch (error) {
          console.warn && console.warn(`Cannot retrieve icon for app ${app.name}:`, error.message)
        }

        return Object.assign({}, app, {
          comingSoon: true,
          icon: icon
        })
      })
    })
    .catch(error => {
      console.warn && console.warn(`Cozy-bar cannot fetch comming soon apps: ${error.message}`)
      return []
    })
  }

  async fetchAppsList () {
    const apps = await this.fetchApps()
    const comingSoonApps = await this.fetchComingSoonApps()
    this.appsList = apps.concat(comingSoonApps)
    return this.appsList
  }

  getClaudyActions () {
    if (this.claudyActions) return Promise.resolve(this.claudyActions)
    return stack.get.context()
    .then(context => {
      const contextActions = (context.data && context.data.attributes && context.data.attributes['claudy_actions']) || null
      if (!contextActions) return null
      // get an arrays of action
      const claudyActions = contextActions.map(slug => {
        if (CLAUDY_ACTIONS.hasOwnProperty(slug)) {
          // adding also the action slug
          return Object.assign({}, CLAUDY_ACTIONS[slug], { slug })
        }
      }).filter(action => action)
      this.claudyActions = claudyActions
      return {
        actions: claudyActions
      }
    })
    .catch(error => {
      console.warn && console.warn(`Cozy-bar cannot fetch Claudy: ${error.message}`)
      return null
    })
  }

  getHelpLink () {
    if (this.helpLink) return Promise.resolve(this.helpLink)
    return stack.get.context()
      .then(context => {
        this.helpLink = (context.data && context.data.attributes && context.data.attributes['help_link']) || null
        return this.helpLink
      })
  }

  getStorageStats () {
    return stack.get.storageStats()
      .then(statsObject => statsObject)
      .catch(e => { return {error: e.name} })
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
        console.warn('Settings app is unavailable, settings links are disabled')
        return null
      })
  }

  async fetchSettingsData () {
    this.settingsData = {
      storageStats: await this.getStorageStats(),
      settingsAppURL: await this.getSettingsAppURL(),
      helpLink: await this.getHelpLink()
    }
  }

  logout () {
    stack.logout()
  }
}

export class Provider extends Component {
  getChildContext () {
    return { store: this.store }
  }

  constructor (props, context) {
    super(props, context)
    this.store = props.store
  }

  render ({children}) {
    return (children && children[0]) || null
  }
}
