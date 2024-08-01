import React, { useRef, useState } from 'react'

import { useClient, useInstanceInfo, generateWebLink } from 'cozy-client'
import {
  hasAnOffer,
  shouldDisplayOffers,
  buildPremiumLink
} from 'cozy-client/dist/models/instance'
import flag from 'cozy-flags'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import GearIcon from 'cozy-ui/transpiled/react/Icons/Gear'
import ClickAwayListener from 'cozy-ui/transpiled/react/ClickAwayListener'

import SettingsContent from 'components/Settings/SettingsContent'
import useI18n from 'components/useI18n'

const SettingsMenu = ({ isOpen, instanceInfo, onLogOut }) => {
  const client = useClient()
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

  return (
    <div
      className="coz-nav-pop coz-nav-pop--settings"
      id="coz-nav-pop--settings"
      aria-hidden={!isOpen}
    >
      <SettingsContent
        shoulDisplayViewOfferButton={shouldDisplayViewOfferButton}
        managerUrlPremiumLink={managerUrlPremiumLink}
        onLogOut={onLogOut}
      />
    </div>
  )
}

const SettingsWithQuery = ({ onLogOut }) => {
  const [isOpen, setOpen] = useState(false)
  const rootRef = useRef()
  const { t } = useI18n()
  const { isLoaded, ...instanceInfo } = useInstanceInfo()

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <div className="coz-nav coz-nav-settings" ref={rootRef}>
        <Button
          variant="text"
          aria-controls="coz-nav-pop--settings"
          color="default"
          busy={!isLoaded}
          startIcon={<Icon icon={GearIcon} />}
          label={t('menu.settings')}
          onClick={() => setOpen(v => !v)}
        />
        {isLoaded && (
          <SettingsMenu
            isOpen={isOpen}
            instanceInfo={instanceInfo}
            onLogOut={onLogOut}
          />
        )}
      </div>
    </ClickAwayListener>
  )
}

export default SettingsWithQuery
