import CozyClient from 'cozy-client'
import client from 'lib/stack-client.js'
import stack from 'lib/stack.js'
import mockStackClient from './mockStackClient'

const onCreate = function() {}
const onDelete = function() {}

describe('stack proxy', () => {
  beforeAll(() => {
    jest.spyOn(client, 'init').mockResolvedValue(undefined)
    jest.spyOn(client.get, 'app').mockResolvedValue(undefined)
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  describe('when initialized with a cozy-client instance', () => {
    const params = {
      cozyClient: new CozyClient({ stackClient: mockStackClient }),
      onCreate: function() {},
      onDelete: function() {}
    }

    beforeAll(() => {
      jest.clearAllMocks()

      stack.init(params)
      stack.get.app()
    })

    it('should call the client stack init', () => {
      expect(client.init).toHaveBeenCalled()
    })

    it('should forward requests to the cozy-client stack client', () => {
      expect(client.get.app).toHaveBeenCalled()
    })
  })

  it('should throw error if trying to use the stack before init', () => {
    jest.clearAllMocks()
    jest.resetModules()
    const stack = require('lib/stack').default

    expect(() => {
      stack.getStack()
    }).toThrowErrorMatchingSnapshot()

    stack.init({
      cozyClient: new CozyClient({ stackClient: mockStackClient }),
      onCreate,
      onDelete
    })
    expect(() => {
      stack.getStack()
    }).not.toThrowError()
  })
})
