import React, { forwardRef } from 'react'

import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Icon from 'cozy-ui/transpiled/react/Icon'
import JusticeIcon from 'cozy-ui/transpiled/react/Icons/Justice'
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

Component.displayName = 'LegalNoticeAction'

export const legalNotice = ({ t, instanceInfo }) => {
  const icon = JusticeIcon
  const label = t('legalNotice')

  return {
    name: 'legalNotice',
    icon,
    label,
    displayCondition: () => !!instanceInfo.instance.data.legal_notice_url,
    action: () => {
      window.open(
        instanceInfo.instance.data.legal_notice_url,
        '_blank',
        'noopener, noreferrer'
      )
    },
    Component
  }
}
