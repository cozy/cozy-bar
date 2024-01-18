import React from 'react'
import { Provider } from 'react-redux'

import I18n from 'cozy-ui/transpiled/react/providers/I18n'
import { CozyProvider, createMockClient } from 'cozy-client'
import { BreakpointsProvider } from 'cozy-ui/transpiled/react/providers/Breakpoints'

import { createStore } from 'lib/store'
import enLocale from 'locales/en.json'

const TestI18n = ({ children }) => {
  return (
    <I18n dictRequire={() => enLocale} lang="en">
      {children}
    </I18n>
  )
}

const BarLike = ({ children, client }) => {
  const mockClient = createMockClient({})
  const fakeStore = createStore()

  return (
    <CozyProvider client={client || mockClient}>
      <Provider store={fakeStore}>
        <BreakpointsProvider>
          <TestI18n>{children}</TestI18n>
        </BreakpointsProvider>
      </Provider>
    </CozyProvider>
  )
}

export { TestI18n, BarLike }
