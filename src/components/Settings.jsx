import React from 'react'

import { translate } from '../lib/I18n'

import StorageData from './StorageData'

const Settings = ({ t, onLogOut, settingsData, onClaudy, isDrawer = false }) => (
  <div>
    <hr />
    <ul class='coz-nav-group'>
      <li class='coz-nav-item'>
        <a role='menuitem'
          href={`${settingsData.settingsAppURL}#/profile`}
          target='_self' data-icon='icon-profile' title={t('profile')}
        >
          <p class='coz-label'>{t('profile')}</p>
        </a>
      </li>
      <li class='coz-nav-item'>
        <a role='menuitem'
          href={`${settingsData.settingsAppURL}#/connectedDevices`}
          target='_self' data-icon='icon-connectedDevices'
          title={t('connectedDevices')}
        >
          <p class='coz-label'>{t('connectedDevices')}</p>
        </a>
      </li>
    </ul>
    <hr />
    {isDrawer && onClaudy &&
      <ul class='coz-nav-group'>
        <li class='coz-nav-item'>
          <button role='menuitem' data-icon='icon-claudy' onClick={onClaudy} title={t('claudy.title')}>
            {t('claudy.title')}
          </button>
        </li>
      </ul>
    }
    {!isDrawer &&
      <ul class='coz-nav-group'>
        <li class='coz-nav-item'>
          <div role='menuitem' data-icon='icon-storage'>
            {t('storage')}
            <StorageData data={settingsData.storageData} />
          </div>
        </li>
      </ul>
    }
    <hr />
    <ul class='coz-nav-group'>
      <li class='coz-nav-item'>
        <a role='menuitem' href={settingsData.helpLink} target='_blank' data-icon='icon-help' title={t('help')}>
          <p class='coz-label'>{t('help')}</p>
        </a>
      </li>
    </ul>
    <hr />
    <ul class='coz-nav-group'>
      <li class='coz-nav-item'>
        <button role='menuitem' data-icon='icon-logout' onClick={onLogOut} title={t('logout')}>
          {t('logout')}
        </button>
      </li>
    </ul>
    <hr />
    <ul class='coz-nav-group coz-nav-group--inactive'>
      <li class='coz-nav-item'>
        <div role='menuitem'>
          <p class='coz-bar-text-item coz-bar-text-item--inactive'>{t('beta_status')}</p>
        </div>
      </li>
    </ul>
  </div>
)

export default translate()(Settings)
