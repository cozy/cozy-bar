import React, { useRef, useState } from 'react'

import AppsMenuContent from 'components/AppsMenu/AppsMenuContent'

import IconButton from 'cozy-ui/transpiled/react/IconButton'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Menu from 'cozy-ui/transpiled/react/Menu'
import MosaicIcon from 'cozy-ui/transpiled/react/Icons/Mosaic'
import { useBreakpoints } from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { Dialog } from 'cozy-ui/transpiled/react/CozyDialogs'

const AppsMenu = () => {
  const [isOpen, setOpen] = useState(false)
  const buttonRef = useRef()

  const { isMobile } = useBreakpoints()

  const toggleMenu = () => {
    setOpen(!isOpen)
  }

  return (
    <nav>
      <IconButton ref={buttonRef} onClick={toggleMenu} className="u-p-half">
        <Icon icon={MosaicIcon} size="18" />
      </IconButton>
      {isMobile ? (
        <Dialog
          open={isOpen}
          size="small"
          onClose={toggleMenu}
          content={<AppsMenuContent />}
        />
      ) : (
        <Menu
          open={isOpen}
          anchorEl={buttonRef.current}
          container={buttonRef.current}
          getContentAnchorEl={null}
          onClose={toggleMenu}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
          transformOrigin={{
            vertical: -10
          }}
        >
          <AppsMenuContent />
        </Menu>
      )}
    </nav>
  )
}

export default AppsMenu
