import React, { Component } from 'react'
import { connect } from 'react-redux'

import { translate } from 'cozy-ui/react/I18n'
import { getApps, fetchApps } from 'lib/reducers'

import AppItem from './AppItem'

class AppsContent extends Component {
  render () {
    const { t, apps } = this.props

    if (!apps || apps.length === 0) {
      return <p className='coz-nav--error coz-nav-group'>{t('no_apps')}</p>
    }

    return (
      <div className='coz-apps-list'>
        {apps.map(app => {
          return <AppItem app={app} />
        })}
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

export default connect(mapStateToProps, mapDispatchToProps)(translate()(AppsContent))
