import React, { forwardRef } from 'react'

import flag from 'cozy-flags'
import { generateWebLink } from 'cozy-client'
import {
  hasAnOffer,
  shouldDisplayOffers,
  buildPremiumLink
} from 'cozy-client/dist/models/instance'
import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Icon from 'cozy-ui/transpiled/react/Icon'
import CozyCircleIcon from 'cozy-ui/transpiled/react/Icons/CozyCircle'
import OpenwithIcon from 'cozy-ui/transpiled/react/Icons/Openwith'

const Component = forwardRef(({ action, ...props }, ref) => {
  return (
    <ActionsMenuItem {...props} ref={ref}>
      <ListItemIcon>
        <Icon icon={action.icon} />
      </ListItemIcon>
      <ListItemText primary={action.label} />
      {!flag('settings.subscription') && (
        <ListItemIcon>
          <Icon icon={OpenwithIcon} />
        </ListItemIcon>
      )}
    </ActionsMenuItem>
  )
})

Component.displayName = 'PlansAction'

export const plans = ({ t, instanceInfo }) => {
  const icon = CozyCircleIcon
  const label = t('plans')

  return {
    name: 'plans',
    icon,
    label,
    displayCondition: () =>
      shouldDisplayOffers(instanceInfo) || hasAnOffer(instanceInfo),
    action: (_, { client }) => {
      const link =
        flag('settings.subscription') && client
          ? generateWebLink({
              cozyUrl: client.getStackClient().uri,
              hash: '/subscription',
              pathname: '/',
              slug: 'settings',
              subDomainType: client.getInstanceOptions().subdomain
            })
          : buildPremiumLink(instanceInfo)
      window.open(link, '_self')
    },
    Component
  }
}
