import React, { forwardRef } from 'react'

import flag from 'cozy-flags'
import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Icon from 'cozy-ui/transpiled/react/Icon'
import HandIcon from 'cozy-ui/transpiled/react/Icons/Hand'

import { getSettingsLink } from 'components/Settings/helper'

const Component = forwardRef(({ action, ...props }, ref) => {
  return (
    <ActionsMenuItem {...props} ref={ref}>
      <ListItemIcon>
        <Icon icon={action.icon} />
      </ListItemIcon>
      <ListItemText primary={action.label} />
    </ActionsMenuItem>
  )
})

Component.displayName = 'PermissionsAction'

export const permissions = ({ t }) => {
  const icon = HandIcon
  const label = t('permissions')

  return {
    name: 'permissions',
    icon,
    label,
    displayCondition: () => flag('settings.permissions-dashboard'),
    action: (_, { client }) => {
      const link = getSettingsLink({ client, hash: 'permissions/slug' })
      window.open(link, '_self')
    },
    Component
  }
}
