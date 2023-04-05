import React from 'react'
import PropTypes from 'prop-types'

import flag from 'cozy-flags'
import { translate } from 'cozy-ui/react/I18n'
import { isMobileApp } from 'cozy-device-helper'
import StorageData from 'components/Settings/StorageData'

const SettingsContent = ({
  t,
  onLogOut,
  settingsAppURL,
  storageData,
  isDrawer = false,
  shoulDisplayViewOfferButton,
  managerUrlPremiumLink,
  tabIndex,
  ariaHidden
}) => (
  <div className="coz-nav-pop-content">
    {isDrawer && <hr />}
    {settingsAppURL && (
      <>
        <ul className="coz-nav-group">
          <li className="coz-nav-settings-item">
            <a
              role="menuitem"
              href={`${settingsAppURL}#/profile`}
              target="_self"
              data-icon="icon-profile"
              title={t('profile')}
              tabIndex={tabIndex}
              aria-hidden={ariaHidden}
            >
              <p className="coz-label">{t('profile')}</p>
            </a>
          </li>
          {(!isDrawer || !isMobileApp()) && shoulDisplayViewOfferButton && (
            <li className="coz-nav-settings-item">
              <a
                role="menuitem"
                href={managerUrlPremiumLink}
                target="_self"
                data-icon="icon-cozy-circle"
                title={t('plans')}
                tabIndex={tabIndex}
                aria-hidden={ariaHidden}
              >
                <p className="coz-label">{t('plans')}</p>
                <span
                  className="coz-nav-settings-item-openwith-icon"
                  data-icon="icon-openwith"
                ></span>
              </a>
            </li>
          )}
          {!isDrawer && storageData && (
            <>
              <li className="coz-nav-settings-item">
                <a
                  role="menuitem"
                  data-icon="icon-graph-circle"
                  target="_self"
                  title={t('storage')}
                  href={`${settingsAppURL}#/storage`}
                  className="coz-nav-settings-item-storage-link"
                  tabIndex={tabIndex}
                  aria-hidden={ariaHidden}
                >
                  {t('storage')}
                  <StorageData data={storageData} />
                </a>
              </li>
            </>
          )}
        </ul>
        <ul className="coz-nav-group">
          {flag('settings.permissions-dashboard') && (
            <li className="coz-nav-settings-item">
              <a
                role="menuitem"
                href={`${settingsAppURL}#/permissions/slug`}
                target="_self"
                data-icon="icon-hand"
                title={t('permissions')}
                tabIndex={tabIndex}
                aria-hidden={ariaHidden}
              >
                <p className="coz-label">{t('permissions')}</p>
              </a>
            </li>
          )}
          <li className="coz-nav-settings-item">
            <a
              role="menuitem"
              href={`${settingsAppURL}#/connectedDevices`}
              target="_self"
              data-icon="icon-devices"
              title={t('connectedDevices')}
              tabIndex={tabIndex}
              aria-hidden={ariaHidden}
            >
              <p className="coz-label">{t('connectedDevices')}</p>
            </a>
          </li>
          <li className="coz-nav-settings-item">
            <a
              role="menuitem"
              href={`${settingsAppURL}#/sessions`}
              target="_self"
              data-icon="icon-globe"
              title={t('connections')}
              tabIndex={tabIndex}
              aria-hidden={ariaHidden}
            >
              <p className="coz-label">{t('connections')}</p>
            </a>
          </li>
        </ul>
      </>
    )}
    <ul className="coz-nav-group">
      {!isMobileApp() && (
        <>
          <li className="coz-nav-settings-item">
            <a
              role="menuitem"
              href="https://support.cozy.io/"
              target="_blank"
              rel="noopener noreferrer"
              data-icon="icon-help"
              title={t('help')}
              tabIndex={tabIndex}
            >
              <p className="coz-label">{t('help')}</p>
              <span
                className="coz-nav-settings-item-openwith-icon"
                data-icon="icon-openwith"
              ></span>
            </a>
          </li>
          <li className="coz-nav-settings-item">
            <a
              role="menuitem"
              href={`${settingsAppURL}#/support`}
              target="_self"
              data-icon="icon-contact"
              title={t('contact')}
              tabIndex={tabIndex}
              aria-hidden={ariaHidden}
            >
              <p className="coz-label">{t('contact')}</p>
            </a>
          </li>
        </>
      )}
      <li className="coz-nav-settings-item">
        <button
          type="button"
          role="menuitem"
          data-icon="icon-logout"
          onClick={onLogOut}
          title={t('logout')}
          tabIndex={tabIndex}
          aria-hidden={ariaHidden}
        >
          {t('logout')}
        </button>
      </li>
    </ul>
  </div>
)

SettingsContent.defaultProps = {
  shoulDisplayViewOfferButton: false,
  tabIndex: -1
}

SettingsContent.propTypes = {
  shoulDisplayViewOfferButton: PropTypes.bool,
  t: PropTypes.func.isRequired,
  onLogOut: PropTypes.func.isRequired,
  settingsAppURL: PropTypes.string,
  storageData: PropTypes.object,
  isDrawer: PropTypes.bool,
  tabIndex: PropTypes.number,
  ariaHidden: PropTypes.bool
}
export default translate()(SettingsContent)
