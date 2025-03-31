import React, { useRef, useState } from 'react'

import IconButton from 'cozy-ui/transpiled/react/IconButton'
import Menu from 'cozy-ui/transpiled/react/Menu'
import { useBreakpoints } from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { ConfirmDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import { useInstanceInfo } from 'cozy-client'

import UserMenuContent from 'components/UserMenu/UserMenuContent'
import AvatarMyself from './components/AvatarMyself'

const UserMenu = ({ onLogOut }) => {
  const [isOpen, setOpen] = useState(false)
  const containerRef = useRef()
  const buttonRef = useRef()

  const { isMobile } = useBreakpoints()

  const { isLoaded, instance, diskUsage } = useInstanceInfo()

  const toggleMenu = () => {
    setOpen(!isOpen)
  }

  return (
    <nav ref={containerRef}>
      <IconButton
        ref={buttonRef}
        onClick={toggleMenu}
        disabled={!isLoaded}
        className="u-p-0 u-ml-half"
      >
        <AvatarMyself size={isMobile ? 's' : 'm'} />
      </IconButton>
      {isMobile ? (
        <ConfirmDialog
          open={isOpen}
          onClose={toggleMenu}
          content={
            <UserMenuContent
              onLogOut={onLogOut}
              instance={instance}
              diskUsage={diskUsage}
            />
          }
        />
      ) : (
        <Menu
          open={isOpen}
          anchorEl={buttonRef.current}
          container={containerRef.current}
          getContentAnchorEl={null}
          onClose={toggleMenu}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
          transformOrigin={{
            vertical: -10,
            horizontal: 0
          }}
        >
          <UserMenuContent
            onLogOut={onLogOut}
            instance={instance}
            diskUsage={diskUsage}
          />
        </Menu>
      )}
    </nav>
  )
}

export default UserMenu
