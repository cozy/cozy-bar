import React from 'react'
import { translate } from 'cozy-ui/react/I18n'

import AppIcon from './AppIcon'
import PermsModal from './PermsModal'
import AppIconGroup from './AppIconGroup'

export const FakeAppsList = ({ t, currentApp, onAuthorizeClick }) => (
  <div className='coz-app-list-forbidden'>
    <AppIconGroup category='Categories.cozy' blurry>
      <AppIcon label='Cozy Drive' iconSrc={require('../assets/icons/apps/icon-drive.svg')} />
      <AppIcon label='Cozy Photos' iconSrc={require('../assets/icons/apps/icon-photos.svg')} />
      <AppIcon label='Cozy Collect' iconSrc={require('../assets/icons/apps/icon-collect.svg')} />
      <AppIcon label='Cozy Store' comingSoon iconSrc={require('../assets/icons/apps/icon-store.svg')} />
    </AppIconGroup>
    <PermsModal currentApp={currentApp} onAuthorizeClick={onAuthorizeClick} />
  </div>
)

export default translate()(FakeAppsList)
