import React, { useContext } from 'react'
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

import { getAppNamePrefix, getAppSlug, getDefaultIcon } from '../dom'
import { BarContext } from './BarProvider'

const BarComponent = ({
  appName,
  appNamePrefix = getAppNamePrefix(),
  appSlug = getAppSlug(),
  lang,
  iconPath = getDefaultIcon(),
  replaceTitleOnMobile = false,
  isPublic = false,
  onLogOut
}) => {
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
  /*  const EnhancedI18n = connect(state => ({
    lang: getLocale(state)
  }))(I18n) */

  // <EnhancedI18n dictRequire={lang => locales[lang]}></EnhancedI18n>

  const { barSearch, barLeft, barCenter, barRight } = useContext(BarContext)

  return (
    <div id="coz-bar" role="banner" className={`coz-target--${targetName}`}>
      <Provider store={options.reduxStore}>
        <Bar
          {...options}
          barSearch={barSearch}
          barLeft={barLeft}
          barCenter={barCenter}
          barRight={barRight}
        />
      </Provider>
    </div>
  )
}

export default BarComponent
