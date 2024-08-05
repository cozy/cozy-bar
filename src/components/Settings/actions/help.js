import React, { forwardRef } from 'react'

import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Icon from 'cozy-ui/transpiled/react/Icon'
import HelpIcon from 'cozy-ui/transpiled/react/Icons/Help'
import OpenwithIcon from 'cozy-ui/transpiled/react/Icons/Openwith'

const Component = forwardRef(({ action, ...props }, ref) => {
  return (
    <ActionsMenuItem {...props} ref={ref}>
      <ListItemIcon>
        <Icon icon={action.icon} />
      </ListItemIcon>
      <ListItemText primary={action.label} />
      <ListItemIcon>
        <Icon icon={OpenwithIcon} />
      </ListItemIcon>
    </ActionsMenuItem>
  )
})

Component.displayName = 'HelpAction'

export const help = ({ t }) => {
  const icon = HelpIcon
  const label = t('help')

  return {
    name: 'help',
    icon,
    label,
    action: () => {
      window.open('https://support.cozy.io/', '_blank', 'noopener, noreferrer')
    },
    Component
  }
}
