import React, { Component } from 'react'
import { getIntents } from 'lib/stack'
import ClaudyIcon from './ClaudyIcon'
import Icon from 'cozy-ui/transpiled/react/Icon'

class Claudy extends Component {
  constructor(props, context) {
    super(props)
    this.store = context.barStore
    this.state = {
      isLoading: false,
      isActive: false
    }
    this.intents = getIntents()
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.claudyFired) this.toggle()
  }

  toggle = () => {
    if (!this.props.opened && !this.intentWrapperRef.childNodes.length) {
      this.setState({ isLoading: true })
      // init Claudy intent
      this.intents
        .create('CLAUDY', 'io.cozy.settings', {
          exposeIntentFrameRemoval: true
        })
        .start(this.intentWrapperRef, () => {
          this.setState({ isLoading: false, isActive: true })
          this.props.onToggle() // toggle claudy when the intent is loaded
        })
        .then(({ removeIntentIframe }) => {
          // exposeFrameRemoval intent event
          // remove the intent frame at the end of the menu closing transition
          const closedListener = e => {
            if (e.propertyName === 'transform') {
              removeIntentIframe()
              this.setState({ isActive: false })
              e.target.removeEventListener('transitionend', closedListener)
            }
          }
          this.intentWrapperRef.addEventListener(
            'transitionend',
            closedListener,
            false
          )
          this.props.onToggle()
        })
    } else {
      this.setState({ isActive: !this.state.isActive })
      this.props.onToggle()
    }
  }

  render() {
    const { opened } = this.props
    const { isLoading, isActive } = this.state
    return (
      <div className={`coz-claudy ${opened ? 'coz-claudy--opened' : ''}`}>
        <button
          type="button"
          className="coz-claudy-icon coz-bar-hide-sm"
          data-claudy-opened={isActive}
          data-claudy-loading={isLoading}
          onClick={this.toggle}
          aria-haspopup="true"
          aria-expanded={isActive}
        >
          <Icon icon={ClaudyIcon} height="32" width="32" />
        </button>
        <div
          className="coz-claudy-intent-wrapper"
          ref={wrapper => {
            this.intentWrapperRef = wrapper
          }}
        />
      </div>
    )
  }
}

export default Claudy
