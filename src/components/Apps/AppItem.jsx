/* global __TARGET__ */

import React from 'react'
import { appShape } from 'proptypes/index'
import {
  checkApp,
  startApp,
  isAndroidApp,
  isMobileApp,
  isMobile,
  openDeeplinkOrRedirect
} from 'cozy-device-helper'
import expiringMemoize from 'lib/expiringMemoize'
import AppIcon from 'cozy-ui/react/AppIcon'
import HomeIcon from 'components/Apps/IconCozyHome'
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
    isMobileAppAvailable: null
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

  componentWillUnmount() {
    if (this.switchTimeout) clearTimeout(this.switchTimeout)
  }

  async checkAppAvailability() {
    const { slug } = this.props.app
    const appInfo = NATIVE_APP_INFOS[slug]
    if (appInfo) {
      const isMobileAppAvailable = Boolean(await memoizedCheckApp(appInfo))
      this.setState({ isMobileAppAvailable })
    }
  }

  onAppSwitch = () => {
    const { onAppSwitch } = this.props
    if (typeof onAppSwitch === 'function') {
      this.switchTimeout = setTimeout(() => {
        onAppSwitch()
      }, 1000)
    }
  }

  openNativeApp(ev) {
    const { app } = this.props
    if (ev) {
      ev.preventDefault()
    }
    const appInfos = NATIVE_APP_INFOS[app.slug]
    this.onAppSwitch()
    startApp(appInfos)
  }

  render() {
    const { app, t, useHomeIcon } = this.props
    const { isMobileAppAvailable } = this.state
    const dataIcon = app.slug ? `icon-${app.slug}` : ''
    const label = t(`${app.slug}.name`, {
      _: app.namePrefix ? `${app.namePrefix} ${app.name}` : app.name
    })

    let href = app.href
    let onClick = null
    //if we are on the native app and the other native app is available
    if (isMobileApp() && isMobileAppAvailable) {
      onClick = this.openNativeApp
      href = '#'
      /*
      if we are on a native app, but the other native app is not avaibale
      we open the web link and close (via the AppSwtich) the drawer
    */
    } else if (isMobileApp()) {
      onClick = this.onAppSwitch
      /*
      If we are on the "mobile web version", we try to open the native app
      if it exists. If it fails, we redirect to the web version of the 
      requested app
    */
    } else if (isMobile() && NATIVE_APP_INFOS[app.slug]) {
      onClick = e => {
        e.preventDefault()
        openDeeplinkOrRedirect(NATIVE_APP_INFOS[app.slug].uri, function() {
          window.location.href = href
        })
      }
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
