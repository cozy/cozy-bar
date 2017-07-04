/* global __TARGET__ */
/* global __PIWIK_TRACKER_URL__  __PIWIK_SITEID__ __PIWIK_DIMENSION_ID_APP__ */

import React, { Component } from 'react'
import { translate } from 'cozy-ui/react/I18n'
import { shouldEnableTracking, getTracker, configureTracker } from '../lib/piwik'

// import Apps from './Apps'
// import Settings from './Settings'
// import Drawer from './Drawer'
// import Claudy from './Claudy'

class Bar extends Component {
  constructor (props) {
    super(props)
    this.state = {
      claudyConfig: null, // no claudy by default
      claudyOpened: false,
      drawerVisible: false,
      usageTracker: null
    }
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
      this.set({usageTracker: trackerInstance})
    }
  }

  toggleDrawer () {
    // don't allow to toggle the drawer if claudy opened
    if (this.state.claudyOpened) return
    this.setState({ drawerVisible: !this.state.drawerVisible })
  }

  toggleClaudy () {
    if (!this.state.claudyConfig) return
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
    const { usageTracker, claudyOpened, claudyConfig, drawerVisible } = this.state
    return (
      <div class='coz-bar-container'>
        <h1 lang={lang} class={`coz-bar-title ${replaceTitleOnMobile ? 'coz-bar-hide-sm' : ''}`}>
          <img class='coz-bar-hide-sm' src={iconPath} width='32' />
          {appEditor && <span class='coz-bar-hide-sm'>{appEditor} </span>}
          <strong>{appName}</strong>
          <sup class='coz-bar-hide-sm coz-bar-beta-status'>{t('beta')}</sup>
        </h1>
        <hr class='coz-sep-flex' />
      </div>
    )
  }
}

// {__TARGET__ !== 'mobile' && !isPublic &&
//   <div>
//     <button class='coz-bar-burger' onClick={this.toggleDrawer} data-icon='icon-hamburger'>
//       <span class='coz-bar-hidden'>{t('menu')}</span>
//     </button>
//     <Drawer visible={drawerVisible} onClose={this.toggleDrawer} onClaudy={this.toggleClaudy} />
//     <Apps />
//     <Settings />
//     claudyConfig &&
//       <Claudy config={claudyConfig} usageTracker={usageTracker} onToggle={this.toggleClaudy} opened={claudyOpened} />
//   </div>
// }

export default translate()(Bar)
