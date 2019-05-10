/* global cozy */

import React from 'react'
import ReactDOM from 'react-dom'
import { Layout, Main } from 'cozy-ui/transpiled/react/Layout'
import CozyClient, { CozyProvider, withClient } from 'cozy-client'
import { Route, hashHistory } from 'react-router'
import { MobileRouter } from 'cozy-authentication'
import 'cozy-ui/transpiled/react/stylesheet.css'
import appIcon from './icon.png'

const minilog = window.minilog
minilog.enable()
minilog.suggest.allow('cozy-realtime', 'debug')

// TODO ui: AppLinker should not fail so loudly without lampa.startapp plugin
window.startApp = {
  set: function() {
    return this
  },
  check: () => Promise.resolve(false),
  start: resolve => resolve()
}

const isInitializedWithCozyClient = () => {
  const v = localStorage.getItem('init-without-cozy-client')
  return v === 'true' || v === null
}

const toggleCozyClientInitialization = () => {
  const v = isInitializedWithCozyClient()
  localStorage.setItem('init-without-cozy-client', v ? 'false' : 'true')
  window.location.reload()
}

const Index = withClient(({ client }) => {
  return (
    <Layout>
      <Main>
        <div className="u-m-1">
          Initialized with CozyClient:{' '}
          {isInitializedWithCozyClient() ? 'yes' : 'no'}
          <button onClick={toggleCozyClientInitialization}>toggle</button>
          <br />
          You are logged in on {client.stackClient.uri} !<br />
          Client options: <pre>{JSON.stringify(client.options, null, 2)}</pre>
        </div>
      </Main>
    </Layout>
  )
})

const appInfo = {
  name: 'Example bar',
  slug: 'example-bar',
  softwareID: 'io.cozy.example',
  redirectURI: 'http://localhost:1234/auth',
  protocol: 'cozyexample://',
  universalLinkDomain: 'https://links.cozyexample.com'
}

const client = new CozyClient({
  scope: ['io.cozy.apps', 'io.cozy.konnectors'],
  // TODO client: All the oauth information could come from the manifest
  oauth: {
    clientName: appInfo.name,
    softwareID: appInfo.softwareID,
    redirectURI: appInfo.redirectURI
  }
})

// TODO bar: should only need a correctly configured client
client.on('login', () => {
  const oldOptions = {
    token: client.stackClient.token.accessToken,
    cozyURL: client.stackClient.uri
  }
  const newOptions = {
    cozyClient: client
  }
  cozy.bar.init({
    appNamePrefix: 'Cozy',
    appName: appInfo.name,
    appEditor: appInfo.editor,
    appSlug: appInfo.slug,
    iconPath: appIcon,
    lang: 'en',
    replaceTitleOnMobile: true,
    ...(isInitializedWithCozyClient() ? newOptions : oldOptions),
    // This should be done automatically
    onLogOut: async () => {
      await client.logout()
    }
  })
})

// TODO bar: This should be done automatically
client.on('logout', () => {
  if (document.getElementById('coz-bar')) {
    document.getElementById('coz-bar').remove()
    document.body.setAttribute('style', '')
  }
})

const App = function() {
  return (
    <CozyProvider client={client}>
      <MobileRouter
        history={hashHistory}
        appTitle={appInfo.name}
        appSlug={appInfo.slug}
        appIcon={appIcon}
        protocol={appInfo.protocol}
        universalLinkDomain={appInfo.universalLinkDomain}
      >
        <Route path="/" component={Index} />
      </MobileRouter>
    </CozyProvider>
  )
}

ReactDOM.render(<App />, document.querySelector('#app'))
