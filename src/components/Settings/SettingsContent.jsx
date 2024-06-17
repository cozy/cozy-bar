import React from 'react'
import PropTypes from 'prop-types'
import flag from 'cozy-flags'

import { isMobileApp } from 'cozy-device-helper'
import { useClient } from 'cozy-client'

import Icon from 'cozy-ui/transpiled/react/Icon'
import OpenwithIcon from 'cozy-ui/transpiled/react/Icons/Openwith'
import PeopleIcon from 'cozy-ui/transpiled/react/Icons/People'
import PaletteIcon from 'cozy-ui/transpiled/react/Icons/Palette'
import GraphCircleIcon from 'cozy-ui/transpiled/react/Icons/GraphCircle'
import CozyCircleIcon from 'cozy-ui/transpiled/react/Icons/CozyCircle'
import HandIcon from 'cozy-ui/transpiled/react/Icons/Hand'
import DevicesIcon from 'cozy-ui/transpiled/react/Icons/Devices'
import GlobeIcon from 'cozy-ui/transpiled/react/Icons/Globe'
import LogoutIcon from 'cozy-ui/transpiled/react/Icons/Logout'
import HelpIcon from 'cozy-ui/transpiled/react/Icons/Help'
import EmailIcon from 'cozy-ui/transpiled/react/Icons/Email'

import { getSettingsLink } from 'components/Settings/helper'
import StorageData from 'components/Settings/StorageData'
import useI18n from 'components/useI18n'

const MenuIcon = ({ icon }) => {
  return <Icon className="u-mr-1" color="var(--iconTextColor)" icon={icon} />
}

const ExternalLinkIcon = () => {
  return (
    <Icon
      className="coz-nav-settings-item-btn-external-icon"
      color="var(--iconTextColor)"
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
  onLogOut,
  storageData,
  isDrawer = false,
  shoulDisplayViewOfferButton,
  managerUrlPremiumLink
}) => {
  const { t } = useI18n()
  const client = useClient()

  return (
    <div className="coz-nav-pop-content">
      {isDrawer && <hr />}

      <NavGroup>
        <NavItem>
          <a
            role="menuitem"
            href={getSettingsLink({ client, hash: 'profile' })}
            target="_self"
            title={t('profile')}
          >
            <MenuIcon icon={PeopleIcon} />
            {t('profile')}
          </a>
        </NavItem>
        {flag('ui.darkmode.enabled') && (
          <NavItem>
            <a
              role="menuitem"
              href={getSettingsLink({ client, hash: 'appearance' })}
              target="_self"
              title={t('appearance')}
            >
              <MenuIcon icon={PaletteIcon} />
              {t('appearance')}
            </a>
          </NavItem>
        )}
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
              {!flag('settings.subscription') && <ExternalLinkIcon />}
            </a>
          </NavItem>
        )}
        <NavItem>
          <a
            role="menuitem"
            target="_self"
            title={t('storage')}
            href={getSettingsLink({ client, hash: 'storage' })}
          >
            <MenuIcon icon={GraphCircleIcon} />
            <span>
              {t('storage')}
              {storageData ? <StorageData data={storageData} /> : null}
            </span>
          </a>
        </NavItem>
      </NavGroup>
      <NavGroup>
        {flag('settings.permissions-dashboard') && (
          <NavItem>
            <a
              role="menuitem"
              href={getSettingsLink({ client, hash: 'permissions/slug' })}
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
            href={getSettingsLink({ client, hash: 'connectedDevices' })}
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
            href={getSettingsLink({ client, hash: 'sessions' })}
            target="_self"
            title={t('connections')}
          >
            <MenuIcon icon={GlobeIcon} />
            {t('connections')}
          </a>
        </NavItem>
      </NavGroup>
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
              <a
                role="menuitem"
                href={getSettingsLink({ client, hash: 'support' })}
                target="_self"
                title={t('contact')}
              >
                <MenuIcon icon={EmailIcon} />
                {t('contact')}
              </a>
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
}

SettingsContent.defaultProps = {
  shoulDisplayViewOfferButton: false
}

SettingsContent.propTypes = {
  shoulDisplayViewOfferButton: PropTypes.bool,
  onLogOut: PropTypes.func.isRequired,
  storageData: PropTypes.object,
  isDrawer: PropTypes.bool
}
export default SettingsContent
