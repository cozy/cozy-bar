import React from 'react'
import { Provider, connect } from 'react-redux'

import { isMobileApp } from 'cozy-device-helper'
import { useClient } from 'cozy-client'

import getOrCreateStore from 'lib/store'

import stack from 'lib/stack'
import {
  getLocale,
  onRealtimeCreate,
  onRealtimeDelete,
  setLocale,
  setInfos
} from 'lib/reducers'

import { createBarAPI } from 'lib/api'

import { getUserActionRequired } from '../dom'

import enLocale from 'locales/en.json'
import frLocale from 'locales/fr.json'
import esLocale from 'locales/es.json'
const locales = {
  en: enLocale,
  fr: frLocale,
  es: esLocale
}

import Bar from './Bar'
import I18n from 'cozy-ui/transpiled/react/I18n'

/* const BarComponent = () => {
  const targetName = isMobileApp() ? 'mobile' : 'browser'

  return (
    <div id="coz-bar" role="banner" className={`coz-target--${targetName}`}>
      <Bar />
    </div>
  )
} */

let exposedAPI = {}

const BarComponent = ({
  appName,
  appNamePrefix,
  appSlug,
  lang,
  iconPath,
  replaceTitleOnMobile,
  isPublic,
  onLogOut
}) => {
  // default value
  // appNamePrefix = getAppNamePrefix(),
  // appSlug = getAppSlug(),
  // iconPath = getDefaultIcon(),
  // replaceTitleOnMobile = false,
  // isPublic = false,

  const cozyClient = useClient()
  const targetName = isMobileApp() ? 'mobile' : 'browser'

  // Force public mode in `/public` URLs
  if (!isPublic && /^\/public/.test(window.location.pathname)) {
    isPublic = true
  }

  // store
  const reduxStore = getOrCreateStore()

  reduxStore.dispatch(setInfos(appName, appNamePrefix, appSlug))
  stack.init({
    cozyClient,
    onCreate: data => reduxStore.dispatch(onRealtimeCreate(data)),
    onDelete: data => reduxStore.dispatch(onRealtimeDelete(data))
  })
  if (lang) {
    reduxStore.dispatch(setLocale(lang))
  }

  // Assign all api methods to the bar object
  const apiMethods = createBarAPI(reduxStore)
  Object.assign(exposedAPI, apiMethods)

  const options = {
    appName,
    appNamePrefix,
    appSlug,
    cozyClient,
    iconPath,
    replaceTitleOnMobile,
    isPublic,
    onLogOut,
    userActionRequired: getUserActionRequired(),
    reduxStore
  }

  // we connect the I18n component to the store to listen
  // locale change from the api setLocale()
  const EnhancedI18n = connect(state => ({
    lang: getLocale(state)
  }))(I18n)

  return (
    <div id="coz-bar" role="banner" className={`coz-target--${targetName}`}>
      <Provider store={options.reduxStore}>
        <EnhancedI18n dictRequire={lang => locales[lang]}>
          <Bar {...options} />
        </EnhancedI18n>
      </Provider>
    </div>
  )
}

export default BarComponent

/*   // method to put cozy-bar z-index on the top when Drawer visible and vice versa
  data.onDrawer = visible => {
    barNode.dataset.drawerVisible = visible
  }

  // specific layout behaviour if banner displayed
  if (data.userActionRequired) {
    document.body.classList.add('has-banner')
  } */
