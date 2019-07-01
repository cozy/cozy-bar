import React, { Component } from 'react'
import { connect } from 'react-redux'

import { getHomeApp } from 'lib/reducers'

import { translate } from 'cozy-ui/react/I18n'
import Icon from 'cozy-ui/react/Icon'
import HomeIcon from 'components/Apps/IconCozyHome'
import { isFetchingApps } from 'lib/reducers'

class AppNavButton extends Component {
  render() {
    const {
      homeApp,
      handleClick,
      appName,
      appNamePrefix,
      appSlug,
      iconPath,
      isFetchingApps,
      isPublic,
      opened,
      t
    } = this.props

    const isHomeApp = homeApp && homeApp.isCurrentApp

    if (!isPublic && isFetchingApps) {
      return (
        <div className="coz-nav-apps-btns --loading">
          <div className="coz-nav-apps-btns-home coz-loading-placeholder" />
          <div className="coz-nav-apps-btns-main coz-loading-placeholder" />
        </div>
      )
    }

    const displayName =
      !isHomeApp && appNamePrefix
        ? [
            t(`${appSlug}.name_prefix`, {
              _: appNamePrefix
            }),
            t(`${appSlug}.name`, {
              _: appName
            })
          ].join(' ')
        : t(`${appSlug}.name`, { _: appName })

    const homeHref = !isPublic && homeApp && homeApp.href

    return (
      <div className={`coz-nav-apps-btns${isHomeApp ? ' --currentHome' : ''}`}>
        {homeHref ? (
          <a href={homeHref} className="coz-nav-apps-btns-home">
            <HomeIcon className="coz-nav-apps-btns-home-svg" />
          </a>
        ) : (
          <span className="coz-nav-apps-btns-home">
            <HomeIcon className="coz-nav-apps-btns-home-svg" />
          </span>
        )}
        {!isHomeApp && <span className="coz-nav-apps-btns-sep" />}
        <button
          type="button"
          onClick={isPublic ? null : handleClick}
          className="coz-nav-apps-btns-main"
          aria-controls="coz-nav-pop--apps"
          data-tutorial="apps"
          disabled={isPublic}
        >
          {!isHomeApp && (
            <img className="coz-bar-hide-sm" src={iconPath} width="28" alt="" />
          )}
          <span className="coz-nav-app-name">{displayName}</span>
          {!isPublic && (
            <Icon icon={opened ? 'top' : 'bottom'} color="#95999d" size="12" />
          )}
        </button>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  homeApp: getHomeApp(state),
  isFetchingApps: isFetchingApps(state)
})

const mapDispatchToProps = () => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(translate()(AppNavButton))
