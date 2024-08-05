import React from 'react'
import PropTypes from 'prop-types'

import { useInstanceInfo } from 'cozy-client'
import {
  makeActions,
  divider
} from 'cozy-ui/transpiled/react/ActionsMenu/Actions'
import ActionsMenu from 'cozy-ui/transpiled/react/ActionsMenu'
import ActionsItems from 'cozy-ui/transpiled/react/ActionsMenu/ActionsItems'

import {
  profile,
  appearance,
  plans,
  storage,
  permissions,
  connectedDevices,
  connections,
  help,
  contact,
  logout
} from 'components/Settings/actions'
import useI18n from 'components/useI18n'

const SettingsContent = ({
  anchorRef,
  instanceInfo,
  onLogOut,
  isDrawer,
  onClose
}) => {
  const { t } = useI18n()

  const actions = makeActions(
    [
      profile,
      appearance,
      plans,
      storage,
      permissions,
      divider,
      connectedDevices,
      connections,
      divider,
      help,
      contact,
      logout
    ],
    {
      t,
      instanceInfo,
      onLogOut
    }
  )

  if (isDrawer) return <ActionsItems actions={actions} />

  return (
    <ActionsMenu
      ref={anchorRef}
      open={true}
      docs={[]}
      actions={actions}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right'
      }}
      autoClose
      onClose={onClose}
    />
  )
}

SettingsContent.propTypes = {
  instanceInfo: PropTypes.object,
  onLogOut: PropTypes.func,
  isDrawer: PropTypes.bool
}

const SettingsContentWithQuery = props => {
  const { isLoaded, ...instanceInfo } = useInstanceInfo()

  if (!isLoaded) return null

  return <SettingsContent instanceInfo={instanceInfo} {...props} />
}

SettingsContentWithQuery.defaultProps = {
  isDrawer: false
}

SettingsContentWithQuery.propTypes = {
  onLogOut: PropTypes.func,
  isDrawer: PropTypes.bool
}

export default SettingsContentWithQuery
