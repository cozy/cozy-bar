import React, { Component } from 'react'
import { translate } from '../lib/I18n'

import AppsList from './AppsList'
import Settings from './Settings'

import { getCategorizedItems } from '../lib/helpers'

class Drawer extends Component {
  constructor (props, context) {
    super(props)
    this.store = context.store

    this.onDrawerClick = this.onDrawerClick.bind(this)
  }

  onDrawerClick (event) {
    if (event.target === this.wrapperRef) {
      this.props.onClose()
    }
  }

  async componentWillMount () {
    await this.store.fetchAppsList()
    await this.store.fetchSettingsData()
  }

  componentDidMount () {
    this.asideRef.addEventListener('transitionend', this.props.drawerListener)
  }

  async componentWillReceiveProps (nextProps) {
    if (nextProps.visible) {
      await this.store.fetchAppsList()
      await this.store.fetchSettingsData()
    }
  }

  render () {
    const { t, onClaudy, visible } = this.props
    const { appsList, settingsData } = this.store
    const categories = getCategorizedItems(appsList, t)
    return (
      <div className='coz-drawer-wrapper'
        onClick={this.onDrawerClick}
        aria-hidden={visible ? 'false' : 'true'}
        ref={(node) => { this.wrapperRef = node }}
      >
        <aside ref={(node) => { this.asideRef = node }}>
          <nav className='coz-drawer--apps'>
            <AppsList categories={categories} wrappingLimit={3} />
          </nav>
          <hr className='coz-sep-flex' />
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
