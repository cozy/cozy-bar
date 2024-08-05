import React, { useRef, useState } from 'react'

import { useInstanceInfo } from 'cozy-client'

import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import GearIcon from 'cozy-ui/transpiled/react/Icons/Gear'

import SettingsContent from 'components/Settings/SettingsContent'
import useI18n from 'components/useI18n'

const Settings = ({ onLogOut }) => {
  const [isOpen, setOpen] = useState(false)
  const rootRef = useRef()
  const { t } = useI18n()
  const { isLoaded } = useInstanceInfo()

  return (
    <>
      <Button
        ref={rootRef}
        variant="text"
        aria-controls="simple-menu"
        aria-haspopup="true"
        color="default"
        busy={!isLoaded}
        startIcon={<Icon icon={GearIcon} />}
        label={t('menu.settings')}
        onClick={() => setOpen(v => !v)}
      />
      {isOpen && (
        <SettingsContent
          anchorRef={rootRef}
          onLogOut={onLogOut}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}

export default Settings
