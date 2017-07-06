import React, { Component } from 'react'

import { translate } from 'cozy-ui/react/I18n'
import { getCategorizedItems } from '../lib/helpers'

import AppsList from './AppsList'
import Settings from './Settings'

const BUSY_DELAY = 450

class Nav extends Component {
  constructor (props, context) {
    super(props)
    this.store = context.store
    this.state = {
      apps: {
        busy: false,
        opened: false
      },
      settings: {
        busy: false,
        opened: false
      }
    }
  }

  async toggleMenu (slug) {
    let stateUpdate = { // reset all
      apps: {busy: false, opened: false},
      settings: {busy: false, opened: false}
    }
    // if popup already opened, stop here to close it
    if (this.state[slug].opened) return this.setState(stateUpdate)
    this.setState(stateUpdate)
    // display the loading spinner after BUSY_DELAY secs
    const busySpinner =
      setTimeout(() => this.setState({ [slug]: {busy: true} }), BUSY_DELAY)
    // fetch data
    switch (slug) {
      case 'apps':
        await this.store.fetchAppsList()
        clearTimeout(busySpinner)
        this.setState({
          apps: {busy: false, opened: true}
        })
        break
      case 'settings':
        await this.store.fetchSettingsData()
        clearTimeout(busySpinner)
        this.setState({
          settings: {busy: false, opened: true}
        })
        break
    }
  }

  render () {
    const { t } = this.props
    const { apps, settings } = this.state
    const { appsList, settingsData } = this.store
    const categories = getCategorizedItems(appsList, t)
    return (
      <nav class='coz-nav'>
        <ul>
          <li class='coz-nav-section'>
            <a
              onClick={() => this.toggleMenu('apps')}
              aria-controls='coz-nav-pop--apps' aria-busy={apps.busy}
              data-icon='icon-cube'
            >
              {t('menu.apps')}
            </a>
            <div class='coz-nav-pop coz-nav-pop--apps' id='coz-nav-pop--apps' aria-hidden={!apps.opened}>
              <AppsList categories={categories} wrappingLimit={4} />
            </div>
          </li>
          <li class='coz-nav-section'>
            <a
              onClick={() => this.toggleMenu('settings')}
              aria-controls='coz-nav-pop--settings' aria-busy={settings.busy}
              data-icon='icon-cog'
            >
              {t('menu.settings')}
            </a>
            <div class='coz-nav-pop coz-nav-pop--settings' id='coz-nav-pop--settings' aria-hidden={!settings.opened}>
              {settingsData &&
                <Settings
                  onLogOut={() => this.store.logout()}
                  settingsData={settingsData}
                />
              }
            </div>
          </li>
        </ul>
      </nav>
    )
  }
}

export default translate()(Nav)
