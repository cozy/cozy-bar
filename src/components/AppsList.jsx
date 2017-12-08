import React, { Component } from 'react'
import { connect } from 'react-redux'

import { translate } from 'cozy-ui/react/I18n'
import { getApps, fetchApps } from '../lib/reducers'
import { getCategorizedItems } from '../lib/helpers'

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

    return (
      <div>
        {categories && categories.length
          ? categories.map(category => {
            const wrapping = category.items.length > wrappingLimit
            return (
              <div>
                <h2 className='coz-nav-category'>{t(`Categories.${category.slug}`)}</h2>
                <ul className={`
                    ${wrapping ? 'coz-nav-group coz-nav-group--wrapping' : 'coz-nav-group'}
                `}>
                  {category.items && category.items.map(app => {
                    const dataIcon = app.icon ? `icon-${app.slug}` : ''
                    const fileIcon = app.icon && app.icon.cached
                      ? { src: app.icon.src }
                      : {
                        src: require('../assets/icons/16/icon-cube-16.svg'),
                        class: 'blurry'
                      }
                    const label = (app.editor ? (app.editor + ' ') : '') + app.name
                    return app.comingSoon
                      ? <li className='coz-nav-item'>
                        <a role='menuitem' data-icon={dataIcon} className='coz-bar-coming-soon-app' title={label}>
                          {fileIcon &&
                          <img src={fileIcon.src} alt='' width='64' height='64' className={fileIcon.class ? fileIcon.class : ''} />
                          }
                          <span className='coz-bar-coming-soon-badge'>{t('soon')}</span>
                          <p className='coz-label'>{label}</p>
                        </a>
                      </li>
                      : <li className='coz-nav-item'>
                        <a role='menuitem' href={app.href} data-icon={dataIcon} title={label}>
                          {fileIcon &&
                          <img src={fileIcon.src} alt='' width='64' height='64' className={fileIcon.class ? fileIcon.class : ''} />
                          }
                          <p className='coz-label'>{label}</p>
                        </a>
                      </li>
                  })}
                </ul>
                <hr />
              </div>
            )
          })
          : <p className='coz-nav--error coz-nav-group'>{t('no_apps')}</p>
        }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  apps: getApps(state)
})

const mapDispatchToProps = dispatch => ({
  fetchApps: () => dispatch(fetchApps())
})

export default connect(mapStateToProps, mapDispatchToProps)(translate()(AppsList))
