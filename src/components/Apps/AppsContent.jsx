import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { translate } from 'cozy-ui/transpiled/react/I18n'
import Icon from 'cozy-ui/transpiled/react/Icon'
import CloudIcon from 'cozy-ui/transpiled/react/Icons/Cloud'
import withBreakpoints from 'cozy-ui/transpiled/react/helpers/withBreakpoints'

import { getApps, getHomeApp, isFetchingApps } from 'lib/reducers'
import AppItem from 'components/Apps/AppItem'
import AppItemPlaceholder from 'components/Apps/AppItemPlaceholder'

const sorter = fn => (itemA, itemB) => fn(itemA) > fn(itemB)

export class AppsContent extends Component {
  constructor(props, context) {
    super(props, context)
    this.translateApp = translateApp(this.props.t)
  }

  render() {
    const {
      t,
      apps,
      breakpoints,
      homeApp,
      isFetchingApps,
      onAppSwitch,
      isInvertedTheme
    } = this.props
    const { isMobile } = breakpoints
    const isHomeApp = homeApp && homeApp.isCurrentApp
    const homeSlug = homeApp && homeApp.slug

    if (!isFetchingApps && (!apps || !apps.length)) {
      return <p className="coz-nav--error coz-nav-group">{t('no_apps')}</p>
    }

    return (
      <div className="coz-nav-pop-content">
        <ul className="coz-nav-group">
          {isMobile && homeApp && (
            <AppItem
              app={homeApp}
              useHomeIcon
              onAppSwitch={onAppSwitch}
              isInvertedTheme={isInvertedTheme}
            />
          )}
          {isFetchingApps
            ? new Array(3)
                .fill({})
                .map((nothing, index) => <AppItemPlaceholder key={index} />)
            : apps
                .filter(app => app.slug !== homeSlug)
                .sort(sorter(this.translateApp))
                .map((app, index) => (
                  <AppItem
                    app={app}
                    key={index}
                    onAppSwitch={onAppSwitch}
                    isInvertedTheme={isInvertedTheme}
                  />
                ))}
        </ul>
        {homeApp && !isMobile && !isHomeApp && (
          <a role="menuitem" href={homeApp.href} className="coz-apps-home-btn">
            <Icon icon={CloudIcon} />
            {t('menu.home')}
          </a>
        )}
      </div>
    )
  }
}

AppsContent.propTypes = {
  homeApp: PropTypes.shape({
    isCurrentApp: PropTypes.bool,
    slug: PropTypes.string,
    href: PropTypes.string
  }),
  apps: PropTypes.array,
  isFetchingApps: PropTypes.bool.isRequired,
  onAppSwitch: PropTypes.func,
  isInvertedTheme: PropTypes.bool
}
const translateApp = t => app => {
  const namePrefix = app.namePrefix
    ? t(`${app.slug}.namePrefix`, { _: app.namePrefix })
    : null
  const name = t(`${app.slug}.name`, { _: app.name })
  return namePrefix ? `${namePrefix} ${name}` : `${name}`
}

const mapStateToProps = state => ({
  apps: getApps(state),
  homeApp: getHomeApp(state),
  isFetchingApps: isFetchingApps(state)
})

export default connect(mapStateToProps)(
  translate()(withBreakpoints()(AppsContent))
)
