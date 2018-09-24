import React, { Component } from 'react'
import { connect } from 'react-redux'

import { translate } from 'cozy-ui/react/I18n'
import withBreakpoints from 'cozy-ui/react/helpers/withBreakpoints'
import { getApps, fetchApps, getHomeApp } from 'lib/reducers'

import AppItem from 'components/Apps/AppItem'
import cozyIcon from 'assets/icons/16/icon-cozy-16.svg'
import homeIcon from 'assets/icons/icon-cozy-home.svg'

class AppsContent extends Component {
  constructor (props, context) {
    super(props, context)
    this.props.fetchApps()
  }

  render () {
    const { t, apps, homeApp, breakpoints } = this.props
    const { isMobile } = breakpoints
    const isHomeApp = homeApp && homeApp.isCurrentApp
    const homeAppWithIcon = Object.assign({}, homeApp, {
      icon: {
        cached: true,
        src: homeIcon
      }
    })

    if (!apps || !apps.length) {
      return <p className='coz-nav--error coz-nav-group'>{t('no_apps')}</p>
    }

    return (
      <div className='coz-nav-pop-content'>
        <ul className='coz-nav-group'>
          {isMobile && homeApp && (
            <AppItem app={homeAppWithIcon} />
          )}
          {apps.map(app => <AppItem app={app} />)}
        </ul>
        {homeApp && !isMobile && !isHomeApp && (
          <a role='menuitem' href={homeApp.href} className='coz-apps-home-btn'>
            <img src={cozyIcon} />
            {t('menu.home')}
          </a>
        )}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  apps: getApps(state),
  homeApp: getHomeApp(state)
})

const mapDispatchToProps = dispatch => ({
  fetchApps: () => dispatch(fetchApps())
})

export default connect(mapStateToProps, mapDispatchToProps)(translate()(withBreakpoints()(AppsContent)))
