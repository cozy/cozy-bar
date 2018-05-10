/* global __TARGET__ */
/* global __PIWIK_TRACKER_URL__  __PIWIK_SITEID__ __PIWIK_DIMENSION_ID_APP__ */

import 'core-js/modules/es6.object.assign'
import React, { Component } from 'react'
import { connect } from 'react-redux'

import { translate } from 'cozy-ui/react/I18n'
import { shouldEnableTracking, getTracker, configureTracker } from 'cozy-ui/react/helpers/tracker'

import Banner from 'components/Banner'
import Drawer from 'components/Drawer'
import Nav from 'components/Nav'
import SearchBar from 'components/SearchBar'
import Claudy from 'components/Claudy'
import SupportModal from 'components/SupportModal'
import ComingSoonModal from 'components/ComingSoonModal'
import { getContent, getCurrentApp } from 'lib/reducers'

class Bar extends Component {
  constructor (props, context) {
    super(props)
    this.store = context.barStore
    this.state = {
      claudyEnabled: null, // no claudy by default
      claudyFired: false, // true to fire claudy (used by the drawer)
      claudyOpened: false,
      drawerVisible: false,
      usageTracker: null,
      supportDisplayed: false,
      comingSoonToDisplay: null,
      searchBarEnabled: props.currentApp === 'Cozy Drive' && !props.isPublic
    }
  }

  async componentWillMount () {
    const claudyEnabled = await this.store.shouldEnableClaudy()
    this.setState({ claudyEnabled })
  }

  componentDidMount () {
    // if tracking enabled, init the piwik tracker
    if (shouldEnableTracking()) {
      const trackerInstance = getTracker(__PIWIK_TRACKER_URL__, __PIWIK_SITEID__, false, false)
      configureTracker({
        appDimensionId: __PIWIK_DIMENSION_ID_APP__,
        app: 'Cozy Bar',
        heartbeat: 0
      })
      this.setState({ usageTracker: trackerInstance })
    }
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
    if (!this.state.claudyEnabled) return
    const { usageTracker, claudyOpened } = this.state
    if (isFromDrawer && !claudyOpened) { // if opened from drawer
      // reset to toggle via the Claudy component
      return this.setState({claudyFired: true})
    }
    if (this.state.claudyFired) this.setState({claudyFired: false})
    if (usageTracker) {
      usageTracker.push([
        'trackEvent',
        'Claudy',
        claudyOpened ? 'close' : 'open',
        'claudy'
      ])
    }
    this.setState({ claudyOpened: !claudyOpened })
  }

  toggleSupport = () => {
    const { supportDisplayed } = this.state
    this.setState({supportDisplayed: !supportDisplayed})
  }

  toggleComingSoon = (slug) => {
    this.setState((state, props) => ({
      comingSoonToDisplay: state.comingSoonToDisplay ? null : slug
    }))
  }

  renderCenter () {
    const { appName, appNamePrefix, iconPath, replaceTitleOnMobile, lang } = this.props
    return (
      <h1 lang={lang} className={`coz-bar-title ${replaceTitleOnMobile ? 'coz-bar-hide-sm' : ''}`}>
        <img className='coz-bar-hide-sm' src={iconPath} width='32' />
        {appNamePrefix && <span className='coz-bar-hide-sm'>{appNamePrefix}</span>}
        <strong>{appName}</strong>
      </h1>
    )
  }

  renderLeft = () => {
    const { t, displayOnMobile, isPublic } = this.props
    // data-tutorial attribute allows to be targeted in an application tutorial
    return (__TARGET__ !== 'mobile' || displayOnMobile) && !isPublic ? <button className='coz-bar-btn coz-bar-burger' onClick={this.toggleDrawer} data-icon='icon-apps' data-tutorial='apps-mobile'>
      <span className='coz-bar-hidden'>{t('drawer')}</span>
    </button> : null
  }

  renderRight = () => {
    const { displayOnMobile, isPublic, renewToken } = this.props
    return (__TARGET__ !== 'mobile' || displayOnMobile) && !isPublic
      ? <Nav
        toggleSupport={this.toggleSupport}
        toggleComingSoon={this.toggleComingSoon}
        renewToken={renewToken}
        onLogOut={this.props.onLogOut}
      />
      : null
  }

  render () {
    const {
      claudyEnabled,
      claudyFired,
      claudyOpened,
      drawerVisible,
      searchBarEnabled,
      supportDisplayed,
      comingSoonToDisplay,
      usageTracker
    } = this.state
    const { barLeft, barRight, barCenter, onDrawer, displayOnMobile, isPublic, renewToken, onLogOut, userActionRequired } = this.props
    return (
      <div className='coz-bar-wrapper'>
        <div className='coz-bar-container'>
          { barLeft || this.renderLeft() }
          { barCenter || this.renderCenter() }
          <div className='u-flex-grow'>
            { searchBarEnabled ? <SearchBar /> : null }
          </div>
          { barRight || this.renderRight() }
          { (__TARGET__ !== 'mobile' || displayOnMobile) && !isPublic
            ? <Drawer visible={drawerVisible}
              onClose={this.toggleDrawer}
              onClaudy={(claudyEnabled && (() => this.toggleClaudy(true))) || false}
              isClaudyLoading={claudyFired}
              drawerListener={() => onDrawer(this.state.drawerVisible)}
              renewToken={renewToken}
              toggleSupport={this.toggleSupport}
              toggleComingSoon={this.toggleComingSoon}
              onLogOut={onLogOut} /> : null }
          { claudyEnabled &&
            <Claudy
              usageTracker={usageTracker}
              claudyFired={claudyFired}
              onToggle={() => this.toggleClaudy(false)}
              opened={claudyOpened}
            /> }
          { supportDisplayed &&
            <SupportModal onClose={this.toggleSupport} /> }
          { comingSoonToDisplay &&
            <ComingSoonModal
              onClose={this.toggleComingSoon}
              appSlug={comingSoonToDisplay}
            /> }
        </div>
        {userActionRequired &&
          <Banner {...userActionRequired} />
        }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  barLeft: getContent(state, 'left'),
  barRight: getContent(state, 'right'),
  barCenter: getContent(state, 'center'),
  currentApp: getCurrentApp(state)
})

export default translate()(connect(mapStateToProps)(Bar))
