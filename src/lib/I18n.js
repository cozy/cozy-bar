/**
 * preact plugin that provides an I18n helper using a Higher Order Component.
 */

'use strict'

import React, { Component } from 'react'
import Polyglot from 'node-polyglot'
import { getLocale } from './reducers'
import { connect } from 'react-redux'

export const DEFAULT_LANG = 'en'

export let _polyglot

const initTranslation = (lang, dictRequire, context, defaultLang = DEFAULT_LANG) => {
  _polyglot = new Polyglot({
    phrases: dictRequire(defaultLang),
    locale: defaultLang
  })

  // Load global locales
  if (lang && lang !== defaultLang) {
    try {
      const dict = dictRequire(lang)
      _polyglot.extend(dict)
      _polyglot.locale(lang)
    } catch (e) {
      console.warn(`The dict phrases for "${lang}" can't be loaded`)
    }
  }

  // Load context locales
  if (context) {
    const dict = dictRequire(lang, context)
    _polyglot.extend(dict)
  }

  return _polyglot
}

const enhance = Wrapped => (
  connect(state => ({
    lang: getLocale(state)
  }))(Wrapped)
)

// Provider root component
export const I18n = enhance(class extends Component {
  constructor (props) {
    super(props)
    this.init(this.props)
  }

  init (props) {
    const { lang, dictRequire, context, defaultLang } = props

    this.translation = initTranslation(lang, dictRequire, context, defaultLang)
  }

  getChildContext () {
    return {
      t: this.translation.t.bind(this.translation),
      lang: this.props.lang
    }
  }

  componentWillReceiveProps (newProps) {
    if (this.props.lang !== newProps.lang) {
      const { lang, dictRequire } = newProps
      try {
        const dict = dictRequire(lang)
        this.translation.extend(dict)
        this.translation.locale(lang)
      } catch (e) {
        console.warn(`The dict phrases for "${lang}" can't be loaded`)
      }
    }
  }

  render () {
    return (this.props.children && this.props.children[0]) || null
  }
})

I18n.propTypes = {
  lang: React.PropTypes.string.isRequired,      // current language.
  dictRequire: React.PropTypes.func.isRequired, // A callback to load locales.
  context: React.PropTypes.string,              // current context.
  defaultLang: React.PropTypes.string           // default language. By default is 'en'
}

I18n.childContextTypes = {
  t: React.PropTypes.func,
  lang: React.PropTypes.string
}

// higher order decorator for components that need `t`
export const translate = () => {
  return (WrappedComponent) => {
    const _translate = (props, context) => (
      <WrappedComponent {...props} t={context.t} lang={context.lang} />
    )
    return _translate
  }
}
