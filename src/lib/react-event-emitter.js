import { Component } from 'react'

/**
 * HOC used to subscribe to an EventEmitter in componentDidMount and
 * unsubscribe in componentWillUnmount. Each event from the event emitter
 * will cause the component to `forceUpdate`.
 *
 * @param  {Function} getEventEmitter - Is used to get the event emitter, will be given the component as parameter
 * @return {Component} - Connected component
 */
export const connectToEventEmitter = getEventEmitter => Wrapped => class extends Component {
  componentDidMount () {
    this.ee = getEventEmitter(this)
    this.ee.on(this.update)
  }

  componentWillUnmount () {
    this.ee.off(this.update)
  }

  update = () => {
    this.forceUpdate()
  }

  render () {
    return <Wrapped {...this.props} />
  }
}
