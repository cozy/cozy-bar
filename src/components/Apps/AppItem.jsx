import React, { useEffect, useState } from 'react'
import get from 'lodash/get'
import PropTypes from 'prop-types'

import { models } from 'cozy-client'
import AppIcon from 'cozy-ui/transpiled/react/AppIcon'
import AppLinker from 'cozy-ui/transpiled/react/AppLinker'

import HomeIcon from 'components/Apps/IconCozyHome'
import { appShape } from 'proptypes/index'
import stack from 'lib/stack'

const getAppDisplayName = get(models, 'applications.getAppDisplayName', app => {
  return app.namePrefix && app.namePrefix.toLowerCase() !== 'cozy'
    ? `${app.namePrefix} ${app.name}`
    : app.name
})

export const AppItem = ({ onAppSwitch, useHomeIcon, app, isInvertedTheme }) => {
  const [switchTimeout, setSwitchTimeout] = useState()

  useEffect(() => {
    return () => {
      if (switchTimeout) clearTimeout(switchTimeout)
    }
  }, [switchTimeout])

  const switchApp = () => {
    if (typeof onAppSwitch === 'function') {
      setSwitchTimeout(
        setTimeout(() => {
          onAppSwitch()
        }, 1000)
      )
    }
  }

  const dataIcon = app.slug ? `icon-${app.slug}` : ''
  const appName = getAppDisplayName(app)

  return (
    <AppLinker onAppSwitch={switchApp} href={app.href || ''} app={app}>
      {({ onClick, href }) => {
        return (
          <li
            className={`coz-nav-apps-item${
              app.isCurrentApp ? ' coz-nav-apps-item--current' : ''
            }`}
          >
            <a
              role="menuitem"
              href={href}
              data-icon={dataIcon}
              title={appName}
              onClick={onClick}
            >
              {useHomeIcon ? (
                <HomeIcon
                  className="coz-nav-apps-item-icon"
                  isInvertedTheme={isInvertedTheme}
                />
              ) : (
                <AppIcon
                  app={app}
                  className="coz-nav-apps-item-icon"
                  key={app.slug}
                  {...stack.get.iconProps()}
                />
              )}
              <p className="coz-label">{appName}</p>
            </a>
          </li>
        )
      }}
    </AppLinker>
  )
}

AppItem.propTypes = {
  app: appShape.isRequired,
  useHomeIcon: PropTypes.bool,
  isInvertedTheme: PropTypes.bool,
  onAppSwitch: PropTypes.func
}

export default AppItem
