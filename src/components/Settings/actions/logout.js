import React, { forwardRef } from 'react'

import { isFlagshipApp } from 'cozy-device-helper'
import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Icon from 'cozy-ui/transpiled/react/Icon'
import LogoutIcon from 'cozy-ui/transpiled/react/Icons/Logout'

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

Component.displayName = 'LogoutAction'

export const logout = ({ t, onLogOut }) => {
  const icon = LogoutIcon
  const label = t('logout')

  return {
    name: 'logout',
    icon,
    label,
    action: async (_, { client, webviewIntent }) => {
      if (onLogOut && typeof onLogOut === 'function') {
        const res = onLogOut()
        if (res instanceof Promise) {
          await res
        }
      } else {
        await client.logout()

        return isFlagshipApp() && webviewIntent
          ? webviewIntent.call('logout')
          : window.location.reload()
      }
    },
    Component
  }
}
