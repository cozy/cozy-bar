/* global __TARGET__ */

import React from 'react'
import defaultIcon from 'assets/icons/16/icon-cube-16.svg'
import { appShape } from 'proptypes/index'
import { checkApp, startApp } from 'cozy-device-helper'
import expiringMemoize from 'lib/expiringMemoize'

const NATIVE_APP_INFOS = {
  drive: {
    appId: 'io.cozy.drive.mobile',
    uri: 'cozydrive://'
  },
  banks: {
    appId: 'io.cozy.banks.mobile',
    uri: 'cozybanks://'
  }
}

const expirationDelay = 10 * 1000
const memoizedCheckApp = expiringMemoize(checkApp, expirationDelay, x => x.appId)

export class AppItem extends React.Component {
  state = {
    isAppAvailable: null
  }

  constructor () {
    super()
    this.openNativeApp = this.openNativeApp.bind(this)
  }

  componentDidMount () {
    if (__TARGET__ === 'mobile') {
      this.checkAppAvailability()
    }
  }

  async checkAppAvailability () {
    const { slug } = this.props.app
    const appInfo = NATIVE_APP_INFOS[slug]
    if (appInfo) {
      const isAppAvailable = Boolean(await memoizedCheckApp(appInfo))
      this.setState({ isAppAvailable })
    }
  }

  openNativeApp (ev) {
    if (ev) {
      ev.preventDefault()
    }
    const appInfos = NATIVE_APP_INFOS[this.props.app.slug]
    startApp(appInfos)
  }

  render () {
    const { app } = this.props
    const dataIcon = app.icon ? `icon-${app.slug}` : ''
    const blurry = !app.icon || !app.icon.cached || false
    const label = (app.namePrefix ? (app.namePrefix + ' ') : '') + app.name
    const iconSrc = app.icon && app.icon.cached ? app.icon.src : defaultIcon

    let href = app.href
    let onClick = null

    if (!onClick && this.state.isAppAvailable) {
      onClick = this.openNativeApp
    }

    if (onClick) {
      href = '#'
    }

    return (
      <li className='coz-nav-item'>
        <a role='menuitem' href={href} data-icon={dataIcon} title={label} onClick={onClick}>
          {iconSrc &&
            <img src={iconSrc} alt='' width='64' height='64' className={blurry && 'blurry'} />
          }
          <p className='coz-label'>{label}</p>
        </a>
      </li>
    )
  }
}

AppItem.propTypes = {
  app: appShape.isRequired
}

export default AppItem
