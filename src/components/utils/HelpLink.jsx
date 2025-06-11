import React from 'react'
import { connect } from 'react-redux'

import IconButton from 'cozy-ui/transpiled/react/IconButton'
import Icon from 'cozy-ui/transpiled/react/Icon'
import HelpOutlinedIcon from 'cozy-ui/transpiled/react/Icons/HelpOutlined'

import { getHelpLink } from 'lib/reducers'

const HelpLink = ({ helpLink }) => {
  return (
    <IconButton
      component="a"
      href={helpLink}
      target="_blank"
      rel="noopener, noreferrer"
      className="u-p-half"
    >
      <Icon icon={HelpOutlinedIcon} size="18" />
    </IconButton>
  )
}

const mapStateToProps = state => ({
  helpLink: getHelpLink(state)
})

export default connect(mapStateToProps)(HelpLink)
