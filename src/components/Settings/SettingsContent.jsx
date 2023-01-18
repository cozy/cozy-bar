import React from 'react'
import PropTypes from 'prop-types'
import flag from 'cozy-flags'

import { isMobileApp } from 'cozy-device-helper'

import { translate } from 'cozy-ui/transpiled/react/I18n'
import Icon from 'cozy-ui/transpiled/react/Icon'
import OpenwithIcon from 'cozy-ui/transpiled/react/Icons/Openwith'
import CloudIcon from 'cozy-ui/transpiled/react/Icons/Cloud'
import PeopleIcon from 'cozy-ui/transpiled/react/Icons/People'
import GraphCircleIcon from 'cozy-ui/transpiled/react/Icons/GraphCircle'
import CozyCircleIcon from 'cozy-ui/transpiled/react/Icons/CozyCircle'
import HandIcon from 'cozy-ui/transpiled/react/Icons/Hand'
import DevicesIcon from 'cozy-ui/transpiled/react/Icons/Devices'
import GlobeIcon from 'cozy-ui/transpiled/react/Icons/Globe'
import LogoutIcon from 'cozy-ui/transpiled/react/Icons/Logout'
import HelpIcon from 'cozy-ui/transpiled/react/Icons/Help'
import EmailIcon from 'cozy-ui/transpiled/react/Icons/Email'

import StorageData from 'components/Settings/StorageData'

const MenuIcon = ({ icon }) => {
  return <Icon className="u-mr-1" color="var(--slateGrey)" icon={icon} />
}

const ExternalLinkIcon = () => {
  return (
    <Icon
      className="coz-nav-settings-item-btn-external-icon"
      color="var(--coolGrey)"
      icon={OpenwithIcon}
    />
  )
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
  managerUrlPremiumLink
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
            <MenuIcon icon={PeopleIcon} />
            {t('profile')}
          </a>
        </NavItem>
        {(!isDrawer || !isMobileApp()) && shoulDisplayViewOfferButton && (
          <NavItem>
            <a
              role="menuitem"
              href={managerUrlPremiumLink}
              target="_self"
              title={t('plans')}
            >
              <MenuIcon icon={CozyCircleIcon} />
              {t('plans')}
              <ExternalLinkIcon />
            </a>
          </NavItem>
        )}
        <NavItem>
          <a
            role="menuitem"
            target="_self"
            title={t('storage')}
            href={`${settingsAppURL}#/storage`}
          >
            <MenuIcon icon={GraphCircleIcon} />
            <span>
              {t('storage')}
              <StorageData data={storageData} />
            </span>
          </a>
        </NavItem>
      </NavGroup>
    )}
    <NavGroup>
      {flag('settings.permissions-dashboard') && (
        <NavItem>
          <a
            role="menuitem"
            href={`${settingsAppURL}#/permissions/slug`}
            target="_self"
            title={t('permissions')}
          >
            <MenuIcon icon={HandIcon} />
            {t('permissions')}
          </a>
        </NavItem>
      )}
      <NavItem>
        <a
          role="menuitem"
          href={`${settingsAppURL}#/connectedDevices`}
          target="_self"
          title={t('connectedDevices')}
        >
          <MenuIcon icon={DevicesIcon} />
          {t('connectedDevices')}
        </a>
      </NavItem>
      <NavItem>
        <a
          role="menuitem"
          href={`${settingsAppURL}#/sessions`}
          target="_self"
          title={t('connections')}
        >
          <MenuIcon icon={GlobeIcon} />
          {t('connections')}
        </a>
      </NavItem>
    </NavGroup>
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
    <NavGroup>
      {!isMobileApp() && (
        <>
          <NavItem>
            <a
              role="menuitem"
              target="_blank"
              rel="noopener noreferrer"
              href="https://support.cozy.io/"
              title={t('help')}
            >
              <MenuIcon icon={HelpIcon} />
              {t('help')}
              <ExternalLinkIcon />
            </a>
          </NavItem>
          <NavItem>
            <button
              type="button"
              role="menuitem"
              onClick={toggleSupport}
              title={t('contact')}
            >
              <MenuIcon icon={EmailIcon} />
              {t('contact')}
            </button>
          </NavItem>
        </>
      )}
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
  isClaudyLoading: PropTypes.bool
}
export default translate()(SettingsContent)
