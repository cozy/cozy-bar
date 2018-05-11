import React, { Component } from 'react'
import { connect } from 'react-redux'
import Spinner from 'cozy-ui/react/Spinner'

import { fetchApps, isAppListFetching } from '../lib/reducers'

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
    await this.props.fetchAppsList()
    await this.store.fetchSettingsData()
  }

  componentDidMount () {
    this.asideRef.addEventListener('transitionend', this.props.drawerListener)
  }

  async componentWillReceiveProps (nextProps) {
    if (!this.props.visible && nextProps.visible) {
      await this.props.fetchAppsList()
      await this.store.fetchSettingsData()
    }
  }

  render () {
    const { onClaudy, visible, isClaudyLoading, toggleSupport, renewToken, onLogOut, toggleComingSoon, isAppListFetching } = this.props
    const { settingsData } = this.store
    return (
      <div className='coz-drawer-wrapper'
        onClick={this.onDrawerClick}
        aria-hidden={visible ? 'false' : 'true'}
        ref={(node) => { this.wrapperRef = node }}
      >
        <aside ref={(node) => { this.asideRef = node }}>
          <nav className='coz-drawer--apps'>
            {isAppListFetching
              ? (
                <Spinner size='xlarge' middle />
              )
              : (
                <AppsList
                  wrappingLimit={3}
                  renewToken={renewToken}
                  toggleComingSoon={toggleComingSoon}
                />
              )
            }
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

const mapStateToProps = state => ({
  isAppListFetching: isAppListFetching(state)
})

const mapDispatchToProps = dispatch => ({
  fetchAppsList: () => dispatch(fetchApps())
})

export default connect(mapStateToProps, mapDispatchToProps)(Drawer)
