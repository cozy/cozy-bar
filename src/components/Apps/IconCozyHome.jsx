import React, { PureComponent } from 'react'

import AppIcon from 'cozy-ui/react/AppIcon'

import stack from 'lib/stack'
import homeIcon from 'assets/sprites/icon-cozy-home.svg'

class IconCozyHome extends PureComponent {
  render() {
    const { className } = this.props
    const fetchIcon = () =>
      `${stack.get.cozyURL()}/assets/images/icon-cozy-home.svg`

    return (
      <AppIcon
        fetchIcon={fetchIcon}
        fallbackIcon={homeIcon}
        className={className}
      />
    )
  }
}

export default IconCozyHome
