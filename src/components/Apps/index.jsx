import React, { Component } from 'react'

import AppsContent from 'components/Apps/AppsContent'
import AppNavButtons from 'components/Apps/AppNavButtons'

class Nav extends Component {
  constructor(props) {
    super(props)
    this.state = {
      busy: false,
      opened: false
    }
    this.toggleMenu = this.toggleMenu.bind(this)
  }

  componentDidMount() {
    document.body.addEventListener('click', this.onClickOutside)
  }

  componentWillUnmount() {
    document.body.removeEventListener('click', this.onClickOutside)
  }

  onClickOutside = event => {
    if (this.state.busy || this.state.opened) {
      // if it's not a cozy-bar nav popup, close the opened popup
      if (!this.rootRef.contains(event.target)) {
        this.setState({ busy: false, opened: false })
      }
      event.stopPropagation()
    }
  }

  toggleMenu = () => {
    this.setState({ opened: !this.state.opened })
  }

  // data-tutorial attribute allows to be targeted in an application tutorial
  render() {
    const {
      replaceTitleOnMobile,
      appName,
      appNamePrefix,
      appSlug,
      iconPath
    } = this.props
    const { busy, opened } = this.state
    return (
      <nav
        className={`coz-nav coz-nav-apps${
          replaceTitleOnMobile ? ' coz-bar-hide-sm' : ''
        }`}
        ref={ref => {
          this.rootRef = ref
        }}
      >
        <AppNavButtons
          appName={appName}
          appNamePrefix={appNamePrefix}
          appSlug={appSlug}
          iconPath={iconPath}
          busy={busy}
          onClick={this.toggleMenu}
          opened={opened}
        />
        <div
          className="coz-nav-pop coz-nav-pop--apps"
          id="coz-nav-pop--apps"
          aria-hidden={!opened}
        >
          <AppsContent />
        </div>
      </nav>
    )
  }
}

export default Nav
