import internal from 'lib/stack-internal.js'
import client from 'lib/stack-client.js'
import stack from 'lib/stack.js'

const cozyURL = 'https://test.mycozy.cloud'
const token = 'mytoken'
const onCreateApp = function() {}
const onDeleteApp = function() {}

describe('stack proxy', () => {
  beforeAll(() => {
    jest.spyOn(internal, 'init').mockResolvedValue(undefined)
    jest.spyOn(internal.get, 'app').mockResolvedValue(undefined)

    jest.spyOn(client, 'init').mockResolvedValue(undefined)
    jest.spyOn(client.get, 'app').mockResolvedValue(undefined)
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  describe('when initialized with an cozyURL + token', () => {
    const params = { cozyURL, token, onCreateApp, onDeleteApp }

    beforeAll(() => {
      jest.clearAllMocks()

      stack.init(params)
      stack.get.app()
    })

    it('should call the internal stack init', () => {
      expect(internal.init).toHaveBeenCalled()
    })

    it('should not call the cozy-client stack init', () => {
      expect(client.init).not.toHaveBeenCalled()
    })

    it('should forward requests to the internal stack client', () => {
      expect(internal.get.app).toHaveBeenCalled()
    })

    it('should not forward requests to the cozy-client stack client', () => {
      expect(client.get.app).not.toHaveBeenCalled()
    })
  })

  describe('when initialized with a cozy-client instance', () => {
    const cozyClient = {
      getStackClient: () => {
        return {
          token: { token: 'mytoken' },
          uri: 'https://test.mycozy.cloud'
        }
      }
    }
    const params = {
      cozyClient,
      onCreateApp: function() {},
      onDeleteApp: function() {}
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
    const params = { cozyURL, token, onCreateApp, onDeleteApp }

    // TODO for now the stack is default to internal even before init
    // expect(() => {
    //   stack.getStack()
    // }).toThrowErrorMatchingSnapshot()
    stack.init(params)
    expect(() => {
      stack.getStack()
    }).not.toThrowError()
    expect(stack.getStack()).toMatchSnapshot()
  })
})
