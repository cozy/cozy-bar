import React from 'react'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import Icon from 'cozy-ui/transpiled/react/Icon'
import HelpOutlinedIcon from 'cozy-ui/transpiled/react/Icons/HelpOutlined'

const HelpLink = () => {
  return (
    <IconButton
      component="a"
      href="https://support.cozy.io/"
      target="_blank"
      rel="noopener, noreferrer"
      className="u-p-half"
    >
      <Icon icon={HelpOutlinedIcon} size="18" />
    </IconButton>
  )
}

export default HelpLink
