import React, { useRef, useState } from 'react'

import { useInstanceInfo } from 'cozy-client'

import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import GearIcon from 'cozy-ui/transpiled/react/Icons/Gear'
import ClickAwayListener from 'cozy-ui/transpiled/react/ClickAwayListener'

import SettingsContent from 'components/Settings/SettingsContent'
import useI18n from 'components/useI18n'

const Settings = ({ onLogOut }) => {
  const [isOpen, setOpen] = useState(false)
  const rootRef = useRef()
  const { t } = useI18n()
  const { isLoaded } = useInstanceInfo()

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <div className="coz-nav coz-nav-settings" ref={rootRef}>
        <Button
          variant="text"
          aria-controls="coz-nav-pop--settings"
          color="default"
          busy={!isLoaded}
          startIcon={<Icon icon={GearIcon} />}
          label={t('menu.settings')}
          onClick={() => setOpen(v => !v)}
        />
        {isLoaded && (
          <div
            className="coz-nav-pop coz-nav-pop--settings"
            id="coz-nav-pop--settings"
            aria-hidden={!isOpen}
          >
            <SettingsContent onLogOut={onLogOut} />
          </div>
        )}
      </div>
    </ClickAwayListener>
  )
}

export default Settings
