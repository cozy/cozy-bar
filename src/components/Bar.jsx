import React, { Component } from 'react'
import { connect } from 'react-redux'

import { translate } from 'cozy-ui/transpiled/react/I18n'
import Icon from 'cozy-ui/transpiled/react/Icon'
import { isFlagshipApp } from 'cozy-device-helper'
import flag from 'cozy-flags'

import { ButtonCozyHome } from 'components/Apps/ButtonCozyHome'
import Banner from 'components/Banner'
import Drawer from 'components/Drawer'
import Settings from 'components/Settings'
import Apps from 'components/Apps'
import Claudy from 'components/Claudy'
import SupportModal from 'components/SupportModal'
import {
  getTheme,
  hasFetched,
  getContent,
  isCurrentApp,
  fetchApps,
  fetchContext,
  fetchSettingsData,
  shouldEnableClaudy,
  getWebviewContext
} from 'lib/reducers'

/* Generated with node_modules/.bin/svgr src/assets/sprites/icon-apps.svg */
function SvgIconApps(props) {
  return (
    <svg width={16} height={16} {...props}>
      <path
        d="M0 0h4v4H0V0zm0 6h4v4H0V6zm0 6h4v4H0v-4zM6 0h4v4H6V0zm0 6h4v4H6V6zm0 6h4v4H6v-4zm6-12h4v4h-4V0zm0 6h4v4h-4V6zm0 6h4v4h-4v-4z"
        fillRule="evenodd"
      />
    </svg>
  )
}

export class Bar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      claudyFired: false, // true to fire claudy (used by the drawer)
      claudyOpened: false,
      drawerVisible: false,
      supportDisplayed: false
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
    // don't allow to toggle the drawer if claudy opened or is opening
    if (this.state.claudyOpened || this.state.claudyFired) return
    const drawerVisible = !this.state.drawerVisible
    // don't wait for transitionend if displaying
    if (drawerVisible) this.props.onDrawer(drawerVisible)
    this.setState({ drawerVisible })
  }

  toggleClaudy = (isFromDrawer = false) => {
    if (!this.props.claudyEnabled) return
    const { claudyOpened } = this.state
    if (isFromDrawer && !claudyOpened) {
      // if opened from drawer
      // reset to toggle via the Claudy component
      return this.setState({ claudyFired: true })
    }
    if (this.state.claudyFired) this.setState({ claudyFired: false })
    this.setState({ claudyOpened: !claudyOpened })
  }

  toggleSupport = () => {
    const { supportDisplayed } = this.state
    this.setState({ supportDisplayed: !supportDisplayed })
  }

  renderCenter() {
    const { appName, appNamePrefix, appSlug, iconPath, isPublic } = this.props
    return (
      <Apps
        appName={appName}
        appNamePrefix={appNamePrefix}
        appSlug={appSlug}
        iconPath={iconPath}
        isPublic={isPublic}
      />
    )
  }

  renderLeft = () => {
    const { t, isPublic, webviewContext } = this.props

    if (isFlagshipApp() || flag('flagship.debug')) {
      return <ButtonCozyHome webviewContext={webviewContext} />
    }

    // data-tutorial attribute allows to be targeted in an application tutorial
    return !isPublic ? (
      <button
        type="button"
        className="coz-bar-btn coz-bar-burger"
        onClick={this.toggleDrawer}
        data-tutorial="apps-mobile"
      >
        <Icon icon={SvgIconApps} width={16} height={16} color="currentColor" />
        <span className="coz-bar-hidden">{t('drawer')}</span>
      </button>
    ) : null
  }

  renderRight = () => {
    const { isPublic } = this.props
    return !isPublic ? (
      <Settings
        toggleSupport={this.toggleSupport}
        onLogOut={this.props.onLogOut}
      />
    ) : null
  }

  render() {
    const {
      claudyFired,
      claudyOpened,
      drawerVisible,
      supportDisplayed
    } = this.state

    const {
      theme,
      themeOverrides,
      barLeft,
      barRight,
      barCenter,
      barSearch,
      claudyEnabled,
      onDrawer,
      isPublic,
      onLogOut,
      userActionRequired
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
          <div className="u-flex-grow">{barSearch}</div>
          {barRight || this.renderRight()}
          {!isPublic ? (
            <Drawer
              visible={drawerVisible}
              onClose={this.toggleDrawer}
              onClaudy={
                (claudyEnabled && (() => this.toggleClaudy(true))) || false
              }
              isClaudyLoading={claudyFired}
              drawerListener={() => onDrawer(drawerVisible)}
              toggleSupport={this.toggleSupport}
              onLogOut={onLogOut}
            />
          ) : null}
          {claudyEnabled && (
            <Claudy
              claudyFired={claudyFired}
              onToggle={() => this.toggleClaudy(false)}
              opened={claudyOpened}
            />
          )}
          {supportDisplayed && <SupportModal onClose={this.toggleSupport} />}
        </div>
        {userActionRequired && <Banner {...userActionRequired} />}
      </div>
    )
  }
}

export const mapStateToProps = state => ({
  theme: getTheme(state).name,
  themeOverrides: getTheme(state).overrides,
  barLeft: getContent(state, 'left'),
  barRight: getContent(state, 'right'),
  barCenter: getContent(state, 'center'),
  barSearch: getContent(state, 'search'),
  isDrive: isCurrentApp(state, { slug: 'drive' }),
  claudyEnabled: shouldEnableClaudy(state),
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
