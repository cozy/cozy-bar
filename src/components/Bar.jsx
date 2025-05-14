import React, { useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import Grid from 'cozy-ui/transpiled/react/Grid'
import Divider from 'cozy-ui/transpiled/react/Divider'
import { useBreakpoints } from 'cozy-ui/transpiled/react/providers/Breakpoints'
import AppTitle from 'cozy-ui/transpiled/react/AppTitle'
import { isFlagshipApp } from 'cozy-device-helper'
import flag from 'cozy-flags'
import { ButtonCozyHome } from 'components/Apps/ButtonCozyHome'
import Banner from 'components/Banner'
import AppsMenu from 'components/AppsMenu'
import UserMenu from 'components/UserMenu'
import HelpLink from 'components/HelpLink'
import {
  getHomeApp,
  hasFetched,
  fetchApps,
  fetchContext,
  fetchSettingsData
} from 'lib/reducers'
import { useClient } from 'cozy-client'
import { AssistantDesktop } from 'cozy-search'
import SearchButton from './Search/SearchButton'
import cx from 'classnames'

export const Bar = ({
  fetchContext,
  fetchSettingsData,
  fetchApps,
  isPublic,
  barLeft,
  barRight,
  barCenter,
  barSearch,
  onLogOut,
  userActionRequired,
  searchOptions,
  isInvertedTheme,
  appSlug,
  hasFetchedApps,
  homeApp,
  componentsProps
}) => {
  const client = useClient()
  const { isMobile } = useBreakpoints()

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

  const renderCenter = () => {
    return null
  }

  const renderLeft = () => {
    if (isFlagshipApp() || flag('flagship.debug')) {
      return <ButtonCozyHome isInvertedTheme={isInvertedTheme} />
    }

    const homeHref = !isPublic && homeApp && homeApp.href

    if (isMobile) {
      return <ButtonCozyHome homeHref={homeHref} />
    }

    const isHome = appSlug === 'home'

    return (
      <Grid container alignItems="center" className="u-w-auto">
        {!isHome && (
          <>
            <ButtonCozyHome homeHref={homeHref} />
            <Divider orientation="vertical" className="u-mr-half" flexItem />
          </>
        )}
        <AppTitle slug={appSlug} />
      </Grid>
    )
  }

  const renderTwakeRight = () => {
    // Special case because search on Drive on mobile still rely
    // on old search UI that is injected in the cozy-bar and
    // not in a modal as the new search UI
    // So we need to hide these menu buttons when old search UI
    // is injected in the cozy-bar
    // When https://github.com/cozy/cozy-drive/pull/3320 will be merged
    // Drive will rely on cozy-bar embedded search and we will be able
    // to remove this special case
    if (appSlug === 'drive' && isMobile && barSearch) return null

    return (
      <>
        <HelpLink />
        <AppsMenu />
        <UserMenu onLogOut={onLogOut} />
      </>
    )
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
    <div
      {...componentsProps?.Wrapper}
      className={cx('coz-bar-wrapper', componentsProps?.Wrapper?.className)}
      data-testid="coz-bar-wrapper"
    >
      <div id="cozy-bar-modal-dom-place" />
      <div className="coz-bar-container">
        {barLeft || renderLeft()}
        {barCenter || renderCenter()}
        <div className="u-flex-grow">{barSearch || renderSearch()}</div>
        {searchOptions.enabled && isMobile ? <SearchButton /> : null}
        {barRight}
        {!isPublic && renderTwakeRight()}
      </div>
      {userActionRequired && <Banner {...userActionRequired} />}
    </div>
  )
}

Bar.propTypes = {
  appSlug: PropTypes.string,
  isPublic: PropTypes.bool,
  isInvertedTheme: PropTypes.bool,
  onLogOut: PropTypes.func,
  userActionRequired: PropTypes.object,
  componentsProps: PropTypes.shape({
    Wrapper: PropTypes.shape({
      className: PropTypes.string
    })
  })
}

export const mapStateToProps = state => ({
  hasFetchedApps: hasFetched(state),
  homeApp: getHomeApp(state)
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
