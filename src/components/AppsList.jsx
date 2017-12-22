/* global __TARGET__ */
import React, { Component } from 'react'
import { connect } from 'react-redux'

import { translate } from 'cozy-ui/react/I18n'
import Button from 'cozy-ui/react/Button'
import { getApps, getAppsFiltered, getCurrentApp, fetchApps, isAppListForbidden } from '../lib/reducers'
import stack from '../lib/stack'

// TODO Add errors
class AppsList extends Component {
  componentDidMount () {
    this.props.fetchApps()
  }

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
    const { t, wrappingLimit } = this.props
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
                const label = (app.editor ? (app.editor + ' ') : '') + app.name
                return <AppIcon
                  label={label}
                  href={app.href}
                  dataIcon={dataIcon}
                  comingSoon={app.comingSoon}
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
  apps: __TARGET__ === 'mobile'
    ? getAppsFiltered(state)
    : getApps(state),
  isAppListForbidden: __TARGET__ === 'mobile'
    ? isAppListForbidden(state)
    : false
})

const mapDispatchToProps = dispatch => ({
  fetchApps: () => dispatch(fetchApps())
})

export default connect(mapStateToProps, mapDispatchToProps)(translate()(AppsList))

const AppIcon = translate()(({ t, label, dataIcon, iconSrc, href, comingSoon = false, blurry = false }) => (
  <li className='coz-nav-item'>
    <a role='menuitem' href={href} data-icon={dataIcon} className={comingSoon && 'coz-bar-coming-soon-app'} title={label}>
      {iconSrc &&
        <img src={iconSrc} alt='' width='64' height='64' className={blurry && 'blurry'} />
      }
      {comingSoon &&
        <span className='coz-bar-coming-soon-badge'>{t('soon')}</span>
      }
      <p className='coz-label'>{label}</p>
    </a>
  </li>
))

const AppIconGroup = translate()(({ t, category, children, wrapping = false, blurry = false }) => (
  <div className={blurry && 'blurry'}>
    <h2 className='coz-nav-category'>{t(category)}</h2>
    <ul className={`
      ${wrapping ? 'coz-nav-group coz-nav-group--wrapping' : 'coz-nav-group'}
    `}>
      {children}
    </ul>
    <hr />
  </div>
))

const FakeAppsList = translate()(({ t, currentApp, onAuthorizeClick }) => (
  <div className='coz-app-list-forbidden'>
    <AppIconGroup category='Categories.cozy' blurry>
      <AppIcon label='Cozy Drive' iconSrc={require('../assets/icons/apps/icon-drive.svg')} />
      <AppIcon label='Cozy Photos' iconSrc={require('../assets/icons/apps/icon-photos.svg')} />
      <AppIcon label='Cozy Collect' iconSrc={require('../assets/icons/apps/icon-collect.svg')} />
      <AppIcon label='Cozy Store' comingSoon iconSrc={require('../assets/icons/apps/icon-store.svg')} />
    </AppIconGroup>
    <PermsModal currentApp={currentApp} onAuthorizeClick={onAuthorizeClick} />
  </div>
))

const PermsModal = translate()(({ t, currentApp, onAuthorizeClick }) => (
  <div className='coz-perms-modal-wrapper'>
    <div className='coz-perms-modal'>
      <header>
        <a href='https://cozy.io' target='_blank' title='Cozy Website' class='shield' />
      </header>
      <h3>{t('permsModal.title')}</h3>
      <p>{t('permsModal.description', { app: currentApp })}</p>
      <Button theme='regular' onClick={onAuthorizeClick}>{t('permsModal.button')}</Button>
    </div>
  </div>
))
