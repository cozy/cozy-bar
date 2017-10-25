import React, { Component } from 'react'

const upperFirstLetter = val => {
  return val[0].toUpperCase() + val.slice(1)
}

/**
 * Wraps argument into a React element if it is a string. Is used
 * for setBar{Left,Right,Center} to be able to pass HTML
 *
 * @param  {[type]} v [description]
 * @return {[type]}   [description]
 */
const wrapInElement = v => {
  if (typeof v === 'string') {
    return <span dangerouslySetInnerHTML={{__html: v}} />
  } else {
    return v
  }
}

/**
 * Creates a React component that enables to access store
 * properties in a declarative way.
 *
 * @param  {BarStore} store
 * @param  {string} attr
 * @return {Component}
 */
const storeComponent = (store, attr) => class extends Component {
  componentDidMount () {
    this.prev = store.get(attr)
    store.set(attr, this.props.children)
  }

  componentWillUnmount () {
    store.set(attr, this.prev)
  }

  componentDidUpdate () {
    store.set(attr, this.props.children)
  }

  render () {
    return null
  }
}

/**
 * Creates a public API from a store
 *
 * - getters/setters for public attributes
 * - React components that act as getters/setters
 *
 * @param  {BarStore} store - Store on which the API will play
 * @return {object} - Methods of the public API
 */
export default store => {
  const contentAttributes = ['barLeft', 'barCenter', 'barRight']
  const methods = {}
  contentAttributes.forEach(attrName => {
    methods['set' + upperFirstLetter(attrName)] = value => store.set(attrName, wrapInElement(value))
    methods[upperFirstLetter(attrName)] = storeComponent(store, attrName)
  })
  return methods
}
