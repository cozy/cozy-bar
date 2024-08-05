import React, { forwardRef } from 'react'

import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Icon from 'cozy-ui/transpiled/react/Icon'
import GraphCircleIcon from 'cozy-ui/transpiled/react/Icons/GraphCircle'

import StorageData from 'components/Settings/StorageData'
import { getSettingsLink } from 'components/Settings/helper'

const Component = forwardRef(({ action, ...props }, ref) => {
  return (
    <ActionsMenuItem {...props} ref={ref}>
      <ListItemIcon>
        <Icon icon={action.icon} />
      </ListItemIcon>
      <ListItemText
        primary={action.label}
        secondary={<StorageData />}
        secondaryTypographyProps={{
          variant: 'body1',
          color: 'textSecondary',
          component: 'div'
        }}
      />
    </ActionsMenuItem>
  )
})

Component.displayName = 'StorageAction'

export const storage = ({ t }) => {
  const icon = GraphCircleIcon
  const label = t('storage')

  return {
    name: 'storage',
    icon,
    label,
    action: (_, { client }) => {
      const link = getSettingsLink({ client, hash: 'storage' })
      window.open(link, '_self')
    },
    Component
  }
}
