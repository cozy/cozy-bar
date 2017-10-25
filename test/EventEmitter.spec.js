import EventEmitter from '../src/lib/EventEmitter'

let ee

beforeEach(function () {
  ee = new EventEmitter()
})

describe('event emitter', function () {
  it('should be able to subscribe to an event emitter', function () {
    const mock = jest.fn()
    ee.on(mock)
    ee.emit()
    expect(mock).toHaveBeenCalled()
  })
})
