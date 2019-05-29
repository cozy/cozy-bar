import React, { Component } from 'react'
import { connect } from 'react-redux'

import { translate } from 'cozy-ui/react/I18n'
import { Button } from 'cozy-ui/react/Button'

import SettingsContent from 'components/Settings/SettingsContent'
import {
  fetchSettingsData,
  getStorageData,
  getSettingsAppURL,
  isFetchingSettings,
  isSettingsBusy,
  logOut
} from 'lib/reducers'

class Settings extends Component {
  constructor(props) {
    super(props)
    this.state = {
      opened: false
    }
  }

  componentDidMount() {
    document.body.addEventListener('click', this.onClickOutside)
  }

  componentWillUnmount() {
    document.body.removeEventListener('click', this.onClickOutside)
  }

  onClickOutside = event => {
    if (this.props.isFetching || this.state.opened) {
      // if it's not a cozy-bar nav popup, close the opened popup
      if (!this.rootRef.contains(event.target)) {
        this.setState({ opened: false })
        event.stopPropagation()
      }
    }
  }

  toggleMenu = () => {
    let stateUpdate = { opened: false }
    // if popup already opened, stop here to close it
    if (this.state.opened) return this.setState(stateUpdate)
    // fetch data
    this.props.fetchSettingsData()
    this.setState({ opened: true })
  }

  render() {
    const {
      isBusy,
      isFetching,
      logOut,
      onLogOut,
      settingsAppURL,
      storageData,
      t,
      toggleSupport
    } = this.props
    const { opened } = this.state
    const openMenu = opened && !isFetching
    return (
      <div
        className="coz-nav coz-nav-settings"
        ref={ref => {
          this.rootRef = ref
        }}
      >
        <Button
          type="button"
          theme="text"
          onClick={this.toggleMenu}
          className="coz-nav-settings-btn"
          aria-controls="coz-nav-pop--settings"
          busy={isBusy}
          icon="gear"
          label={t('menu.settings')}
        />
        <div
          className="coz-nav-pop coz-nav-pop--settings"
          id="coz-nav-pop--settings"
          aria-hidden={!openMenu}
        >
          {!isFetching && (
            <SettingsContent
              onLogOut={() => {
                if (onLogOut && typeof onLogOut === 'function') {
                  onLogOut()
                } else {
                  logOut()
                }
              }}
              toggleSupport={toggleSupport}
              storageData={storageData}
              settingsAppURL={settingsAppURL}
            />
          )}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  storageData: getStorageData(state),
  settingsAppURL: getSettingsAppURL(state),
  isBusy: isSettingsBusy(state),
  isFetching: isFetchingSettings(state)
})

const mapDispatchToProps = dispatch => ({
  fetchSettingsData: () => dispatch(fetchSettingsData()),
  logOut: () => dispatch(logOut())
})

export default translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Settings)
)
