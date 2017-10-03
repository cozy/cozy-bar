import React, { Component } from 'react'

class Claudy extends Component {
  constructor (props, context) {
    super(props)
    this.store = context.store
    this.state = {
      isLoading: false,
      isActive: false
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
        this.setState({isLoading: false, isActive: true})
        this.props.onToggle() // toggle claudy when the intent is loaded
      })
      .then(({ removeIntentFrame }) => { // exposeFrameRemoval intent event
        // remove the intent frame at the end of the menu closing transition
        const closedListener = (e) => {
          if (e.propertyName === 'transform') {
            removeIntentFrame()
            this.setState({ isActive: false })
            e.target.removeEventListener('transitionend', closedListener)
          }
        }
        this.intentWrapperRef.addEventListener('transitionend', closedListener, false)
        this.props.onToggle()
      })
    } else {
      this.setState({ isActive: !this.state.isActive })
      this.props.onToggle()
    }
  }

  render () {
    const { opened } = this.props
    const { isLoading, isActive } = this.state
    return (
      <div className={`coz-claudy ${opened ? 'coz-claudy--opened' : ''}`}>
        <button className='coz-claudy-icon coz-bar-hide-sm' data-claudy-opened={isActive} data-claudy-loading={isLoading} onClick={this.toggle} />
        <div
          className='coz-claudy-intent-wrapper'
          ref={(wrapper) => { this.intentWrapperRef = wrapper }}
        />
      </div>
    )
  }
}

export default Claudy
