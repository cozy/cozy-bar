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
      claudyActions: null, // no claudy by defaul
      claudyOpened: false,
      drawerVisible: false,
      usageTracker: null
    }
    this.toggleDrawer = this.toggleDrawer.bind(this)
    this.toggleClaudy = this.toggleClaudy.bind(this)
  }

  async componentWillMount () {
    await this.store.fetchAppsList()
    const claudyActions = await this.store.getClaudyActions()
    this.setState({ claudyActions })
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
      trackerInstance.push(['disableHeartBeatTimer']) // undocumented, see https://github.com/piwik/piwik/blob/3.x-dev/js/piwik.js#L6544
      this.setState({ usageTracker: trackerInstance })
    }
  }

  toggleDrawer () {
    // don't allow to toggle the drawer if claudy opened
    if (this.state.claudyOpened) return
    const drawerVisible = !this.state.drawerVisible
    this.props.onDrawer(drawerVisible)
    this.setState({ drawerVisible })
  }

  toggleClaudy () {
    if (!this.state.claudyActions) return
    const { usageTracker, claudyOpened } = this.state
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
      isPublic } = this.props
    const { usageTracker, claudyOpened,
      claudyActions, drawerVisible } = this.state
    const { appsList } = this.store // for claudy
    return (
      <div class='coz-bar-container'>
        <h1 lang={lang} class={`coz-bar-title ${replaceTitleOnMobile ? 'coz-bar-hide-sm' : ''}`}>
          <img class='coz-bar-hide-sm' src={iconPath} width='32' />
          {appEditor && <span class='coz-bar-hide-sm'>{appEditor} </span>}
          <strong>{appName}</strong>
          <sup class='coz-bar-hide-sm coz-bar-beta-status'>{t('beta')}</sup>
        </h1>
        <hr class='coz-sep-flex' />
        {__TARGET__ !== 'mobile' && !isPublic &&
          <div class='coz-bar-flex-container'>
            <button class='coz-bar-burger' onClick={this.toggleDrawer} data-icon='icon-hamburger'>
              <span class='coz-bar-hidden'>{t('drawer')}</span>
            </button>
            <Drawer visible={drawerVisible} onClose={this.toggleDrawer} onClaudy={(claudyActions && this.toggleClaudy) || false} />
            <Nav />
            {claudyActions &&
              <Claudy
                config={claudyActions} usageTracker={usageTracker}
                onToggle={this.toggleClaudy} opened={claudyOpened} appsList={appsList}
              />
            }
          </div>
        }
      </div>
    )
  }
}

export default translate()(Bar)
