import React, { forwardRef } from 'react'

import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Icon from 'cozy-ui/transpiled/react/Icon'
import GlobeIcon from 'cozy-ui/transpiled/react/Icons/Globe'

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

Component.displayName = 'ConnectionsAction'

export const connections = ({ t }) => {
  const icon = GlobeIcon
  const label = t('connections')

  return {
    name: 'connections',
    icon,
    label,
    action: (_, { client }) => {
      const link = getSettingsLink({ client, hash: 'sessions' })
      window.open(link, '_self')
    },
    Component
  }
}
