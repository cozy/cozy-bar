import { Component } from 'react'

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

export class EventEmitter {
  constructor () {
    this.subscribers = []
  }

  on (cb) {
    this.subscribers.push(cb)
  }

  off (cb) {
    this.subscribers = this.subscribers.filter(c => c !== cb)
  }

  emit () {
    this.subscribers.forEach(cb => {
      cb()
    })
  }

  set (attr, value) {
    this[attr] = value
    this.emit()
    return value
  }
}
