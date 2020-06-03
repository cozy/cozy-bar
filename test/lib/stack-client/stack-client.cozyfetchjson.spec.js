import stack from 'lib/stack-client'
import CozyClient from 'cozy-client'
import mockStackClient from '../mockStackClient'

describe('stack client', () => {
  describe('cozyFetchJSON', () => {
    let json = jest.fn().mockReturnValue({
      data: { id: 'myid' }
    })
    let fetch = jest.fn().mockResolvedValue({
      status: 200,
      headers: {
        get: () => 'application/json'
      },
      json
    })

    let cozyClient = new CozyClient({
      stackClient: {
        ...mockStackClient,
        fetch
      }
    })

    let params = {
      cozyClient,
      onCreateApp: function() {},
      onDeleteApp: function() {}
    }

    beforeAll(async () => {
      await stack.init(params)
    })

    it('should transform `id` in `_id`', async () => {
      const data = await stack.cozyFetchJSON('_', 'GET', '/path')
      expect(data._id).toBe('myid')
    })

    it('should call fetch from cozy-client', async () => {
      fetch.mockClear()
      await stack.cozyFetchJSON('_', 'GET', '/path')
      expect(fetch).toHaveBeenCalled()
    })
  })
})
