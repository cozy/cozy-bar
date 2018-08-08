import React from 'react'
import { translate } from 'cozy-ui/react/I18n'
import defaultIcon from '../assets/icons/16/icon-cube-16.svg'
import ComingSoonModal from 'components/ComingSoonModal'
import { appShape } from '../proptypes'

const HAS_COMING_SOON_DESCRIPTION = {
  store: true
}

class AppIcon extends React.Component {
  state = {
    showingComingSoon: false
  }

  toggleComingSoon = (showing) => {
    this.setState({
      showingComingSoon: showing
    })
  }

  openComingSoon = (ev) => {
    this.toggleComingSoon(true)
    if (ev) {
      ev.preventDefault()
    }
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

    let appClass = comingSoon ? 'coz-bar-coming-soon-app' : ''
    let onClick = canShowComingSoonDescription ? this.openComingSoon : null

    let href = app.href
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

export default translate()(AppIcon)
