import React from 'react'
import { translate } from 'cozy-ui/react/I18n'
import { Button } from 'cozy-ui/react/Button'

export const PermsModal = ({ t, currentApp, onAuthorizeClick }) => (
  <div className='coz-perms-modal-wrapper'>
    <div className='coz-perms-modal'>
      <header>
        <a href='https://cozy.io' target='_blank' title='Cozy Website' class='shield' />
      </header>
      <h3>{t('permsModal.title')}</h3>
      <p>{t('permsModal.description', { app: currentApp })}</p>
      <Button
        theme='regular'
        onClick={onAuthorizeClick}
        label={t('permsModal.button')}
      />
    </div>
  </div>
)

export default translate()(PermsModal)
