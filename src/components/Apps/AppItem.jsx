/* global __TARGET__ */

import React from 'react'
import { appShape } from 'proptypes/index'
import { checkApp, startApp, isAndroidApp } from 'cozy-device-helper'
import expiringMemoize from 'lib/expiringMemoize'
import AppIcon from 'cozy-ui/react/AppIcon'
import HomeIcon from './IconCozyHome'
import { translate } from 'cozy-ui/react/I18n'
import stack from 'lib/stack'
import PropTypes from 'prop-types'

const NATIVE_APP_INFOS = {
  drive: {
    appId: 'io.cozy.drive.mobile',
    uri: 'cozydrive://'
  },
  banks: {
    appId: isAndroidApp() ? 'io.cozy.banks.mobile' : 'io.cozy.banks',
    uri: 'cozybanks://'
  }
}

const expirationDelay = 10 * 1000
const memoizedCheckApp = expiringMemoize(
  checkApp,
  expirationDelay,
  x => x.appId
)

export class AppItem extends React.Component {
  state = {
    isAppAvailable: null
  }

  constructor() {
    super()
    this.openNativeApp = this.openNativeApp.bind(this)
  }

  componentDidMount() {
    if (__TARGET__ === 'mobile') {
      this.checkAppAvailability()
    }
  }

  async checkAppAvailability() {
    const { slug } = this.props.app
    const appInfo = NATIVE_APP_INFOS[slug]
    if (appInfo) {
      const isAppAvailable = Boolean(await memoizedCheckApp(appInfo))
      this.setState({ isAppAvailable })
    }
  }

  openNativeApp(ev) {
    if (ev) {
      ev.preventDefault()
    }
    const appInfos = NATIVE_APP_INFOS[this.props.app.slug]
    startApp(appInfos)
  }

  render() {
    const { app, t, useHomeIcon } = this.props
    const dataIcon = app.slug ? `icon-${app.slug}` : ''
    const label = t(`${app.slug}.name`, {
      _: app.namePrefix ? `${app.namePrefix} ${app.name}` : app.name
    })

    let href = app.href
    let onClick = null

    if (!onClick && this.state.isAppAvailable) {
      onClick = this.openNativeApp
    }

    if (onClick) {
      href = '#'
    }

    if (app.isCurrentApp) {
      // disabled for current app
      onClick = null
      href = null
    }

    return (
      <li
        className={`coz-nav-apps-item${app.isCurrentApp ? ' --current' : ''}`}
      >
        <a
          role="menuitem"
          href={href}
          data-icon={dataIcon}
          title={label}
          onClick={onClick}
        >
          {useHomeIcon ? (
            <HomeIcon className="coz-nav-apps-item-icon" />
          ) : (
            <AppIcon
              app={app}
              className="coz-nav-apps-item-icon"
              key={app.slug}
              {...stack.get.iconProps()}
            />
          )}
          <p className="coz-label">{label}</p>
        </a>
      </li>
    )
  }
}

AppItem.propTypes = {
  app: appShape.isRequired,
  useHomeIcon: PropTypes.bool
}

export default translate()(AppItem)
