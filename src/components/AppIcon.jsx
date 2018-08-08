import React from 'react'
import { translate } from 'cozy-ui/react/I18n'
import defaultIcon from '../assets/icons/16/icon-cube-16.svg'

class AppIcon extends React.Component {
  render () {
    const { t, app } = this.props
    const dataIcon = app.icon ? `icon-${app.slug}` : ''
    const blurry = !app.icon || !app.icon.cached || false
    const label = (app.namePrefix ? (app.namePrefix + ' ') : '') + app.name
    const comingSoon = app.comingSoon || false
    const iconSrc = app.icon && app.icon.cached ? app.icon.src : defaultIcon

    let appClass = comingSoon ? 'coz-bar-coming-soon-app' : ''

    let href = app.href
    let onClick = this.props
    if (href) onClick = null // href always have priority
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
      </li>
    )
  }
}

export default translate()(AppIcon)
