import React from 'react'
import PropTypes from 'prop-types'

import flag from 'cozy-flags'
import { translate } from 'cozy-ui/react/I18n'
import { Button } from 'cozy-ui/react/Button'
import { isMobileApp } from 'cozy-device-helper'
import StorageData from 'components/Settings/StorageData'

const SettingsContent = ({
  t,
  onLogOut,
  settingsAppURL,
  storageData,
  onClaudy,
  isDrawer = false,
  isClaudyLoading,
  shoulDisplayViewOfferButton,
  managerUrlPremiumLink
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
            >
              <p className="coz-label">{t('connections')}</p>
            </a>
          </li>
        </ul>
      </>
    )}
    {isDrawer && onClaudy && !isMobileApp() && (
      <ul className="coz-nav-group">
        <li className="coz-nav-settings-item">
          <Button
            type="button"
            role="menuitem"
            className="coz-nav-settings-item-btn"
            icon="cloud"
            busy={isClaudyLoading}
            onClick={onClaudy}
            title={t('claudy.title')}
            label={t('claudy.title')}
          />
        </li>
      </ul>
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
        >
          {t('logout')}
        </button>
      </li>
    </ul>
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
