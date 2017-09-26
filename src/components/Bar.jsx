/* global __TARGET__ */
/* global __PIWIK_TRACKER_URL__  __PIWIK_SITEID__ __PIWIK_DIMENSION_ID_APP__ */

import React, { Component } from 'react'
import { translate } from '../lib/I18n'
import { shouldEnableTracking, getTracker, configureTracker } from 'cozy-ui/react/helpers/tracker'

import Drawer from './Drawer'
import Nav from './Nav'
import Claudy from './Claudy'

class Bar extends Component {
  constructor (props, context) {
    super(props)
    this.store = context.store
    this.state = {
      enableClaudy: null, // no claudy by default
      fireClaudy: false, // true to fire claudy (used by the drawer)
      claudyOpened: false,
      drawerVisible: false,
      usageTracker: null
    }
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

  render () {
    const { t, lang, appName,
      appEditor, iconPath, replaceTitleOnMobile,
      onDrawer, isPublic } = this.props
    const { usageTracker, claudyOpened,
      enableClaudy, drawerVisible, fireClaudy } = this.state
    return (
      <div class='coz-bar-container'>
        <h1 lang={lang} class={`coz-bar-title ${replaceTitleOnMobile ? 'coz-bar-hide-sm' : ''}`}>
          <img class='coz-bar-hide-sm' src={iconPath} width='32' />
          {appEditor && <span class='coz-bar-hide-sm'>{appEditor} </span>}
          <strong>{appName}</strong>
          <sup class='coz-bar-hide-sm coz-bar-beta-status'>{t('beta')}</sup>
        </h1>
        {__TARGET__ !== 'mobile' && !isPublic &&
          <div class='coz-bar-flex-container'>
            <button class='coz-bar-burger' onClick={this.toggleDrawer} data-icon='icon-hamburger'>
              <span class='coz-bar-hidden'>{t('drawer')}</span>
            </button>
            <Drawer visible={drawerVisible} onClose={this.toggleDrawer} onClaudy={(enableClaudy && (() => this.toggleClaudy(true))) || false} isClaudyLoading={fireClaudy} drawerListener={() => onDrawer(this.state.drawerVisible)} />
            <Nav />
            {enableClaudy &&
              <Claudy
                usageTracker={usageTracker}
                fireClaudy={fireClaudy}
                onToggle={() => this.toggleClaudy(false)}
                opened={claudyOpened}
              />
            }
          </div>
        }
      </div>
    )
  }
}

export default translate()(Bar)
