import React, { Component } from 'react'
import { getContent, setContent, setLocale } from '../reducers'

import { locations, getJsApiName, getReactApiName } from 'lib/api/helpers'

/**
 * Wraps argument into a React element if it is a string. Is used
 * for setBar{Left,Right,Center} to be able to pass HTML
 *
 * @param  {[type]} v [description]
 * @return {[type]}   [description]
 */
const wrapInElement = v => {
  if (typeof v === 'string') {
    return <span dangerouslySetInnerHTML={{ __html: v }} />
  } else {
    return v
  }
}

/**
 * Creates a React component that enables to access store
 * properties in a declarative way.
 *
 * @param  {BarStore} store
 */
const barContentComponent = (store, location) =>
  class BarContent extends Component {
    componentDidMount() {
      this.prev = getContent(store.getState(), location)
      this.setContent(this.props.children)
    }

    setContent(content) {
      try {
        content = React.Children.only(content)
        // eslint-disable-next-line no-empty
      } catch (e) {}
      store.dispatch(setContent(location, content))
    }

    componentWillUnmount() {
      this.setContent(this.prev)
    }

    componentDidUpdate(prevProps) {
      if (this.props.children !== prevProps.children) {
        this.setContent(this.props.children)
      }
    }

    render() {
      return null
    }
  }

/**
 * Creates a public API
 *
 * - getters/setters for public attributes
 * - React components that act as getters/setters
 *
 * @param  {ReduxStore} store - Store on which the API will act
 * @return {object} - Methods of the public API
 */
export default store => {
  // setBar{Left,Right,Center} and <Bar{Left,Right,Center} />
  const methods = {}
  locations.forEach(location => {
    /// expose JS API
    methods[getJsApiName(location)] = value =>
      store.dispatch(setContent(location, wrapInElement(value)))

    // expose React API
    methods[getReactApiName(location)] = barContentComponent(store, location)
  })

  methods.setLocale = lang => {
    store.dispatch(setLocale(lang))
  }

  return methods
}
