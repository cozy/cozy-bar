import React, { forwardRef } from 'react'

import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Icon from 'cozy-ui/transpiled/react/Icon'
import DevicesIcon from 'cozy-ui/transpiled/react/Icons/Devices'

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

Component.displayName = 'ConnectedDevicesAction'

export const connectedDevices = ({ t }) => {
  const icon = DevicesIcon
  const label = t('connectedDevices')

  return {
    name: 'connectedDevices',
    icon,
    label,
    action: (_, { client }) => {
      const link = getSettingsLink({ client, hash: 'connectedDevices' })
      window.open(link, '_self')
    },
    Component
  }
}
