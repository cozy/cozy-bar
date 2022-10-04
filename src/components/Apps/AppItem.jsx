import React from 'react'
import get from 'lodash/get'
import { appShape } from 'proptypes/index'
import { models } from 'cozy-client'

import AppIcon from 'cozy-ui/react/AppIcon'
import AppLinker from 'cozy-ui/react/AppLinker'
import HomeIcon from 'components/Apps/IconCozyHome'
import stack from 'lib/stack'
import PropTypes from 'prop-types'

const getAppDisplayName = get(models, 'applications.getAppDisplayName', app => {
  return app.namePrefix && app.namePrefix.toLowerCase() !== 'cozy'
    ? `${app.namePrefix} ${app.name}`
    : app.name
})

export class AppItem extends React.Component {
  /**
   * Used to add query params to AppLinker links, useful in overrides
   * @param  {Object} props   AppItem props
   * @param  {Object} context AppItem context
   * @return {Object}         Query string parameters as object
   */
  static buildQueryParams = () => {
    // default behaviour
    return null
  }

  constructor(props) {
    super(props)
    this.onAppSwitch = this.onAppSwitch.bind(this)
  }

  componentWillUnmount() {
    if (this.switchTimeout) clearTimeout(this.switchTimeout)
  }

  buildAppUrl(href) {
    let url
    try {
      url = new URL(href)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error.message)
      return null
    }
    const queryParams = AppItem.buildQueryParams(this.props, this.context)
    if (queryParams) {
      for (const name in queryParams) {
        url.searchParams.append(name, queryParams[name])
      }
    }
    return url.toString()
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
    const { useHomeIcon, app } = this.props
    const dataIcon = app.slug ? `icon-${app.slug}` : ''
    const appName = getAppDisplayName(app)

    return (
      <AppLinker
        onAppSwitch={this.onAppSwitch}
        slug={app.slug}
        href={this.buildAppUrl(app.href) || ''}
        app={app}
      >
        {({ onClick, href }) => {
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
                title={appName}
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
                <p className="coz-label">{appName}</p>
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

export default AppItem
