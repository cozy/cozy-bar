import React, { Component } from 'react'

import { translate } from 'cozy-ui/react/I18n'

import AppsList from './AppsList'
import Settings from './Settings'

const BUSY_DELAY = 450

class Nav extends Component {
  constructor (props, context) {
    super(props)
    this.barStore = context.barStore
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
    // handle click outside to close popups
  }

  componentDidMount () {
    document.body.addEventListener('click', this.onClickOutside)
  }

  componentWillUnmount () {
    document.body.removeEventListener('click', this.onClickOutside)
  }

  onClickOutside = event => {
    if (this.state.apps.busy ||
        this.state.apps.opened ||
        this.state.settings.busy ||
        this.state.settings.opened
    ) {
      // if it's not a cozy-bar nav popup, close the opened popup
      if (!this.rootRef.contains(event.target)) {
        this.setState({ // reset all
          apps: {busy: false, opened: false},
          settings: {busy: false, opened: false}
        })
      }
      event.stopPropagation()
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
        clearTimeout(busySpinner)
        this.setState({
          apps: {busy: false, opened: true}
        })
        break
      case 'settings':
        await this.barStore.fetchSettingsData()
        clearTimeout(busySpinner)
        this.setState({
          settings: {busy: false, opened: true}
        })
        break
    }
  }

  // data-tutorial attribute allows to be targeted in an application tutorial
  render () {
    const { t, toggleSupport, renewToken } = this.props
    const { apps, settings } = this.state
    const { settingsData } = this.barStore
    return (
      <nav className='coz-nav' ref={(ref) => { this.rootRef = ref }}>
        <ul>
          <li className='coz-nav-section'>
            <a
              onClick={() => this.toggleMenu('apps')}
              aria-controls='coz-nav-pop--apps' aria-busy={apps.busy}
              data-icon='icon-apps'
              data-tutorial='apps'
            >
              {t('menu.apps')}
            </a>
            <div className='coz-nav-pop coz-nav-pop--apps' id='coz-nav-pop--apps' aria-hidden={!apps.opened}>
              <AppsList wrappingLimit={4} renewToken={renewToken} />
            </div>
          </li>
          <li className='coz-nav-section'>
            <a
              onClick={() => this.toggleMenu('settings')}
              aria-controls='coz-nav-pop--settings' aria-busy={settings.busy}
              data-icon='icon-cog'
            >
              {t('menu.settings')}
            </a>
            <div className='coz-nav-pop coz-nav-pop--settings' id='coz-nav-pop--settings' aria-hidden={!settings.opened}>
              {settingsData &&
                <Settings
                  onLogOut={() => this.barStore.logout()}
                  toggleSupport={toggleSupport}
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
