/* global __TARGET__ */
/* global __PIWIK_TRACKER_URL__  __PIWIK_SITEID__ __PIWIK_DIMENSION_ID_APP__ */

import React, { Component } from 'react'
import { translate } from '../lib/I18n'
import { shouldEnableTracking, getTracker, configureTracker } from 'cozy-ui/react/helpers/tracker'

import Drawer from './Drawer'
import Nav from './Nav'
import Claudy from './Claudy'
import SupportModal from './SupportModal'

class Bar extends Component {
  constructor (props, context) {
    super(props)
    this.store = context.store
    this.state = {
      enableClaudy: null, // no claudy by default
      fireClaudy: false, // true to fire claudy (used by the drawer)
      claudyOpened: false,
      drawerVisible: false,
      usageTracker: null,
      displaySupport: false
    }
    this.toggleSupport = this.toggleSupport.bind(this)
    this.toggleDrawer = this.toggleDrawer.bind(this)
  }

  async componentWillMount () {
    const enableClaudy = await this.store.shouldEnableClaudy()
    this.setState({ enableClaudy })
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

  toggleDrawer () {
    // don't allow to toggle the drawer if claudy opened or is opening
    if (this.state.claudyOpened || this.state.fireClaudy) return
    const drawerVisible = !this.state.drawerVisible
    // don't wait for transitionend if displaying
    if (drawerVisible) this.props.onDrawer(drawerVisible)
    this.setState({ drawerVisible })
  }

  toggleClaudy (isFromDrawer = false) {
    if (!this.state.enableClaudy) return
    const { usageTracker, claudyOpened } = this.state
    if (isFromDrawer && !claudyOpened) { // if opened from drawer
      // reset to toggle via the Claudy component
      return this.setState({fireClaudy: true})
    }
    if (this.state.fireClaudy) this.setState({fireClaudy: false})
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

  toggleSupport () {
    const { displaySupport } = this.state
    this.setState({displaySupport: !displaySupport})
  }

  renderCenter () {
    const { appName, appEditor, iconPath, t, replaceTitleOnMobile, lang } = this.props
    return <h1 lang={lang} className={`coz-bar-title ${replaceTitleOnMobile ? 'coz-bar-hide-sm' : ''}`}>
      <img className='coz-bar-hide-sm' src={iconPath} width='32' />
      {appEditor && <span className='coz-bar-hide-sm'>{appEditor}</span>}
      <strong>{appName}</strong>
      <sup className='coz-bar-hide-sm coz-bar-beta-status'>{t('beta')}</sup>
    </h1>
  }

  renderLeft () {
    const { t } = this.props
    return <button className='coz-bar-burger' onClick={this.toggleDrawer} data-icon='icon-apps'>
      <span className='coz-bar-hidden'>{t('drawer')}</span>
    </button>
  }

  renderRight() {
    const { usageTracker, claudyOpened,
      enableClaudy, fireClaudy, onDrawer, displayOnMobile, isPublic } = this.props
    const { drawerVisible } = this.store
    return (__TARGET__ !== 'mobile' || displayOnMobile) && !isPublic ? <div className='coz-bar-flex-container' key='nav'>
      <Drawer visible={drawerVisible} onClose={this.toggleDrawer} onClaudy={(enableClaudy && (() => this.toggleClaudy(true))) || false} isClaudyLoading={fireClaudy} drawerListener={() => onDrawer(this.state.drawerVisible)} toggleSupport={this.toggleSupport} />
      <Nav toggleSupport={this.toggleSupport} />
      {enableClaudy &&
        <Claudy
          usageTracker={usageTracker}
          fireClaudy={fireClaudy}
          onToggle={() => this.toggleClaudy(false)}
          opened={claudyOpened}
        />
      }
    </div> : null
  }

  render () {
    const { t } = this.props
    const { fireClaudy, displaySupport } = this.state
    return (
      <div className='coz-bar-container'>
        { this.renderLeft() }
        { this.renderCenter() }
        <hr className='coz-sep-flex' key='separator'/>
        { this.renderRight() }
        {displaySupport && <SupportModal onClose={this.toggleSupport} />}
      </div>
    )
  }
}

export default translate()(Bar)
