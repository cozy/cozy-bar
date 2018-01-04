import React, { Component } from 'react'

import AppsList from './AppsList'
import Settings from './Settings'

class Drawer extends Component {
  constructor (props, context) {
    super(props)
    this.store = context.barStore
  }

  onDrawerClick = event => {
    if (event.target === this.wrapperRef) {
      this.props.onClose()
    }
  }

  async componentWillMount () {
    await this.store.fetchSettingsData()
  }

  componentDidMount () {
    this.asideRef.addEventListener('transitionend', this.props.drawerListener)
  }

  async componentWillReceiveProps (nextProps) {
    if (nextProps.visible) {
      await this.store.fetchSettingsData()
    }
  }

  render () {
    const { onClaudy, visible, isClaudyLoading, toggleSupport, renewToken, onLogOut } = this.props
    const { settingsData } = this.store
    return (
      <div className='coz-drawer-wrapper'
        onClick={this.onDrawerClick}
        aria-hidden={visible ? 'false' : 'true'}
        ref={(node) => { this.wrapperRef = node }}
      >
        <aside ref={(node) => { this.asideRef = node }}>
          <nav className='coz-drawer--apps'>
            <AppsList wrappingLimit={3} renewToken={renewToken} />
          </nav>
          <hr className='coz-sep-flex' />
          <nav className='coz-drawer--settings'>
            {settingsData &&
              <Settings
                onLogOut={() => {
                  if (onLogOut && typeof onLogOut === 'function') {
                    onLogOut()
                  } else {
                    this.store.logout()
                  }
                }}
                settingsData={settingsData}
                isClaudyLoading={isClaudyLoading}
                onClaudy={onClaudy}
                toggleSupport={toggleSupport}
                isDrawer
              />
            }
          </nav>
        </aside>
      </div>
    )
  }
}

export default Drawer
