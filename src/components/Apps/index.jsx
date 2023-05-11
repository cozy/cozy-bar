import React, { Component } from 'react'
import PropTypes from 'prop-types'

import AppsContent from 'components/Apps/AppsContent'
import AppNavButtons from 'components/Apps/AppNavButtons'

class Apps extends Component {
  constructor(props) {
    super(props)
    this.state = {
      opened: false
    }
  }

  componentDidMount() {
    document.body.addEventListener('click', this.onClickOutside)
    this.modalContainer = document.getElementById('cozy-bar-modal-dom-place')
  }

  componentWillUnmount() {
    document.body.removeEventListener('click', this.onClickOutside)
  }

  onClickOutside = event => {
    if (this.state.opened) {
      // if it's not a cozy-bar nav popup, close the opened popup
      if (
        !this.rootRef.contains(event.target) &&
        !this.modalContainer.contains(event.target)
      ) {
        this.setState({ opened: false })
        event.stopPropagation()
      }
    }
  }

  toggleMenu = () => {
    this.setState({ opened: !this.state.opened })
  }

  // data-tutorial attribute allows to be targeted in an application tutorial
  render() {
    const {
      appName,
      appNamePrefix,
      appSlug,
      iconPath,
      isPublic,
      isInvertedTheme
    } = this.props
    const { opened } = this.state
    return (
      <nav
        className="coz-nav coz-nav-apps"
        ref={ref => {
          this.rootRef = ref
        }}
      >
        <AppNavButtons
          appName={appName}
          appNamePrefix={appNamePrefix}
          appSlug={appSlug}
          iconPath={iconPath}
          handleClick={this.toggleMenu}
          opened={opened}
          isPublic={isPublic}
          isInvertedTheme={isInvertedTheme}
        />
        <div
          className="coz-nav-pop coz-nav-pop--apps"
          id="coz-nav-pop--apps"
          aria-hidden={!opened}
        >
          <AppsContent isInvertedTheme={isInvertedTheme} />
        </div>
      </nav>
    )
  }
}

Apps.propTypes = {
  appName: PropTypes.string,
  appNamePrefix: PropTypes.string,
  appSlug: PropTypes.string,
  iconPath: PropTypes.string,
  isPublic: PropTypes.bool,
  isInvertedTheme: PropTypes.bool
}

export default Apps
