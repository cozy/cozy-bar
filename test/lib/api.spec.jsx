import React from 'react'
import { shallow } from 'enzyme'

import createStore from 'lib/store'
import { createBarAPI } from 'lib/api'
import appReducers, { getContent as _getContent } from 'lib/reducers'
import { getDefaultState } from 'lib/reducers/content'
import { locations, getJsApiName, getReactApiName } from 'lib/api/helpers'

const store = createStore()
const api = createBarAPI(store)

// add test reducer to reset state
const RESET_API = 'RESET_API'
const testReducer = (state, action) => {
  if (action.type === RESET_API) {
    const newState = Object.assign({}, state, {
      content: getDefaultState()
    })
    return newState
  }
  return appReducers(state, action)
}

store.replaceReducer(testReducer)

const getContent = location => {
  return _getContent(store.getState(), location)
}

const contentToTest = {
  left: 'Left',
  center: <p>Center</p>,
  right: (
    <div>
      test3
      <span>Right</span>
    </div>
  ),
  search: 'Search'
}

describe('api spec', function() {
  beforeEach(() => {
    store.dispatch({
      type: RESET_API
    })
  })

  it('should set content of the store via imperative api', function() {
    locations.map(location => {
      api[getJsApiName(location)](contentToTest[location])
      expect(getContent(location)).toMatchSnapshot()
    })
  })

  it('should set content of the store via declarative api', function() {
    locations.map(location => {
      const BarAPI = api[getReactApiName(location)]
      shallow(
        <BarAPI>
          <div>{contentToTest[location]}</div>
        </BarAPI>
      )
      expect(getContent(location)).toMatchSnapshot()
    })
  })

  it('should replace content of the store instead of adding new entry', function() {
    locations.map(location => {
      const BarAPI = api[getReactApiName(location)]
      const barComponent = shallow(
        <BarAPI>
          <div>{contentToTest[location]}</div>
        </BarAPI>
      )
      const initialContent = getContent(location)
      // update content
      expect(initialContent).toEqual(getContent(location))
      expect(store.getState().content[location].size).toBe(1)
      barComponent.setProps({
        children: <div>Left Updated</div>
      })
      // content has correctly be updated
      expect(initialContent).not.toEqual(getContent(location))
      // but no new content added, it was replaced in the state
      expect(store.getState().content[location].size).toBe(1)
    })
  })

  it('should unset content of the store on unmount', function() {
    locations.map(location => {
      const BarAPI = api[getReactApiName(location)]
      const barComponent = shallow(
        <BarAPI>
          <div>{contentToTest[location]}</div>
        </BarAPI>
      )
      expect(store.getState().content[location].size).toBe(1)
      // unmount
      barComponent.unmount()
      expect(store.getState().content[location].size).toBe(0)
    })
  })

  it('should set locale', function() {
    const { setLocale } = api
    // default lang is `en`
    expect(store.getState().locale).toBe('en')
    setLocale('fr')
    expect(store.getState().locale).toBe('fr')
    setLocale('de')
    expect(store.getState().locale).toBe('de')
  })

  it('should set theme', function() {
    const { setTheme } = api
    // default theme is `default`
    expect(store.getState().theme.name).toBe('default')
    expect(store.getState().theme.overrides).toEqual({})
    setTheme('primary')
    expect(store.getState().theme.name).toBe('primary')
    expect(store.getState().theme.overrides).toEqual({})
    setTheme('primary', { primaryColor: 'red' })
    expect(store.getState().theme.name).toBe('primary')
    expect(store.getState().theme.overrides).toEqual({ primaryColor: 'red' })
    setTheme('wrongTheme')
    expect(store.getState().theme.name).toBe('default')
    expect(store.getState().theme.overrides).toEqual({})
  })

  it('should set webviewContext', function() {
    const { setWebviewContext } = api
    // default webviewContext is `undefined`
    expect(store.getState().unserializable.webviewContext).toBe(undefined)
    setWebviewContext('foo')
    expect(store.getState().unserializable.webviewContext).toBe('foo')
    setWebviewContext('bar')
    expect(store.getState().unserializable.webviewContext).toBe('bar')
    setWebviewContext(undefined)
  })
})
