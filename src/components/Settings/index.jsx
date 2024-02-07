import React, { useRef, useEffect, useState, useCallback } from 'react'
import { connect } from 'react-redux'
import get from 'lodash/get'

import { Button } from 'cozy-ui/transpiled/react/deprecated/Button'
import GearIcon from 'cozy-ui/transpiled/react/Icons/Gear'
import useI18n from 'components/useI18n'

import { models, useQuery } from 'cozy-client'
let instanceModel = undefined
let hasAnOffer = undefined
let isFremiumFixed = undefined
if (models) {
  instanceModel = models.instance
  // TODO fallback from cozy-client
  isFremiumFixed = data => {
    const GB = 1000 * 1000 * 1000
    const PREMIUM_QUOTA = 50 * GB
    const quota = get(data, 'diskUsage.data.attributes.quota', false)
    return parseInt(quota) < PREMIUM_QUOTA
  }
  hasAnOffer = data => {
    return (
      !instanceModel.isSelfHosted(data) &&
      instanceModel.arePremiumLinksEnabled(data) &&
      instanceModel.getUuid(data) &&
      !isFremiumFixed(data)
    )
  }
}

import SettingsContent from 'components/Settings/SettingsContent'
import {
  fetchSettingsData,
  getStorageData,
  getSettingsAppURL,
  isSettingsBusy,
  isFetchingSettings,
  logOut
} from 'lib/reducers'

import {
  buildDiskUsageQuery,
  buildInstanceQuery,
  buildContextQuery
} from '../../queries'

import { isFetchingQueries } from 'components/Settings/helper'

export const Settings = ({
  isBusy,
  logOut,
  onLogOut,
  storageData,
  settingsAppURL,
  isFetching
}) => {
  const [isOpen, setOpen] = useState(false)
  const rootRef = useRef()
  const { t } = useI18n()

  const diskUsageQuery = buildDiskUsageQuery()
  const diskUsageResult = useQuery(
    diskUsageQuery.definition,
    diskUsageQuery.options
  )

  const instanceQuery = buildInstanceQuery()
  const instanceResult = useQuery(
    instanceQuery.definition,
    instanceQuery.options
  )

  const contextQuery = buildContextQuery()
  const contextResult = useQuery(contextQuery.definition, contextQuery.options)

  const onClickOutside = useCallback(
    event => {
      if (isFetching || isOpen) {
        // if it's not a cozy-bar nav popup, close the opened popup
        if (!rootRef.current.contains(event.target)) {
          setOpen(false)
          event.stopPropagation()
        }
      }
    },
    [isFetching, isOpen]
  )

  useEffect(() => {
    document.body.addEventListener('click', onClickOutside)
    return () => {
      document.body.removeEventListener('click', onClickOutside)
    }
  }, [onClickOutside])

  const toggleMenu = () => {
    // if popup already opened, stop here to close it
    if (isOpen) return setOpen(false)
    // fetch data
    fetchSettingsData()
    setOpen(true)
  }

  let shouldDisplayViewOfferButton = false
  let managerUrlPremiumLink
  let isFetchingFromQueries

  isFetchingFromQueries = isFetchingQueries([
    diskUsageResult,
    instanceResult,
    contextResult
  ])

  if (!isFetchingFromQueries) {
    const data = {
      context: contextResult.data,
      diskUsage: diskUsageResult.data,
      instance: instanceResult.data
    }
    shouldDisplayViewOfferButton =
      instanceModel.shouldDisplayOffers(data) || hasAnOffer(data)

    managerUrlPremiumLink = instanceModel.buildPremiumLink(data)
  }

  const areAllFetchingDone = !isFetchingFromQueries && !isFetching
  const openMenu = isOpen && areAllFetchingDone

  return (
    <div className="coz-nav coz-nav-settings" ref={rootRef}>
      <Button
        type="button"
        theme="text"
        onClick={toggleMenu}
        className="coz-nav-settings-btn"
        aria-controls="coz-nav-pop--settings"
        busy={isBusy}
        icon={GearIcon}
        label={t('menu.settings')}
      />
      <div
        className="coz-nav-pop coz-nav-pop--settings"
        id="coz-nav-pop--settings"
        aria-hidden={!openMenu}
      >
        {areAllFetchingDone && (
          <SettingsContent
            onLogOut={() => {
              if (onLogOut && typeof onLogOut === 'function') {
                onLogOut()
              } else {
                logOut()
              }
            }}
            storageData={storageData}
            settingsAppURL={settingsAppURL}
            shoulDisplayViewOfferButton={shouldDisplayViewOfferButton}
            managerUrlPremiumLink={managerUrlPremiumLink}
          />
        )}
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  storageData: getStorageData(state),
  settingsAppURL: getSettingsAppURL(state),
  isBusy: isSettingsBusy(state),
  isFetching: isFetchingSettings(state)
})

const mapDispatchToProps = dispatch => ({
  fetchSettingsData: () => dispatch(fetchSettingsData()),
  logOut: () => dispatch(logOut())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings)
