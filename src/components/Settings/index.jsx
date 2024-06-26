import React, { useRef, useEffect, useState, useCallback } from 'react'
import { connect } from 'react-redux'
import get from 'lodash/get'

import { Button } from 'cozy-ui/transpiled/react/deprecated/Button'
import GearIcon from 'cozy-ui/transpiled/react/Icons/Gear'
import useI18n from 'components/useI18n'

import { models, useClient, useInstanceInfo } from 'cozy-client'
import { generateWebLink } from 'cozy-client/dist'
import flag from 'cozy-flags'

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
  isSettingsBusy,
  isFetchingSettings,
  logOut
} from 'lib/reducers'

export const Settings = ({
  isBusy,
  logOut,
  onLogOut,
  storageData,
  isFetching
}) => {
  const [isOpen, setOpen] = useState(false)
  const rootRef = useRef()
  const { t } = useI18n()
  const client = useClient()

  const { isLoaded: isInstanceInfoLoaded, ...instanceInfo } = useInstanceInfo()

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

  if (isInstanceInfoLoaded) {
    shouldDisplayViewOfferButton =
      instanceModel.shouldDisplayOffers(instanceInfo) ||
      hasAnOffer(instanceInfo)

    const hasSubscription = flag('settings.subscription')

    if (hasSubscription && client) {
      const webLink = generateWebLink({
        cozyUrl: client.getStackClient().uri,
        hash: '/subscription',
        pathname: '/',
        slug: 'settings',
        subDomainType: client.getInstanceOptions().subdomain
      })

      managerUrlPremiumLink = webLink
    } else {
      managerUrlPremiumLink = instanceModel.buildPremiumLink(instanceInfo)
    }
  }

  const areAllFetchingDone = isInstanceInfoLoaded && !isFetching
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
