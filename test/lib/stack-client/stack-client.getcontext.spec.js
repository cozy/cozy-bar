import stack from 'lib/stack-client'
import CozyClient from 'cozy-client'
import { NotFoundException, UnauthorizedStackException } from 'lib/exceptions'
import mockStackClient from '../mockStackClient'

describe('stack client', () => {
  describe('getContext', () => {
    const context404 = new NotFoundException()

    const context500 = new UnauthorizedStackException()

    const context200 = {
      status: 200,
      headers: { get: () => 'application/json' },
      json: () => {
        return {
          data: {
            type: 'io.cozy.settings',
            id: 'io.cozy.settings.context',
            attributes: {
              default_redirection: 'drive/#/files',
              help_link: 'https://forum.cozy.io/',
              onboarded_redirection: 'collect/#/discovery/?intro'
            },
            links: {
              self: '/settings/context'
            }
          }
        }
      }
    }

    const stackClient = {
      ...mockStackClient,
      fetch: jest.fn()
    }

    const cozyClient = new CozyClient({
      stackClient
    })

    const params = {
      cozyClient,
      onCreateApp: function() {},
      onDeleteApp: function() {}
    }

    beforeAll(async () => {
      await stack.init(params)
    })

    beforeEach(() => {
      stackClient.fetch.mockClear()
    })

    afterAll(() => {
      jest.restoreAllMocks()
    })

    it('should not cache 500 errors', async () => {
      stackClient.fetch.mockRejectedValue(context500)
      await stack.get.context().catch(() => undefined)
      await stack.get.context().catch(() => undefined)
      expect(stackClient.fetch).toHaveBeenCalledTimes(2)
    })

    it('should return the raw json content', async () => {
      stackClient.fetch.mockResolvedValue(context200)
      const data = await stack.get.context()
      expect(data.data.id).toBe('io.cozy.settings.context')
    })

    it('should be cached', async () => {
      stackClient.fetch.mockResolvedValue(context200)
      const data1 = await stack.get.context()
      // If we did not called mockClear, we
      // would have 0 or 1 call to the mock
      // depending on preceding tests.
      // Here we always should expect 0
      // in the next lines
      stackClient.fetch.mockClear()
      stackClient.fetch.mockRejectedValue(context404)
      const data2 = await stack.get.context()
      expect(data1).toBe(data2)
      expect(stackClient.fetch).toHaveBeenCalledTimes(0)
    })

    xit('should return the default value for a 404', async () => {
      // @TODO deactivated because the previous tests already
      // set the cache and the tested function is statefull
      stackClient.fetch.mockRejectedValue(context404)
      const data = await stack.get.context()
      expect(data).toEqual({})
    })
  })
})
