import React from 'react'
import { translate } from 'cozy-ui/react/I18n'

export const AppIconGroup = ({ t, category, children, wrapping = false, blurry = false }) => (
  <div className={blurry && 'blurry'}>
    <h2 className='coz-nav-category'>{t(category)}</h2>
    <ul className={`
      ${wrapping ? 'coz-nav-group coz-nav-group--wrapping' : 'coz-nav-group'}
    `}>
      {children}
    </ul>
  </div>
)

export default translate()(AppIconGroup)
