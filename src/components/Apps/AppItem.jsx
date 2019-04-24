import React from 'react'
import { appShape } from 'proptypes/index'

import AppIcon from 'cozy-ui/react/AppIcon'
import AppLinker from 'cozy-ui/react/AppLinker'
import HomeIcon from 'components/Apps/IconCozyHome'
import { translate } from 'cozy-ui/react/I18n'
import stack from 'lib/stack'
import PropTypes from 'prop-types'

export class AppItem extends React.Component {
  constructor(props) {
    super(props)
    this.onAppSwitch = this.onAppSwitch.bind(this)
  }

  componentWillUnmount() {
    if (this.switchTimeout) clearTimeout(this.switchTimeout)
  }

  onAppSwitch() {
    const { onAppSwitch } = this.props
    if (typeof onAppSwitch === 'function') {
      this.switchTimeout = setTimeout(() => {
        onAppSwitch()
      }, 1000)
    }
  }

  render() {
    const { t, useHomeIcon, app } = this.props

    const dataIcon = app.slug ? `icon-${app.slug}` : ''

    return (
      <AppLinker onAppSwitch={this.onAppSwitch} slug={app.slug} href={app.href}>
        {({ onClick, href }) => {
          const label = t(`${app.slug}.name`, {
            _: app.namePrefix ? `${app.namePrefix} ${app.name}` : app.name
          })
          return (
            <li
              className={`coz-nav-apps-item${
                app.isCurrentApp ? ' --current' : ''
              }`}
            >
              <a
                role="menuitem"
                href={href}
                data-icon={dataIcon}
                title={label}
                onClick={onClick}
              >
                {useHomeIcon ? (
                  <HomeIcon className="coz-nav-apps-item-icon" />
                ) : (
                  <AppIcon
                    app={app}
                    className="coz-nav-apps-item-icon"
                    key={app.slug}
                    {...stack.get.iconProps()}
                  />
                )}
                <p className="coz-label">{label}</p>
              </a>
            </li>
          )
        }}
      </AppLinker>
    )
  }
}

AppItem.propTypes = {
  app: appShape.isRequired,
  useHomeIcon: PropTypes.bool
}

export default translate()(AppItem)
