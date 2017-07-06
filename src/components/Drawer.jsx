import React, { Component } from 'react'
import { translate } from 'cozy-ui/react/I18n'

import AppsList from './AppsList'
import Settings from './Settings'

import { getCategorizedItems } from '../lib/helpers'

class Drawer extends Component {
  constructor (props, context) {
    super(props)
    this.store = context.store
  }

  async componentWillMount () {
    await this.store.fetchAppsList()
    await this.store.fetchSettingsData()
  }

  async componentWillReceiveProps (nextProps) {
    if (nextProps.visible) {
      await this.store.fetchAppsList()
      await this.store.fetchSettingsData()
    }
  }

  render () {
    const { t, onClose, onClaudy, visible } = this.props
    const { appsList, settingsData } = this.store
    const categories = getCategorizedItems(appsList, t)
    return (
      <div class='coz-drawer-wrapper' onClick={onClose} aria-hidden={visible ? 'false' : 'true'}>
        <aside>
          <nav class='coz-drawer--apps'>
            <AppsList categories={categories} wrappingLimit={3} />
          </nav>
          <hr class='coz-sep-flex' />
          <nav>
            {settingsData &&
              <Settings
                onLogOut={() => this.store.logout()}
                settingsData={settingsData}
                onClaudy={onClaudy}
                isDrawer
              />
            }
          </nav>
        </aside>
      </div>
    )
  }
}

export default translate()(Drawer)
