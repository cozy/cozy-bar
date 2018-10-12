import React, { Component } from 'react'
import { connect } from 'react-redux'

import { translate } from 'cozy-ui/react/I18n'
import withBreakpoints from 'cozy-ui/react/helpers/withBreakpoints'
import { getApps, fetchApps, getHomeApp, isFetchingApps } from 'lib/reducers'

import AppItem from 'components/Apps/AppItem'
import AppItemPlaceholder from 'components/Apps/AppItemPlaceholder'
import cozyIcon from 'assets/icons/16/icon-cozy-16.svg'
import homeIcon from 'assets/icons/icon-cozy-home.svg'

class AppsContent extends Component {
  constructor(props, context) {
    super(props, context)
    if (!this.props.isFetchingApps) {
      this.props.fetchApps()
    }

    this.translateApp = translateApp(this.props.t)
  }

  render() {
    const { t, apps, breakpoints, homeApp, isFetchingApps } = this.props
    const { isMobile } = breakpoints
    const isHomeApp = homeApp && homeApp.isCurrentApp

    if (!isFetchingApps && (!apps || !apps.length)) {
      return <p className="coz-nav--error coz-nav-group">{t('no_apps')}</p>
    }

    return (
      <div className="coz-nav-pop-content">
        <ul className="coz-nav-group">
          {isMobile && homeApp && <AppItem app={homeApp} icon={homeIcon} />}
          {isFetchingApps
            ? new Array(3)
                .fill({})
                .map((nothing, index) => <AppItemPlaceholder key={index} />)
            : apps
                .sort((appA, appB) => {
                  return this.translateApp(appA) > this.translateApp(appB)
                })
                .map((app, index) => <AppItem app={app} key={index} />)}
        </ul>
        {homeApp &&
          !isMobile &&
          !isHomeApp && (
            <a
              role="menuitem"
              href={homeApp.href}
              className="coz-apps-home-btn"
            >
              <img src={cozyIcon} />
              {t('menu.home')}
            </a>
          )}
      </div>
    )
  }
}

const translateApp = t => app => {
  const namePrefix = t(`${app.slug}.namePrefix`, { _: app.namePrefix })
  const name = t(`${app.slug}.name`, { _: app.name })
  return namePrefix ? `${namePrefix} ${name}` : `${name}`
}

const mapStateToProps = state => ({
  apps: getApps(state),
  homeApp: getHomeApp(state),
  isFetchingApps: isFetchingApps(state)
})

const mapDispatchToProps = dispatch => ({
  fetchApps: () => dispatch(fetchApps())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(translate()(withBreakpoints()(AppsContent)))
