import React, { forwardRef } from 'react'

import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Icon from 'cozy-ui/transpiled/react/Icon'
import EmailIcon from 'cozy-ui/transpiled/react/Icons/Email'

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

Component.displayName = 'ContactAction'

export const contact = ({ t }) => {
  const icon = EmailIcon
  const label = t('contact')

  return {
    name: 'contact',
    icon,
    label,
    action: (_, { client }) => {
      const link = getSettingsLink({ client, hash: 'support' })
      window.open(link, '_self')
    },
    Component
  }
}
