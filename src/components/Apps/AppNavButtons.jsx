import React, { Component } from 'react'
import { connect } from 'react-redux'

import { getHomeApp } from 'lib/reducers'

import { translate } from 'cozy-ui/react/I18n'
import homeIcon from 'assets/icons/icon-cozy-home.svg'
import { isFetchingApps } from 'lib/reducers'

import IconTop from 'assets/icons/24/icon-top.svg'
import IconBottom from 'assets/icons/24/icon-bottom.svg'

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
      opened,
      t
    } = this.props

    const isHomeApp = homeApp && homeApp.isCurrentApp

    if (isFetchingApps) {
      return (
        <div className="coz-nav-apps-btns --loading">
          <div className="coz-nav-apps-btns-home coz-loading-placeholder" />
          <div className="coz-nav-apps-btns-main coz-loading-placeholder" />
        </div>
      )
    }

    return (
      <div className={`coz-nav-apps-btns${isHomeApp ? ' --currentHome' : ''}`}>
        <a href={homeApp && homeApp.href} className="coz-nav-apps-btns-home">
          <img src={homeIcon} />
        </a>
        {!isHomeApp && <span className="coz-nav-apps-btns-sep" />}
        <button
          type="button"
          onClick={handleClick}
          className="coz-nav-apps-btns-main"
          aria-controls="coz-nav-pop--apps"
          data-tutorial="apps"
        >
          {!isHomeApp && (
            <img className="coz-bar-hide-sm" src={iconPath} width="28" alt="" />
          )}
          <span className="coz-nav-app-name">
            {t(`${appSlug}.name`, {
              _: appNamePrefix ? `${appNamePrefix} ${appName}` : appName
            })}
          </span>
          <img src={opened ? IconTop : IconBottom} height="12" />
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
