import React from 'react'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import Icon from 'cozy-ui/transpiled/react/Icon'
import HelpOutlinedIcon from 'cozy-ui/transpiled/react/Icons/HelpOutlined'

const openHelpLink = () => {
  window.open('https://support.cozy.io/', '_blank', 'noopener, noreferrer')
}

const HelpLink = () => {
  return (
    <IconButton onClick={openHelpLink} className="u-p-half">
      <Icon icon={HelpOutlinedIcon} size="18" />
    </IconButton>
  )
}

export default HelpLink
