import React, { useEffect, useState, useCallback } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { useBreakpoints } from 'cozy-ui/transpiled/react/providers/Breakpoints'
import Icon from 'cozy-ui/transpiled/react/Icon'
import { isFlagshipApp } from 'cozy-device-helper'
import flag from 'cozy-flags'
import { isTwakeTheme } from 'cozy-ui/transpiled/react/helpers/isTwakeTheme'
import { ButtonCozyHome } from 'components/Apps/ButtonCozyHome'
import Banner from 'components/Banner'
import Drawer from 'components/Drawer'
import Settings from 'components/Settings'
import Apps from 'components/Apps'
import AppsMenu from 'components/AppsMenu'
import UserMenu from 'components/UserMenu'
import {
  hasFetched,
  fetchApps,
  fetchContext,
  fetchSettingsData
} from 'lib/reducers'
import useI18n from 'components/useI18n'
import { useClient } from 'cozy-client'
import { AssistantDesktop } from 'cozy-search'
import SearchButton from './Search/SearchButton'

/* Generated with node_modules/.bin/svgr src/assets/sprites/icon-apps.svg */
function SvgIconApps(props) {
  return (
    <svg width={16} height={16} {...props}>
      <path
        d="M0 0h4v4H0V0zm0 6h4v4H0V6zm0 6h4v4H0v-4zM6 0h4v4H6V0zm0 6h4v4H6V6zm0 6h4v4H6v-4zm6-12h4v4h-4V0zm0 6h4v4h-4V6zm0 6h4v4h-4v-4z"
        fillRule="evenodd"
      />
    </svg>
  )
}

export const Bar = ({
  fetchContext,
  fetchSettingsData,
  fetchApps,
  isPublic,
  onDrawer,
  barLeft,
  barRight,
  barCenter,
  barSearch,
  onLogOut,
  userActionRequired,
  searchOptions,
  isInvertedTheme,
  appName,
  appNamePrefix,
  appSlug,
  iconPath,
  hasFetchedApps
}) => {
  const client = useClient()
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()
  const [drawerVisible, setDrawerVisible] = useState(false)
  const showDrawerAndBurger = !isPublic && isMobile
  const showSettings = !isPublic && !isMobile

  const fetchInitialData = useCallback(() => {
    if (!isPublic) {
      fetchContext()
      fetchSettingsData(false)
      if (!hasFetchedApps) {
        fetchApps()
      }
    }
  }, [fetchApps, fetchContext, fetchSettingsData, hasFetchedApps, isPublic])

  useEffect(() => {
    const handleTokenRefreshed = () => {
      fetchInitialData()
    }

    fetchInitialData()
    client.on('tokenRefreshed', handleTokenRefreshed)

    return () => {
      client.removeListener('tokenRefreshed', handleTokenRefreshed)
    }
  }, [client, fetchInitialData])

  useEffect(() => {
    if (!hasFetchedApps && drawerVisible) {
      fetchApps()
    }
  }, [drawerVisible, fetchApps, hasFetchedApps])

  const toggleDrawer = () => {
    onDrawer(!drawerVisible)
    setDrawerVisible(!drawerVisible)
  }

  const renderCenter = () => {
    return isTwakeTheme() ? (
      <AppsMenu />
    ) : (
      <Apps
        appName={appName}
        appNamePrefix={appNamePrefix}
        appSlug={appSlug}
        iconPath={iconPath}
        isPublic={isPublic}
        isInvertedTheme={isInvertedTheme}
      />
    )
  }

  const renderLeft = () => {
    if (isFlagshipApp() || flag('flagship.debug')) {
      return <ButtonCozyHome isInvertedTheme={isInvertedTheme} />
    }

    // data-tutorial attribute allows to be targeted in an application tutorial
    return showDrawerAndBurger ? (
      <button
        type="button"
        className="coz-bar-btn coz-bar-burger"
        onClick={toggleDrawer}
        data-tutorial="apps-mobile"
      >
        <Icon icon={SvgIconApps} width={16} height={16} color="currentColor" />
        <span className="u-visuallyhidden">{t('drawer')}</span>
      </button>
    ) : null
  }

  const renderRight = () => {
    if (isTwakeTheme()) {
      return <UserMenu />
    }

    return showSettings ? <Settings onLogOut={onLogOut} /> : null
  }

  const renderSearch = () => {
    return searchOptions.enabled && !isMobile ? (
      <div className="u-flex-grow u-mh-2">
        <AssistantDesktop
          componentsProps={{ SearchBarDesktop: { size: 'small' } }}
        />
      </div>
    ) : null
  }

  return (
    <div className="coz-bar-wrapper" data-testid="coz-bar-wrapper">
      <div id="cozy-bar-modal-dom-place" />
      <div className="coz-bar-container">
        {barLeft || renderLeft()}
        {barCenter || renderCenter()}
        <div className="u-flex-grow">{barSearch || renderSearch()}</div>
        {searchOptions.enabled && isMobile ? <SearchButton /> : null}
        {barRight || renderRight()}
        {showDrawerAndBurger ? (
          <Drawer
            visible={drawerVisible}
            onClose={toggleDrawer}
            drawerListener={() => onDrawer(drawerVisible)}
            onLogOut={onLogOut}
            isInvertedTheme={isInvertedTheme}
          />
        ) : null}
      </div>
      {userActionRequired && <Banner {...userActionRequired} />}
    </div>
  )
}

Bar.propTypes = {
  appName: PropTypes.string,
  appNamePrefix: PropTypes.string,
  appSlug: PropTypes.string,
  iconPath: PropTypes.string,
  isPublic: PropTypes.bool,
  isInvertedTheme: PropTypes.bool,
  onLogOut: PropTypes.func,
  onDrawer: PropTypes.func,
  userActionRequired: PropTypes.object
}

export const mapStateToProps = state => ({
  hasFetchedApps: hasFetched(state)
})

export const mapDispatchToProps = dispatch => ({
  fetchApps: () => dispatch(fetchApps()),
  fetchContext: () => dispatch(fetchContext()),
  fetchSettingsData: displayBusy => dispatch(fetchSettingsData(displayBusy))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Bar)
