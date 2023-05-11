import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import AppIcon from 'cozy-ui/react/AppIcon'

import stack from 'lib/stack'
import homeIcon from 'assets/sprites/icon-cozy-home.svg'

class IconCozyHome extends PureComponent {
  render() {
    const { className, isInvertedTheme } = this.props
    const fetchIcon = () => {
      if (isInvertedTheme) {
        return `${stack.get.cozyURL()}/assets/images/icon-cozy-home-inverted.svg`
      }
      return `${stack.get.cozyURL()}/assets/images/icon-cozy-home.svg`
    }

    return (
      <AppIcon
        fetchIcon={fetchIcon}
        fallbackIcon={homeIcon}
        className={className}
      />
    )
  }
}

IconCozyHome.propTypes = {
  className: PropTypes.string,
  isInvertedTheme: PropTypes.bool
}

export default IconCozyHome
