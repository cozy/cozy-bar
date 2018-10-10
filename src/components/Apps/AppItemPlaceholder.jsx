import React from 'react'

export const AppItemPlaceholder = () => (
  <li className="coz-nav-apps-item">
    <span role="menuitem" disabled>
      <div className="coz-nav-apps-item-icon coz-loading-placeholder" />
      <p className="coz-label coz-loading-placeholder" />
    </span>
  </li>
)

export default AppItemPlaceholder
