import React, { forwardRef } from 'react'

import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Icon from 'cozy-ui/transpiled/react/Icon'
import PaletteIcon from 'cozy-ui/transpiled/react/Icons/Palette'

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

Component.displayName = 'AppearanceAction'

export const appearance = ({ t }) => {
  const icon = PaletteIcon
  const label = t('appearance')

  return {
    name: 'appearance',
    icon,
    label,
    action: (_, { client }) => {
      const link = getSettingsLink({ client, hash: 'appearance' })
      window.open(link, '_self')
    },
    Component
  }
}
