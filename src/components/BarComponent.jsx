import React, { useLayoutEffect, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

import {
  onRealtimeCreate,
  onRealtimeDelete,
  setInfos,
  setTheme
} from 'lib/reducers'

import {
  getAppName,
  getAppNamePrefix,
  getAppSlug,
  getDefaultIcon,
  getUserActionRequired,
  APP_SELECTOR
} from '../dom'

import Bar from './Bar'
import { Provider } from 'react-redux'
import { useClient } from 'cozy-client'
import { isMobileApp } from 'cozy-device-helper'
import CozyTheme from 'cozy-ui/transpiled/react/providers/CozyTheme'

import stack from 'lib/stack'

import { useBarContext } from './BarProvider'

const createBarElement = () => {
  const targetName = isMobileApp() ? 'mobile' : 'browser'
  const barNode = document.createElement('div')
  barNode.setAttribute('id', 'coz-bar')
  barNode.setAttribute('role', 'banner')
  barNode.classList.add(`coz-target--${targetName}`)
  return barNode
}

const createWrapperAndAppendToBody = () => {
  const barNode = createBarElement()
  const appNode = document.querySelector(APP_SELECTOR)
  if (!appNode) {
    // eslint-disable-next-line no-console
    console.warn(
      `Cozy-bar is looking for a "${APP_SELECTOR}" tag that contains your application and can't find it :'(… The BAR is now disabled`
    )
    return null
  }

  document.body.insertBefore(barNode, appNode)
  document.body.classList.add('has-banner')

  return barNode
}

function ReactPortal({
  children,
  wrapperElement,
  setWrapperElement,
  wrapperId = 'cozy-bar'
}) {
  useLayoutEffect(() => {
    let element = document.getElementById(wrapperId)

    let systemCreated = false

    // if element is not found with wrapperId or wrapperId is not provided,
    // create and append to body
    if (!element) {
      systemCreated = true
      element = createWrapperAndAppendToBody(wrapperId)
    }

    setWrapperElement(element)

    return () => {
      // delete the programatically created element
      if (systemCreated && element.parentNode) {
        element.parentNode.removeChild(element)
      }
    }
  }, [setWrapperElement, wrapperId])

  // wrapperElement state will be null on the very first render.
  if (wrapperElement === null) return null

  return createPortal(children, wrapperElement)
}

const BarComponent = ({
  appName = getAppName(),
  appNamePrefix = getAppNamePrefix(),
  appSlug = getAppSlug(),
  iconPath = getDefaultIcon(),
  isInvertedTheme,
  isPublic = false,
  onLogOut
}) => {
  const barContext = useBarContext()
  const { barSearch, barLeft, barCenter, barRight, theme, themeOverrides } =
    barContext || {}

  const [wrapperElement, setWrapperElement] = useState(null)

  const cozyClient = useClient()

  // Force public mode in `/public` URLs
  let isPublicForce = !isPublic && /^\/public/.test(window.location.pathname)

  const getOrCreateStore = require('lib/store').default
  const reduxStore = getOrCreateStore()

  useEffect(() => {
    reduxStore.dispatch(setInfos(appName, appNamePrefix, appSlug))
    stack.init({
      cozyClient,
      onCreate: data => reduxStore.dispatch(onRealtimeCreate(data)),
      onDelete: data => reduxStore.dispatch(onRealtimeDelete(data))
    })
  }, [
    appName,
    appNamePrefix,
    appSlug,
    cozyClient,
    getOrCreateStore,
    reduxStore
  ])

  const options = {
    appName,
    isInvertedTheme,
    appNamePrefix,
    appSlug,
    cozyClient,
    iconPath,
    isPublic: isPublicForce || isPublic,
    onLogOut,
    userActionRequired: getUserActionRequired(),
    reduxStore,
    onDrawer: visible => {
      wrapperElement.dataset.visible = visible
    }
  }

  useEffect(() => {
    if (theme) {
      reduxStore.dispatch(setTheme(theme, themeOverrides || {}))
    }
  })

  return (
    <ReactPortal
      wrapperElement={wrapperElement}
      setWrapperElement={setWrapperElement}
    >
      <Provider store={options.reduxStore}>
        <CozyTheme>
          <Bar
            {...options}
            barSearch={barSearch}
            barLeft={barLeft}
            barCenter={barCenter}
            barRight={barRight}
          />
        </CozyTheme>
      </Provider>
    </ReactPortal>
  )
}

export { BarComponent }
