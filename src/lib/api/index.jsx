import React, { Component } from 'react'
import { setContent, unsetContent, setLocale, setTheme } from 'lib/reducers'

import { locations, getJsApiName, getReactApiName } from 'lib/api/helpers'

// The React API need unique IDs, so we will increment this variable
let idToIncrement = 0

/**
 * Wraps argument into a React element if it is a string. Is used
 * for setBar{Left,Right,Center} to be able to pass HTML
 *
 * @param  {ReactElement|string} v
 * @return {ReactElement}
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
      this.componentId = idToIncrement++
      this.setContent(this.props.children)
    }

    setContent(content) {
      try {
        content = React.Children.only(content)
        // eslint-disable-next-line no-empty
      } catch (e) {}
      store.dispatch(setContent(location, content, this.componentId))
    }

    unsetContent() {
      store.dispatch(unsetContent(location, this.componentId))
    }

    componentWillUnmount() {
      this.unsetContent()
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
export const createBarAPI = store => {
  // setBar{Left,Right,Center} and <Bar{Left,Right,Center} />
  const methods = {}
  locations.forEach(location => {
    // expose JS API
    methods[getJsApiName(location)] = value =>
      store.dispatch(setContent(location, wrapInElement(value), 'js'))

    // expose React API
    methods[getReactApiName(location)] = barContentComponent(store, location)
  })

  methods.setLocale = (...args) => {
    store.dispatch(setLocale(...args))
  }

  methods.setTheme = (...args) => {
    store.dispatch(setTheme(...args))
  }

  return methods
}

// Handle exceptions for API before init
const showAPIError = name => {
  // eslint-disable-next-line no-console
  console.error(
    `You tried to use the CozyBar API (${name}) but the CozyBar is not initialised yet via cozy.bar.init(...).`
  )
}

const makeProxyMethodToAPI = (exposedAPI, fnName) => {
  return (...args) => {
    if (exposedAPI[fnName]) {
      return exposedAPI[fnName](...args)
    } else {
      showAPIError(fnName)
    }
  }
}

/** Creates an API that swallows error until bar is correctly initialized */
export const createBarProxiedAPI = exposedAPI => {
  const apiReferences = {}

  locations.forEach(location => {
    const jsAPIName = getJsApiName(location)
    const reactAPIName = getReactApiName(location)
    apiReferences[jsAPIName] = makeProxyMethodToAPI(exposedAPI, jsAPIName)
    apiReferences[reactAPIName] = props => {
      if (exposedAPI[reactAPIName]) {
        return React.createElement(exposedAPI[reactAPIName], props)
      } else {
        showAPIError(reactAPIName)
      }
    }
  })

  for (let fnName of ['setLocale', 'setTheme']) {
    apiReferences[fnName] = makeProxyMethodToAPI(exposedAPI, fnName)
  }
  return apiReferences
}
