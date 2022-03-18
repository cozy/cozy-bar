import React from 'react'
import { isFlagshipApp } from 'cozy-device-helper'

import flag from 'cozy-flags'

import IconCozyHome from './IconCozyHome'

export const ButtonCozyHome = ({ webviewContext, homeHref }) => {
  if (isFlagshipApp() || flag('flagship.debug'))
    return (
      <a
        onClick={() => {
          webviewContext.call('backToHome')
        }}
        className="coz-nav-apps-btns-home --is-flagship"
      >
        <IconCozyHome className="coz-nav-apps-btns-home-svg" />
      </a>
    )

  if (homeHref)
    return (
      <a href={homeHref} className="coz-nav-apps-btns-home">
        <IconCozyHome className="coz-nav-apps-btns-home-svg" />
      </a>
    )

  return (
    <span className="coz-nav-apps-btns-home">
      <IconCozyHome className="coz-nav-apps-btns-home-svg" />
    </span>
  )
}
