import React from 'react'
import PropTypes from 'prop-types'

import { isMobileApp } from 'cozy-device-helper'

import { translate } from 'cozy-ui/react/I18n'
import { ButtonLink } from 'cozy-ui/react/Button'
import Icon from 'cozy-ui/transpiled/react/Icon'
import PhoneIcon from 'cozy-ui/transpiled/react/Icons/Phone'
import CloudIcon from 'cozy-ui/transpiled/react/Icons/Cloud'
import PeopleIcon from 'cozy-ui/transpiled/react/Icons/People'
import CloudHappyIcon from 'cozy-ui/transpiled/react/Icons/CloudHappy'
import LogoutIcon from 'cozy-ui/transpiled/react/Icons/Logout'
import HelpIcon from 'cozy-ui/transpiled/react/Icons/Help'

import StorageData from 'components/Settings/StorageData'
import StorageIcon from 'components/StorageIcon'

const MenuIcon = ({ icon }) => {
  return <Icon className="u-mr-half" color="var(--charcoalGrey)" icon={icon} />
}

const NavGroup = ({ children }) => {
  return <ul className="coz-nav-group">{children}</ul>
}

const NavItem = ({ children }) => {
  return <li className="coz-nav-settings-item">{children}</li>
}

const SettingsContent = ({
  t,
  onLogOut,
  settingsAppURL,
  storageData,
  onClaudy,
  isDrawer = false,
  isClaudyLoading,
  toggleSupport,
  shoulDisplayViewOfferButton,
  managerUrlPremiumLink,
  viewOfferButtonText
}) => (
  <div className="coz-nav-pop-content">
    {isDrawer && <hr />}
    {settingsAppURL && (
      <NavGroup>
        <NavItem>
          <a
            role="menuitem"
            href={`${settingsAppURL}#/profile`}
            target="_self"
            title={t('profile')}
          >
            <Icon
              className="u-mr-half"
              color="var(--coolGrey)"
              icon={PeopleIcon}
            />
            {t('profile')}
          </a>
        </NavItem>
        <NavItem>
          <a
            role="menuitem"
            href={`${settingsAppURL}#/connectedDevices`}
            target="_self"
            title={t('connectedDevices')}
          >
            <MenuIcon icon={PhoneIcon} />
            {t('connectedDevices')}
          </a>
        </NavItem>
      </NavGroup>
    )}
    {isDrawer && onClaudy && !isMobileApp() && (
      <NavGroup>
        <NavItem>
          <button
            type="button"
            role="menuitem"
            className="coz-nav-settings-item-btn"
            busy={isClaudyLoading}
            onClick={onClaudy}
          >
            <MenuIcon icon={CloudIcon} /> {t('claudy.title')}
          </button>
        </NavItem>
      </NavGroup>
    )}
    {!isDrawer && storageData && (
      <NavGroup>
        <NavItem>
          <a
            role="menuitem"
            target="_self"
            title={t('storage')}
            href={`${settingsAppURL}#/storage`}
          >
            <MenuIcon icon={StorageIcon} /> {t('storage')}
            <StorageData data={storageData} />
          </a>
        </NavItem>
      </NavGroup>
    )}
    {(!isDrawer || !isMobileApp()) && shoulDisplayViewOfferButton && (
      <NavGroup>
        <NavItem>
          <ButtonLink
            subtle
            role="menuitem"
            className="coz-nav-settings-item-btn"
            icon={CloudHappyIcon}
            title={viewOfferButtonText}
            label={viewOfferButtonText}
            href={managerUrlPremiumLink}
          />
        </NavItem>
      </NavGroup>
    )}

    {!isMobileApp() && (
      <NavGroup>
        <NavItem>
          <button
            type="button"
            role="menuitem"
            className="coz-nav-settings-item-btn"
            onClick={toggleSupport}
          >
            <MenuIcon icon={HelpIcon} /> {t('help')}
          </button>
        </NavItem>
      </NavGroup>
    )}
    <NavGroup>
      <NavItem>
        <button
          type="button"
          role="menuitem"
          onClick={onLogOut}
          title={t('logout')}
        >
          <MenuIcon icon={LogoutIcon} /> {t('logout')}
        </button>
      </NavItem>
    </NavGroup>
  </div>
)

SettingsContent.defaultProps = {
  shoulDisplayViewOfferButton: false
}

SettingsContent.propTypes = {
  shoulDisplayViewOfferButton: PropTypes.bool,
  t: PropTypes.func.isRequired,
  onLogOut: PropTypes.func.isRequired,
  settingsAppURL: PropTypes.string,
  storageData: PropTypes.object,
  onClaudy: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  isDrawer: PropTypes.bool,
  isClaudyLoading: PropTypes.bool,
  toggleSupport: PropTypes.func.isRequired,
  viewOfferButtonText: PropTypes.string
}
export default translate()(SettingsContent)
