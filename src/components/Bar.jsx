/* global __TARGET__ */
/* global __PIWIK_TRACKER_URL__  __PIWIK_SITEID__ __PIWIK_DIMENSION_ID_APP__ */

import React, { Component } from 'react'
import { connect } from 'react-redux'

import { translate } from '../lib/I18n'
import { shouldEnableTracking, getTracker, configureTracker } from 'cozy-ui/react/helpers/tracker'

import Drawer from 'components/Drawer'
import Nav from 'components/Nav'
import SearchBar from 'components/SearchBar'
import Claudy from 'components/Claudy'
import SupportModal from 'components/SupportModal'
import { getContent } from 'lib/reducers'

class Bar extends Component {
  constructor (props, context) {
    super(props)
    this.store = context.barStore
    this.state = {
      enableClaudy: null, // no claudy by default
      fireClaudy: false, // true to fire claudy (used by the drawer)
      claudyOpened: false,
      drawerVisible: false,
      usageTracker: null,
      displaySupport: false,
      enableSearchBar: window.location.search.toLowerCase().indexOf('howdoyouturnthison') >= 0
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
    // data-tutorial attribute allows to be targeted in an application tutorial
    return <button className='coz-bar-burger' onClick={this.toggleDrawer} data-icon='icon-apps' data-tutorial='apps-mobile'>
      <span className='coz-bar-hidden'>{t('drawer')}</span>
    </button>
  }

  renderRight () {
    const { usageTracker, claudyOpened,
      enableClaudy, fireClaudy, displayOnMobile, isPublic } = this.props
    return (__TARGET__ !== 'mobile' || displayOnMobile) && !isPublic ? <div className='coz-bar-flex-container' key='nav'>
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
    const { fireClaudy, displaySupport, enableSearchBar } = this.state
    const { barLeft, barRight, barCenter } = this.props
    const { enableClaudy, onDrawer, displayOnMobile, isPublic } = this.props
    const { drawerVisible } = this.state
    return (
      <div className='coz-bar-container'>
        { barLeft || this.renderLeft() }
        { barCenter || this.renderCenter() }
        { enableSearchBar
          ? <SearchBar />
          : <hr className='coz-sep-flex' key='separator' />
        }
        { barRight || this.renderRight() }
        { displaySupport && <SupportModal onClose={this.toggleSupport} /> }
        { (__TARGET__ !== 'mobile' || displayOnMobile) && !isPublic
          ? <Drawer visible={drawerVisible}
            onClose={this.toggleDrawer}
            onClaudy={(enableClaudy && (() => this.toggleClaudy(true))) || false}
            isClaudyLoading={fireClaudy}
            drawerListener={() => onDrawer(this.state.drawerVisible)}
            toggleSupport={this.toggleSupport} /> : null }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  barLeft: getContent(state, 'left'),
  barRight: getContent(state, 'right'),
  barCenter: getContent(state, 'center')
})

export default translate()(connect(mapStateToProps)((Bar)))
