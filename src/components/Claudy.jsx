import React, { Component } from 'react'

class Claudy extends Component {
  constructor (props, context) {
    super(props)
    this.store = context.store
    this.state = {
      isLoading: false
    }

    this.toggle = this.toggle.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.fireClaudy) this.toggle()
  }

  toggle () {
    if (!this.props.opened && !this.intentWrapperRef.childNodes.length) {
      this.setState({isLoading: true})
      this.store.getClaudyIntent({ exposeIntentFrameRemoval: true })
      .start(this.intentWrapperRef, () => {
        this.setState({isLoading: false})
        this.props.onToggle() // toggle claudy when the intent is loaded
      })
      .then(({ removeIntentFrame }) => { // exposeFrameRemoval intent event
        // remove the intent frame at the end of the menu closing transition
        this.intentWrapperRef.addEventListener('transitionend', function closed (event) {
          if (event.propertyName === 'transform') {
            removeIntentFrame()
            this.removeEventListener('transitionend', closed, false)
          }
        })
        this.props.onToggle()
      })
    } else {
      this.props.onToggle()
    }
  }

  render () {
    const { opened } = this.props
    const { isLoading } = this.state
    return (
      <div className={`coz-claudy ${opened ? 'coz-claudy--opened' : ''}`}>
        <button className='coz-claudy-icon coz-bar-hide-sm' data-claudy-opened={opened} data-claudy-loading={isLoading} onClick={this.toggle} />
        <div
          class='coz-claudy-intent-wrapper'
          ref={(wrapper) => { this.intentWrapperRef = wrapper }}
        />
      </div>
    )
  }
}

export default Claudy
