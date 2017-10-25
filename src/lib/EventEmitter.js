export default class EventEmitter {
  constructor () {
    this.subscribers = []
    return this
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

  get (attr) {
    return this[attr]
  }

  set (attr, value) {
    this[attr] = value
    this.emit()
    return value
  }
}
