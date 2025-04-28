import React, { useRef, useState } from 'react'

import AppsMenuContent from 'components/AppsMenu/AppsMenuContent'

import IconButton from 'cozy-ui/transpiled/react/IconButton'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Menu from 'cozy-ui/transpiled/react/Menu'
import MosaicIcon from 'cozy-ui/transpiled/react/Icons/Mosaic'
import { useBreakpoints } from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { ConfirmDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import { makeStyles } from 'cozy-ui/transpiled/react/styles'

const useStyles = makeStyles({
  root: {
    '& .dialogContentInner': {
      '& .dialogContentWrapper': {
        paddingBottom: '0 !important'
      }
    }
  }
})

const AppsMenu = () => {
  const [isOpen, setOpen] = useState(false)
  const containerRef = useRef()
  const buttonRef = useRef()

  const { isMobile } = useBreakpoints()

  const toggleMenu = () => {
    setOpen(!isOpen)
  }

  const styles = useStyles()

  return (
    <nav ref={containerRef}>
      <IconButton ref={buttonRef} onClick={toggleMenu} className="u-p-half">
        <Icon icon={MosaicIcon} size="18" />
      </IconButton>
      {isMobile ? (
        <ConfirmDialog
          open={isOpen}
          onClose={toggleMenu}
          content={<AppsMenuContent />}
          componentsProps={{
            dialogContent: {
              classes: styles
            }
          }}
          classes={{
            paper: 'u-bdrs-7'
          }}
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
          classes={{
            paper: 'u-bdrs-7'
          }}
        >
          <AppsMenuContent />
        </Menu>
      )}
    </nav>
  )
}

export default AppsMenu
