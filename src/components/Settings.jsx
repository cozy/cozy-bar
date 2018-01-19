import React from 'react'

import { translate } from 'cozy-ui/react/I18n'

import StorageData from './StorageData'

const Settings = ({ t, onLogOut, settingsData, onClaudy, isDrawer = false, isClaudyLoading, toggleSupport }) => (
  <div>
    {isDrawer && <hr />}
    {settingsData.settingsAppURL &&
      <ul className='coz-nav-group'>
        <li className='coz-nav-item'>
          <a role='menuitem'
            href={`${settingsData.settingsAppURL}#/profile`}
            target='_self' data-icon='icon-profile' title={t('profile')}
          >
            <p className='coz-label'>{t('profile')}</p>
          </a>
        </li>
        <li className='coz-nav-item'>
          <a role='menuitem'
            href={`${settingsData.settingsAppURL}#/connectedDevices`}
            target='_self' data-icon='icon-connectedDevices'
            title={t('connectedDevices')}
          >
            <p className='coz-label'>{t('connectedDevices')}</p>
          </a>
        </li>
        <hr />
      </ul>
    }
    {isDrawer && onClaudy &&
      <ul className='coz-nav-group'>
        <li className='coz-nav-item'>
          <button role='menuitem' data-icon='icon-claudy' aria-busy={isClaudyLoading} onClick={onClaudy} title={t('claudy.title')}>
            {t('claudy.title')}
          </button>
        </li>
        <hr />
      </ul>
    }
    {!isDrawer && settingsData.storageData &&
      <ul className='coz-nav-group'>
        <li className='coz-nav-item'>
          <a
            role='menuitem'
            data-icon='icon-storage'
            target='_self'
            title={t('storage')}
            href={`${settingsData.settingsAppURL}#/storage`}
          >
            {t('storage')}
            <StorageData data={settingsData.storageData} />
          </a>
        </li>
        <hr />
      </ul>
    }
    <ul className='coz-nav-group'>
      <li className='coz-nav-item'>
        <a role='menuitem' onClick={toggleSupport} data-icon='icon-help' title={t('help')}>
          <p className='coz-label'>{t('help')}</p>
        </a>
      </li>
      <hr />
    </ul>
    <ul className='coz-nav-group'>
      <li className='coz-nav-item'>
        <button role='menuitem' data-icon='icon-logout' onClick={onLogOut} title={t('logout')}>
          {t('logout')}
        </button>
      </li>
    </ul>
  </div>
)

export default translate()(Settings)
