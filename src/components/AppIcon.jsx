import React from 'react'
import { translate } from 'cozy-ui/react/I18n'

export const AppIcon = ({ t, label, dataIcon, iconSrc, href, comingSoon = false, blurry = false, toggle }) => {
  if (href) toggle = null // href always have priority
  let appClass = comingSoon ? 'coz-bar-coming-soon-app' : ''
  if (toggle) appClass += ' --toggable'
  return (
    <li className='coz-nav-item'>
      <a role='menuitem' href={href} data-icon={dataIcon} className={appClass} title={label} onClick={toggle}>
        {iconSrc &&
          <img src={iconSrc} alt='' width='64' height='64' className={blurry && 'blurry'} />
        }
        {comingSoon &&
          <span className='coz-bar-coming-soon-badge'>{t('soon')}</span>
        }
        <p className='coz-label'>{label}</p>
      </a>
    </li>
  )
}

export default translate()(AppIcon)
