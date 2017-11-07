import React from 'react'

import { translate } from '../lib/I18n'

const AppsList = ({ t, categories, wrappingLimit }) => (
  <div>
    {categories.map(category => {
      const wrapping = category.items.length > wrappingLimit
      return (
        <div>
          <h2 className='coz-nav-category'>{t(`Categories.${category.slug}`)}</h2>
          <ul className={`
              ${wrapping ? 'coz-nav-group coz-nav-group--wrapping' : 'coz-nav-group'}
          `}>
            {category.items.map(app => {
              const dataIcon = app.icon ? `icon-${app.slug}` : ''
              const fileIcon = app.icon.cached
                ? { src: app.icon.src }
                : {
                  src: require('../assets/icons/16/icon-cube-16.svg'),
                  class: 'blurry'
                }
              const label = (app.editor ? (app.editor + ' ') : '') + app.name
              return app.comingSoon
                ? <li className='coz-nav-item'>
                  <a role='menuitem' data-icon={dataIcon} className='coz-bar-coming-soon-app' title={label}>
                    {fileIcon &&
                    <img src={fileIcon.src} alt='' width='64' height='64' className={fileIcon.class ? fileIcon.class : ''} />
                    }
                    <span className='coz-bar-coming-soon-badge'>{t('soon')}</span>
                    <p className='coz-label'>{label}</p>
                  </a>
                </li>
                : <li className='coz-nav-item'>
                  <a role='menuitem' href={app.href} data-icon={dataIcon} title={label}>
                    {fileIcon &&
                    <img src={fileIcon.src} alt='' width='64' height='64' className={fileIcon.class ? fileIcon.class : ''} />
                    }
                    <p className='coz-label'>{label}</p>
                  </a>
                </li>
            })}
          </ul>
          <hr />
        </div>
      )
    })}
  </div>
)

export default translate()(AppsList)
