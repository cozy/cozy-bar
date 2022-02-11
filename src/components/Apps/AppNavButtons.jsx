import React, { Component } from 'react'
import { connect } from 'react-redux'

import BottomIcon from 'cozy-ui/react/Icons/Bottom'
import Icon from 'cozy-ui/react/Icon'
import TopIcon from 'cozy-ui/react/Icons/Top'
import { translate } from 'cozy-ui/react/I18n'

import { ButtonCozyHome } from 'components/Apps/ButtonCozyHome'
import { getHomeApp } from 'lib/reducers'
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
        <ButtonCozyHome homeHref={homeHref} />

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
            <Icon
              icon={opened ? TopIcon : BottomIcon}
              color="#95999d"
              size="12"
            />
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
