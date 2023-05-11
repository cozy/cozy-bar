import React from 'react'
import PropTypes from 'prop-types'

import flag from 'cozy-flags'
import { isFlagshipApp } from 'cozy-device-helper'
import { translate } from 'cozy-ui/react/I18n'

import IconCozyHome from './IconCozyHome'

const ButtonCozyHomeWithI18n = ({
  webviewContext,
  homeHref,
  t,
  isInvertedTheme
}) => {
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
        <IconCozyHome
          className="coz-nav-apps-btns-home-svg"
          isInvertedTheme={isInvertedTheme}
        />
      </a>
    )

  if (homeHref) {
    return (
      <a
        href={homeHref}
        className="coz-nav-apps-btns-home"
        aria-hidden="true"
        aria-label={t('menu.home')}
        data-testid="ButtonCozyHome-homeHref"
      >
        <IconCozyHome
          className="coz-nav-apps-btns-home-svg"
          isInvertedTheme={isInvertedTheme}
        />
      </a>
    )
  }

  return (
    <span
      className="coz-nav-apps-btns-home"
      aria-hidden="true"
      data-testid="ButtonCozyHome-span"
    >
      <IconCozyHome
        className="coz-nav-apps-btns-home-svg"
        isInvertedTheme={isInvertedTheme}
      />
    </span>
  )
}

ButtonCozyHomeWithI18n.propTypes = {
  webviewContext: PropTypes.object,
  homeHref: PropTypes.string,
  isInvertedTheme: PropTypes.bool
}

const ButtonCozyHome = translate()(ButtonCozyHomeWithI18n)

export { ButtonCozyHome }
