/* global __TARGET__ */
import React from 'react'

import { translate } from 'cozy-ui/transpiled/react/I18n'

import StorageData from 'components/Settings/StorageData'

const Settings = ({
  t,
  onLogOut,
  settingsAppURL,
  storageData,
  onClaudy,
  isDrawer = false,
  isClaudyLoading,
  toggleSupport
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
    {isDrawer &&
      onClaudy &&
      __TARGET__ !== 'mobile' && (
        <ul className="coz-nav-group">
          <li className="coz-nav-settings-item">
            <button
              type="button"
              role="menuitem"
              data-icon="icon-claudy"
              aria-busy={isClaudyLoading}
              onClick={onClaudy}
              title={t('claudy.title')}
            >
              {t('claudy.title')}
            </button>
          </li>
        </ul>
      )}
    {!isDrawer &&
      storageData && (
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
    {__TARGET__ !== 'mobile' && (
      <ul className="coz-nav-group">
        <li className="coz-nav-settings-item">
          <button
            type="button"
            role="menuitem"
            onClick={toggleSupport}
            data-icon="icon-help"
            title={t('help')}
          >
            {t('help')}
          </button>
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

export default translate()(Settings)
