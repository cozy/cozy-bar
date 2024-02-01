import React from 'react'
import { Provider } from 'react-redux'

import I18n from 'cozy-ui/transpiled/react/providers/I18n'
import { CozyProvider, createMockClient } from 'cozy-client'
import { BreakpointsProvider } from 'cozy-ui/transpiled/react/providers/Breakpoints'
import CozyTheme from 'cozy-ui/transpiled/react/providers/CozyTheme'

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
        <CozyTheme>
          <BreakpointsProvider>
            <TestI18n>{children}</TestI18n>
          </BreakpointsProvider>
        </CozyTheme>
      </Provider>
    </CozyProvider>
  )
}

export { TestI18n, BarLike }
