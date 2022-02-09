import React from 'react'

import IconCozyHome from './IconCozyHome'

export const ButtonCozyHome = ({ webviewContext, homeHref }) => {
  if (webviewContext)
    return (
      <button
        onClick={() => {
          webviewContext.call('backToHome')
        }}
        className="coz-nav-apps-btns-home --flagship"
      >
        <IconCozyHome className="coz-nav-apps-btns-home-svg" />
      </button>
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
