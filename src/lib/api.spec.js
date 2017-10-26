import React from 'react'
import createStore from './store'
import api from './api'
import { getContent as _getContent } from './reducers'

const store = createStore()
const {
  setBarLeft,
  setBarRight,
  setBarCenter,
  BarLeft,
  BarRight,
  BarCenter
} = api(store)

/** Fake mount till I figure how to make enzyme work with preact */
const mount = element => {
  const Component = element.nodeName
  const component = new Component(element)
  Component.prototype.componentDidMount.apply(component)
}

const getContent = location => {
  return _getContent(store.getState(), location)
}

const HTMLSpan = content =>
  <span dangerouslySetInnerHTML={{ __html: content }} />

describe('api spec', function () {
  it('should set content of the store via imperative api', function () {
    setBarLeft('content left')
    expect(getContent('left')).toEqual(HTMLSpan('content left'))

    setBarRight('content right')
    expect(getContent('right')).toEqual(HTMLSpan('content right'))

    setBarCenter('content center')
    expect(getContent('center')).toEqual(HTMLSpan('content center'))
  })

  it('should set content of the store via declarative api', function () {
    mount(<BarLeft>Left</BarLeft>)
    expect(getContent('left')).toEqual('Left')
    mount(<BarRight>Right</BarRight>)
    expect(getContent('right')).toEqual('Right')
    mount(<BarCenter>Center</BarCenter>)
    expect(getContent('center')).toEqual('Center')
  })
})
