import React, { useRef, useEffect, useCallback, useState } from 'react'
import PropTypes from 'prop-types'

import AppsContent from 'components/Apps/AppsContent'
import AppNavButtons from 'components/Apps/AppNavButtons'

const Apps = ({
  appName,
  appNamePrefix,
  appSlug,
  iconPath,
  isPublic,
  isInvertedTheme
}) => {
  const [isOpen, setOpen] = useState()
  const rootRef = useRef()
  const modalContainer = useRef()

  const onClickOutside = useCallback(
    event => {
      if (isOpen) {
        // if it's not a cozy-bar nav popup, close the opened popup
        if (
          !rootRef.current.contains(event.target) &&
          !modalContainer.current.contains(event.target)
        ) {
          setOpen(false)
          event.stopPropagation()
        }
      }
    },
    [isOpen]
  )

  useEffect(() => {
    document.body.addEventListener('click', onClickOutside)
    modalContainer.current = document.getElementById('cozy-bar-modal-dom-place')
    return () => {
      document.body.removeEventListener('click', onClickOutside)
    }
  }, [onClickOutside])

  const toggleMenu = () => {
    setOpen(!isOpen)
  }

  // data-tutorial attribute allows to be targeted in an application tutorial
  return (
    <nav className="coz-nav coz-nav-apps" ref={rootRef}>
      <AppNavButtons
        appName={appName}
        appNamePrefix={appNamePrefix}
        appSlug={appSlug}
        iconPath={iconPath}
        handleClick={toggleMenu}
        opened={isOpen}
        isPublic={isPublic}
        isInvertedTheme={isInvertedTheme}
      />
      <div
        className="coz-nav-pop coz-nav-pop--apps"
        id="coz-nav-pop--apps"
        aria-hidden={!isOpen}
      >
        <AppsContent isInvertedTheme={isInvertedTheme} />
      </div>
    </nav>
  )
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
