import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import flag from 'cozy-flags'

import { isFlagshipApp } from 'cozy-device-helper'
import { useClient, useInstanceInfo, generateWebLink } from 'cozy-client'
import {
  hasAnOffer,
  shouldDisplayOffers,
  buildPremiumLink
} from 'cozy-client/dist/models/instance'
import { useWebviewIntent } from 'cozy-intent'
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

const SettingsContent = ({ instanceInfo, onLogOut, isDrawer }) => {
  const { t } = useI18n()
  const client = useClient()
  const webviewIntent = useWebviewIntent()
  const hasSubscription = flag('settings.subscription')

  const shouldDisplayViewOfferButton =
    shouldDisplayOffers(instanceInfo) || hasAnOffer(instanceInfo)

  const managerUrlPremiumLink =
    hasSubscription && client
      ? generateWebLink({
          cozyUrl: client.getStackClient().uri,
          hash: '/subscription',
          pathname: '/',
          slug: 'settings',
          subDomainType: client.getInstanceOptions().subdomain
        })
      : buildPremiumLink(instanceInfo)

  const logOut = useCallback(async () => {
    await client.logout()

    return isFlagshipApp() && webviewIntent
      ? webviewIntent.call('logout')
      : window.location.reload()
  }, [client, webviewIntent])

  const handleLogout = async () => {
    if (onLogOut && typeof onLogOut === 'function') {
      const res = onLogOut()
      if (res instanceof Promise) {
        await res
      }
    } else {
      logOut()
    }
  }

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
        {shouldDisplayViewOfferButton && (
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
              <StorageData />
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

        <NavItem>
          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            title={t('logout')}
          >
            <MenuIcon icon={LogoutIcon} /> {t('logout')}
          </button>
        </NavItem>
      </NavGroup>
    </div>
  )
}

SettingsContent.propTypes = {
  instanceInfo: PropTypes.object,
  onLogOut: PropTypes.func,
  isDrawer: PropTypes.bool
}

const SettingsContentWithQuery = props => {
  const { isLoaded, ...instanceInfo } = useInstanceInfo()

  if (!isLoaded) return null

  return <SettingsContent instanceInfo={instanceInfo} {...props} />
}

SettingsContentWithQuery.defaultProps = {
  isDrawer: false
}

SettingsContentWithQuery.propTypes = {
  onLogOut: PropTypes.func,
  isDrawer: PropTypes.bool
}

export default SettingsContentWithQuery
