import React, { forwardRef } from 'react'

import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Icon from 'cozy-ui/transpiled/react/Icon'
import PeopleIcon from 'cozy-ui/transpiled/react/Icons/People'

import { getSettingsLink } from 'components/Settings/helper'

const Component = forwardRef(({ action, ...props }, ref) => {
  return (
    <ActionsMenuItem {...props} ref={ref} color="primary">
      <ListItemIcon>
        <Icon icon={action.icon} />
      </ListItemIcon>
      <ListItemText primary={action.label} />
    </ActionsMenuItem>
  )
})

Component.displayName = 'ProfileAction'

export const profile = ({ t }) => {
  const icon = PeopleIcon
  const label = t('profile')

  return {
    name: 'profile',
    icon,
    label,
    action: (_, { client }) => {
      const link = getSettingsLink({ client, hash: 'profile' })
      window.open(link, '_self')
    },
    Component
  }
}
