import React, { Component } from 'react'
import { connect } from 'react-redux'

import { translate } from 'cozy-ui/react/I18n'
import { fetchApps } from 'lib/reducers'

import SettingsContent from './SettingsContent'

const BUSY_DELAY = 450

class Settings extends Component {
  constructor (props, context) {
    super(props)
    this.barStore = context.barStore
    this.state = {
      busy: false,
      opened: false
    }
    this.toggleMenu = this.toggleMenu.bind(this)
  }

  componentDidMount () {
    document.body.addEventListener('click', this.onClickOutside)
  }

  componentWillUnmount () {
    document.body.removeEventListener('click', this.onClickOutside)
  }

  onClickOutside = event => {
    if (this.state.busy || this.state.opened) {
      // if it's not a cozy-bar nav popup, close the opened popup
      if (!this.rootRef.contains(event.target)) {
        this.setState({busy: false, opened: false})
      }
      event.stopPropagation()
    }
  }

  async toggleMenu () {
    let stateUpdate = {busy: false, opened: false}
    // if popup already opened, stop here to close it
    if (this.state.opened) return this.setState(stateUpdate)
    this.setState(stateUpdate)
    // display the loading spinner after BUSY_DELAY secs
    const busySpinner =
      setTimeout(() => this.setState({busy: true}), BUSY_DELAY)
    // fetch data
    await this.barStore.fetchSettingsData()
    clearTimeout(busySpinner)
    this.setState({busy: false, opened: true})
  }

  // data-tutorial attribute allows to be targeted in an application tutorial
  render () {
    const { t, toggleSupport, onLogOut } = this.props
    const { busy, opened } = this.state
    const { settingsData } = this.barStore
    return (
      <nav className='coz-nav' ref={(ref) => { this.rootRef = ref }}>
        <ul>
          <li className='coz-nav-section'>
            <button
              onClick={() => this.toggleMenu()}
              aria-controls='coz-nav-pop--settings' aria-busy={busy}
              data-icon='icon-cog'
            >
              {t('menu.settings')}
            </button>
            <div className='coz-nav-pop coz-nav-pop--settings' id='coz-nav-pop--settings' aria-hidden={!opened}>
              {settingsData &&
                <SettingsContent
                  onLogOut={() => {
                    if (onLogOut && typeof onLogOut === 'function') {
                      onLogOut()
                    } else {
                      this.barStore.logout()
                    }
                  }}
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

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => ({
  fetchApps: () => dispatch(fetchApps())
})

export default connect(mapStateToProps, mapDispatchToProps)(translate()(Settings))
