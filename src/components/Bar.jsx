import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { translate } from 'cozy-ui/react/I18n'
import Icon from 'cozy-ui/react/Icon'
import { isFlagshipApp, isMobileApp } from 'cozy-device-helper'
import flag from 'cozy-flags'

import { ButtonCozyHome } from 'components/Apps/ButtonCozyHome'
import Banner from 'components/Banner'
import Drawer from 'components/Drawer'
import Settings from 'components/Settings'
import Apps from 'components/Apps'
import SearchBar from 'components/SearchBar'
import {
  getTheme,
  hasFetched,
  getContent,
  isCurrentApp,
  fetchApps,
  fetchContext,
  fetchSettingsData,
  getWebviewContext
} from 'lib/reducers'

import appsIcon from 'assets/sprites/icon-apps.svg'

export class Bar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      drawerVisible: false,
      searchBarEnabled:
        props.isDrive && !props.isPublic && !isMobileApp() && !isFlagshipApp()
    }
    this.fetchApps = this.fetchApps.bind(this)
    this.fetchInitialData = this.fetchInitialData.bind(this)
    this.handleTokenRefreshed = this.handleTokenRefreshed.bind(this)
  }

  componentDidMount() {
    this.fetchInitialData()

    const cozyClient = this.props.cozyClient
    cozyClient.on('tokenRefreshed', this.handleTokenRefreshed)
  }

  componentWillUnmount() {
    const cozyClient = this.props.cozyClient
    cozyClient.removeListener('tokenRefreshed', this.handleTokenRefreshed)
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      !this.props.hasFetchedApps &&
      this.state.drawerVisible &&
      prevState.drawerVisible !== this.state.drawerVisible
    ) {
      this.fetchApps()
    }
  }

  handleTokenRefreshed() {
    this.fetchInitialData()
  }

  fetchApps() {
    this.props.fetchApps()
  }

  fetchInitialData() {
    if (this.props.isPublic) {
      return
    }
    this.props.fetchContext()
    this.props.fetchSettingsData(false)
    this.fetchApps()
  }

  toggleDrawer = () => {
    const drawerVisible = !this.state.drawerVisible
    // don't wait for transitionend if displaying
    if (drawerVisible) this.props.onDrawer(drawerVisible)
    this.setState({ drawerVisible })
  }

  renderCenter() {
    const {
      appName,
      appNamePrefix,
      appSlug,
      iconPath,
      replaceTitleOnMobile,
      isPublic,
      isInvertedTheme
    } = this.props
    return (
      <Apps
        appName={appName}
        appNamePrefix={appNamePrefix}
        appSlug={appSlug}
        iconPath={iconPath}
        replaceTitleOnMobile={replaceTitleOnMobile}
        isPublic={isPublic}
        isInvertedTheme={isInvertedTheme}
      />
    )
  }

  renderLeft = () => {
    const { t, isPublic, webviewContext, isInvertedTheme } = this.props

    if (isFlagshipApp() || flag('flagship.debug')) {
      return (
        <ButtonCozyHome
          webviewContext={webviewContext}
          isInvertedTheme={isInvertedTheme}
        />
      )
    }

    // data-tutorial attribute allows to be targeted in an application tutorial
    return !isPublic ? (
      <button
        type="button"
        className="coz-bar-btn coz-bar-burger"
        onClick={this.toggleDrawer}
        data-tutorial="apps-mobile"
      >
        <Icon icon={appsIcon} width={16} height={16} color="currentColor" />
        <span className="coz-bar-hidden">{t('drawer')}</span>
      </button>
    ) : null
  }

  renderRight = () => {
    const { isPublic } = this.props
    return !isPublic ? (
      <Settings client={this.props.cozyClient} onLogOut={this.props.onLogOut} />
    ) : null
  }

  render() {
    const { drawerVisible, searchBarEnabled } = this.state

    const {
      theme,
      themeOverrides,
      barLeft,
      barRight,
      barCenter,
      barSearch,
      onDrawer,
      isPublic,
      onLogOut,
      userActionRequired,
      isInvertedTheme
    } = this.props

    const {
      primaryColor: pColor,
      primaryContrastTextColor: pctColor
    } = themeOverrides
    const pStyle = pColor ? { '--cozBarThemePrimaryColor': pColor } : {}
    const pctStyle = pctColor
      ? { '--cozBarThemePrimaryContrastTextColor': pctColor }
      : {}
    const themeStyle = { ...pStyle, ...pctStyle }

    return (
      <div className={`coz-bar-wrapper coz-theme-${theme}`} style={themeStyle}>
        <div id="cozy-bar-modal-dom-place" />
        <div className="coz-bar-container">
          {barLeft || this.renderLeft()}
          {barCenter || this.renderCenter()}
          <div className="u-flex-grow">
            {barSearch ||
              (searchBarEnabled ? (
                <SearchBar client={this.props.cozyClient} />
              ) : null)}
          </div>
          {barRight || this.renderRight()}
          {!isPublic ? (
            <Drawer
              visible={drawerVisible}
              onClose={this.toggleDrawer}
              drawerListener={() => onDrawer(drawerVisible)}
              onLogOut={onLogOut}
              isInvertedTheme={isInvertedTheme}
            />
          ) : null}
        </div>
        {userActionRequired && <Banner {...userActionRequired} />}
      </div>
    )
  }
}

Bar.propTypes = {
  appName: PropTypes.string,
  appNamePrefix: PropTypes.string,
  appSlug: PropTypes.string,
  iconPath: PropTypes.string,
  replaceTitleOnMobile: PropTypes.bool,
  isPublic: PropTypes.bool,
  isInvertedTheme: PropTypes.bool,
  onLogOut: PropTypes.func,
  onDrawer: PropTypes.func,
  userActionRequired: PropTypes.object,
  cozyClient: PropTypes.object.isRequired,
  isDrive: PropTypes.bool.isRequired,
  searchBarEnabled: PropTypes.bool
}

export const mapStateToProps = state => ({
  theme: getTheme(state).name,
  themeOverrides: getTheme(state).overrides,
  barLeft: getContent(state, 'left'),
  barRight: getContent(state, 'right'),
  barCenter: getContent(state, 'center'),
  barSearch: getContent(state, 'search'),
  isDrive: isCurrentApp(state, { slug: 'drive' }),
  hasFetchedApps: hasFetched(state),
  webviewContext: getWebviewContext(state)
})

export const mapDispatchToProps = dispatch => ({
  fetchApps: () => dispatch(fetchApps()),
  fetchContext: () => dispatch(fetchContext()),
  fetchSettingsData: displayBusy => dispatch(fetchSettingsData(displayBusy))
})

export default translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Bar)
)
