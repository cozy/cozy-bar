import React from 'react'
import { shallow } from 'enzyme'

import createStore from 'lib/store'
import api from 'lib/api'
import { getContent as _getContent } from 'lib/reducers'

const store = createStore()
const {
  setBarLeft,
  setBarRight,
  setBarCenter,
  BarLeft,
  BarRight,
  BarCenter,
  setLocale
} = api(store)

const getContent = location => {
  return _getContent(store.getState(), location)
}

describe('api spec', function () {
  it('should set content of the store via imperative api', function () {
    setBarLeft('content left')
    expect(getContent('left')).toMatchSnapshot()

    setBarRight('<p>content right</p>')
    expect(getContent('right')).toMatchSnapshot()

    setBarCenter('content center')
    expect(getContent('center')).toMatchSnapshot()
  })

  it('should set content of the store via declarative api', function () {
    shallow(<BarLeft><div>Left</div></BarLeft>)
    expect(getContent('left')).toMatchSnapshot()
    shallow(<BarRight>Right</BarRight>)
    expect(getContent('right')).toMatchSnapshot()
    shallow(<BarCenter><span>Center</span></BarCenter>)
    expect(getContent('center')).toMatchSnapshot()
  })

  it('should set locale', function () {
    // default lang is `en`
    expect(store.getState().locale).toBe('en')
    setLocale('fr')
    expect(store.getState().locale).toBe('fr')
    setLocale('de')
    expect(store.getState().locale).toBe('de')
  })
})
