import React, { Component } from 'react'
import { connect } from 'react-redux'

import { fetchApps } from 'lib/reducers'

import AppsContent from './AppsContent'
import AppNavButtons from './AppNavButtons'

const BUSY_DELAY = 450

class Nav extends Component {
  constructor (props, context) {
    super(props)
    this.state = {
      busy: false,
      opened: false
    }
    this.toggleMenu = this.toggleMenu.bind(this)
  }

  componentDidMount () {
    document.body.addEventListener('click', this.onClickOutside)
  }

  componentWillUnmount () {
    document.body.removeEventListener('click', this.onClickOutside)
  }

  onClickOutside = event => {
    if (this.state.busy || this.state.opened) {
      // if it's not a cozy-bar nav popup, close the opened popup
      if (!this.rootRef.contains(event.target)) {
        this.setState({busy: false, opened: false})
      }
      event.stopPropagation()
    }
  }

  toggleMenu = async () => {
    let stateUpdate = {busy: false, opened: false}
    // if popup already opened, stop here to close it
    if (this.state.opened) return this.setState(stateUpdate)
    // display the loading spinner after BUSY_DELAY secs
    const busySpinner =
    setTimeout(() => this.setState({busy: true}), BUSY_DELAY)
    // fetch data
    await this.props.fetchApps()
    clearTimeout(busySpinner)
    this.setState({busy: false, opened: true})
  }

  // data-tutorial attribute allows to be targeted in an application tutorial
  render () {
    const { replaceTitleOnMobile, appName, appNamePrefix, iconPath } = this.props
    const { busy, opened } = this.state
    return (
      <nav className={`coz-nav coz-nav-apps${replaceTitleOnMobile ? ' coz-bar-hide-sm' : ''}`} ref={(ref) => { this.rootRef = ref }}>
        <AppNavButtons appName={appName} appNamePrefix={appNamePrefix} iconPath={iconPath} busy={busy} onClick={this.toggleMenu} opened={opened} />
        <div className='coz-nav-pop coz-nav-pop--apps' id='coz-nav-pop--apps' aria-hidden={!opened}>
          <AppsContent />
        </div>
      </nav>
    )
  }
}

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => ({
  fetchApps: () => dispatch(fetchApps())
})

export default connect(mapStateToProps, mapDispatchToProps)(Nav)
