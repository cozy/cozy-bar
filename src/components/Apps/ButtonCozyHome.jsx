import React from 'react'
import PropTypes from 'prop-types'

import flag from 'cozy-flags'
import { isFlagshipApp } from 'cozy-device-helper'

import IconCozyHome from './IconCozyHome'

export const ButtonCozyHome = ({
  webviewContext,
  homeHref,
  isInvertedTheme
}) => {
  if (isFlagshipApp() || flag('flagship.debug'))
    return (
      <a
        onClick={() => {
          webviewContext.call('backToHome')
        }}
        className="coz-nav-apps-btns-home --is-flagship"
      >
        <IconCozyHome
          className="coz-nav-apps-btns-home-svg"
          isInvertedTheme={isInvertedTheme}
        />
      </a>
    )

  if (homeHref) {
    return (
      <a href={homeHref} className="coz-nav-apps-btns-home">
        <IconCozyHome
          className="coz-nav-apps-btns-home-svg"
          isInvertedTheme={isInvertedTheme}
        />
      </a>
    )
  }

  return (
    <span className="coz-nav-apps-btns-home">
      <IconCozyHome
        className="coz-nav-apps-btns-home-svg"
        isInvertedTheme={isInvertedTheme}
      />
    </span>
  )
}

ButtonCozyHome.propTypes = {
  webviewContext: PropTypes.object,
  homeHref: PropTypes.string,
  isInvertedTheme: PropTypes.bool
}
