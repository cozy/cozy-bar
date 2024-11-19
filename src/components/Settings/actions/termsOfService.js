import React, { forwardRef } from 'react'

import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Icon from 'cozy-ui/transpiled/react/Icon'
import ContractIcon from 'cozy-ui/transpiled/react/Icons/Contract'
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

Component.displayName = 'TermsOfServiceAction'

export const termsOfService = ({ t, instanceInfo }) => {
  const icon = ContractIcon
  const label = t('termsOfService')

  return {
    name: 'termsOfService',
    icon,
    label,
    action: () => {
      window.open(
        `https://files.cozycloud.cc/TOS${
          instanceInfo.instance.data.tos
            ? `-${instanceInfo.instance.data.tos}`
            : '-201711'
        }.pdf`,
        '_blank',
        'noopener, noreferrer'
      )
    },
    Component
  }
}
