
/* global fetch */

import { Component } from 'react'
import stack from '../lib/stack'

import CLAUDY_ACTIONS from '../config/claudyActions'

const EXCLUDES = ['settings', 'onboarding']
const CATEGORIES = ['cozy', 'partners', 'ptnb']

export default class BarStore {
  constructor () {
    this.claudyActions = null
  }

  getClaudyActions () {
    if (this.claudyActions) return Promise.resolve(this.claudyActions)
    return stack.get.context()
      .then(context => {
        const contextActions = (context.data && context.data.attributes && context.data.attributes['claudy_actions']) || null
        if (!contextActions) return null
        // get an arrays of action
        const claudyActions = contextActions.map(slug => {
          if (CLAUDY_ACTIONS.hasOwnProperty(slug)) {
            // adding also the action slug
            return Object.assign({}, CLAUDY_ACTIONS[slug], { slug })
          }
        }).filter(action => action)
        this.claudyActions = claudyActions
        return {
          actions: claudyActions
        }
      })
      .catch(error => {
        console.warn && console.warn(`Cozy-bar cannot fetch Claudy: ${error.message}`)
        return null
      })
  }
}

export class Provider extends Component {
  getChildContext () {
    return { store: this.store }
  }

  constructor (props, context) {
    super(props, context)
    this.store = props.store
  }

  render ({children}) {
    return (children && children[0]) || null
  }
}
