/* global __TARGET__ */
import React, { Component } from 'react'
import { connect } from 'react-redux'

import { translate } from 'cozy-ui/react/I18n'
import { getApps, getCurrentApp, fetchApps, isAppListForbidden } from '../lib/reducers'
import stack from '../lib/stack'

import AppIconGroup from './AppIconGroup'
import AppIcon from './AppIcon'
import FakeAppsList from './FakeAppsList'

const COMING_SOON_WITH_DESCRIPTION = ['store']

// TODO Add errors
class AppsList extends Component {
  // Take an items array and return an array of category objects with the matching category slug and items
  getCategorizedApps = () => {
    const { t, apps } = this.props

    // No applications
    if (!apps || apps.length === 0) {
      return undefined
    }

    const categorizedAppsObject = apps.reduce((accumulator, app) => {
      if (!accumulator[app.category]) {
        accumulator[app.category] = []
      }
      accumulator[app.category].push(app)
      return accumulator
    }, {})

    return Object.keys(categorizedAppsObject)
      .map(category => {
        return {slug: category, items: categorizedAppsObject[category]}
      })
      // categories alphabetical sorting
      .sort((c1, c2) => {
        if (c1.slug === 'others') return 1
        if (c2.slug === 'others') return -1
        if (t(`Categories.${c1.slug}`) > t(`Categories.${c2.slug}`)) return 1
        if (t(`Categories.${c1.slug}`) < t(`Categories.${c2.slug}`)) return -1
        return 0
      })
  }

  onAppListAuthorize = () => {
    this.props.renewToken()
      .then(({ token }) => {
        stack.updateAccessToken(token.accessToken)
        this.props.fetchApps()
      })
  }

  render () {
    const { t, wrappingLimit, toggleComingSoon } = this.props
    const categories = this.getCategorizedApps()

    /*
    TODO: fix when categories have an error
    {categories.error &&
      <p className='coz-nav--error coz-nav-group'>
        {t(`error_${categories.error.name}`)}
      </p>
    }
    */

    if (!categories || categories.length === 0) {
      return this.props.renewToken
        ? <FakeAppsList currentApp={this.props.currentApp} onAuthorizeClick={this.onAppListAuthorize} />
        : <p className='coz-nav--error coz-nav-group'>{t('no_apps')}</p>
    }

    return (
      <div>
        {categories.map(category => {
          const wrapping = category.items.length > wrappingLimit
          return (
            <AppIconGroup category={`Categories.${category.slug}`} wrapping={wrapping}>
              {category.items && category.items.map(app => {
                const dataIcon = app.icon ? `icon-${app.slug}` : ''
                const iconSrc = app.icon && app.icon.cached
                  ? app.icon.src
                  : require('../assets/icons/16/icon-cube-16.svg')
                const blurry = !app.icon || !app.icon.cached
                const label = (app.namePrefix ? (app.namePrefix + ' ') : '') + app.name
                return <AppIcon
                  label={label}
                  href={app.href}
                  dataIcon={dataIcon}
                  comingSoon={app.comingSoon}
                  toggle={
                    COMING_SOON_WITH_DESCRIPTION.includes(app.slug)
                      ? () => toggleComingSoon(app.slug)
                      : false
                  }
                  iconSrc={iconSrc}
                  blurry={blurry} />
              })}
            </AppIconGroup>
          )
        })}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  currentApp: getCurrentApp(state),
  apps: getApps(state),
  isAppListForbidden: __TARGET__ === 'mobile'
    ? isAppListForbidden(state)
    : false
})

const mapDispatchToProps = dispatch => ({
  fetchApps: () => dispatch(fetchApps())
})

export default connect(mapStateToProps, mapDispatchToProps)(translate()(AppsList))
