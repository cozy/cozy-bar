import React, { Component } from 'react'
import { connect } from 'react-redux'

import { translate } from 'cozy-ui/react/I18n'
import { ButtonLink } from 'cozy-ui/react/Button'
import withBreakpoints from 'cozy-ui/react/helpers/withBreakpoints'
import { getApps, fetchApps, getHomeApp } from 'lib/reducers'

import AppItem from 'components/Apps/AppItem'
import cozyIcon from 'assets/icons/16/icon-cozy-16.svg'

class AppsContent extends Component {
  render () {
    const { t, apps, homeApp, breakpoints } = this.props
    const { isMobile } = breakpoints
    const isHomeApp = homeApp && homeApp.isCurrentApp

    if (!apps || !homeApp || apps.length === 0) {
      return <p className='coz-nav--error coz-nav-group'>{t('no_apps')}</p>
    }

    return (
      <div className='coz-nav-pop-content'>
        <ul className='coz-nav-group'>
          {apps.map(app => <AppItem app={app} />)}
        </ul>
        {homeApp && !isHomeApp && (
          isMobile ? (
            <ButtonLink
              role='menuitem'
              subtle
              className='coz-apps-home-btn --mobile'
              href={homeApp.href}
              label={t('menu.home_mobile')}
            />
          ) : (
            <a role='menuitem' href={homeApp.href} className='coz-apps-home-btn'>
              <img src={cozyIcon} />
              {t('menu.home')}
            </a>
          )
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
