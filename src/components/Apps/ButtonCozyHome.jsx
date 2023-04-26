import React from 'react'

import flag from 'cozy-flags'
import { isFlagshipApp } from 'cozy-device-helper'
import { translate } from 'cozy-ui/react/I18n'

import IconCozyHome from './IconCozyHome'

const ButtonCozyHomeWithI18n = ({ webviewContext, homeHref, t }) => {
  if (isFlagshipApp() || flag('flagship.debug'))
    return (
      <a
        onClick={() => {
          webviewContext.call('backToHome')
        }}
        className="coz-nav-apps-btns-home --is-flagship"
        aria-hidden="true"
        aria-label={t('menu.home')}
        data-testid="ButtonCozyHome-flagship"
      >
        <IconCozyHome className="coz-nav-apps-btns-home-svg" />
      </a>
    )

  if (homeHref)
    return (
      <a
        href={homeHref}
        className="coz-nav-apps-btns-home"
        aria-hidden="true"
        aria-label={t('menu.home')}
        data-testid="ButtonCozyHome-homeHref"
      >
        <IconCozyHome className="coz-nav-apps-btns-home-svg" />
      </a>
    )

  return (
    <span
      className="coz-nav-apps-btns-home"
      aria-hidden="true"
      data-testid="ButtonCozyHome-span"
    >
      <IconCozyHome className="coz-nav-apps-btns-home-svg" />
    </span>
  )
}

const ButtonCozyHome = translate()(ButtonCozyHomeWithI18n)

export { ButtonCozyHome }
