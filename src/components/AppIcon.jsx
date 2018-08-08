/* global __TARGET__ */

import React from 'react'
import { translate } from 'cozy-ui/react/I18n'
import defaultIcon from '../assets/icons/16/icon-cube-16.svg'
import ComingSoonModal from 'components/ComingSoonModal'
import { appShape } from '../proptypes'
import { checkApp, startApp } from 'cozy-device-helper'
import expiringMemoize from '../lib/expiringMemoize'

const HAS_COMING_SOON_DESCRIPTION = {
  store: true
}

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

class AppIcon extends React.Component {
  state = {
    showingComingSoon: false,
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

  toggleComingSoon = (showing) => {
    this.setState({
      showingComingSoon: showing
    })
  }

  openComingSoon = ev => {
    if (ev) {
      ev.preventDefault()
    }
    this.toggleComingSoon(true)
  }

  openNativeApp (ev) {
    if (ev) {
      ev.preventDefault()
    }
    const appInfos = NATIVE_APP_INFOS[this.props.app.slug]
    startApp(appInfos)
  }

  closeComingSoon = () => {
    this.toggleComingSoon(false)
  }

  render () {
    const { t, app } = this.props
    const dataIcon = app.icon ? `icon-${app.slug}` : ''
    const blurry = !app.icon || !app.icon.cached || false
    const label = (app.namePrefix ? (app.namePrefix + ' ') : '') + app.name
    const comingSoon = app.comingSoon || false
    const iconSrc = app.icon && app.icon.cached ? app.icon.src : defaultIcon
    const canShowComingSoonDescription = HAS_COMING_SOON_DESCRIPTION.hasOwnProperty(app.slug)

    let href = app.href
    let appClass = comingSoon ? 'coz-bar-coming-soon-app' : ''
    let onClick = canShowComingSoonDescription ? this.openComingSoon : null
    if (href) onClick = null // href have priority over coming soon

    if (!onClick && this.state.isAppAvailable) {
      onClick = this.openNativeApp
    }

    if (onClick) {
      appClass += ' --toggable'
      href = '#'
    }

    return (
      <li className='coz-nav-item'>
        <a role='menuitem' href={href} data-icon={dataIcon} className={appClass} title={label} onClick={onClick}>
          {iconSrc &&
            <img src={iconSrc} alt='' width='64' height='64' className={blurry && 'blurry'} />
          }
          {comingSoon &&
            <span
              className='coz-bar-coming-soon-badge'
            >
              {t('soon')}
            </span>
          }
          <p className='coz-label'>{label}</p>
        </a>
        { this.state.showingComingSoon &&
          <ComingSoonModal
            onClose={this.closeComingSoon}
            appSlug={app.slug}
          /> }
      </li>
    )
  }
}

AppIcon.propTypes = {
  app: appShape.isRequired
}

export { AppIcon }
export default translate()(AppIcon)
