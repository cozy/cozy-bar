import React from 'react'
import PropTypes from 'prop-types'

import { translate } from 'cozy-ui/react/I18n'
import { Button, ButtonLink } from 'cozy-ui/react/Button'
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
  toggleSupport,
  shoulDisplayViewOfferButton,
  managerUrlPremiumLink
}) => (
  <div className="coz-nav-pop-content">
    {isDrawer && <hr />}
    {settingsAppURL && (
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
        <li className="coz-nav-settings-item">
          <a
            role="menuitem"
            href={`${settingsAppURL}#/connectedDevices`}
            target="_self"
            data-icon="icon-connectedDevices"
            title={t('connectedDevices')}
          >
            <p className="coz-label">{t('connectedDevices')}</p>
          </a>
        </li>
      </ul>
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
    {!isDrawer && storageData && (
      <ul className="coz-nav-group">
        <li className="coz-nav-settings-item">
          <a
            role="menuitem"
            data-icon="icon-storage"
            target="_self"
            title={t('storage')}
            href={`${settingsAppURL}#/storage`}
          >
            {t('storage')}
            <StorageData data={storageData} />
          </a>
        </li>
      </ul>
    )}
    {(!isDrawer || !isMobileApp()) && shoulDisplayViewOfferButton && (
      <ul className="coz-nav-group">
        <li className="coz-nav-settings-item">
          <ButtonLink
            subtle
            role="menuitem"
            className="coz-nav-settings-item-btn"
            icon="cloud-happy"
            title={t('view_offers')}
            label={t('view_offers')}
            href={managerUrlPremiumLink}
          />
        </li>
      </ul>
    )}

    {!isMobileApp() && (
      <ul className="coz-nav-group">
        <li className="coz-nav-settings-item">
          <Button
            type="button"
            role="menuitem"
            className="coz-nav-settings-item-btn"
            onClick={toggleSupport}
            icon="help"
            title={t('help')}
            label={t('help')}
          />
        </li>
      </ul>
    )}
    <ul className="coz-nav-group">
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
  isClaudyLoading: PropTypes.bool,
  toggleSupport: PropTypes.func.isRequired
}
export default translate()(SettingsContent)
