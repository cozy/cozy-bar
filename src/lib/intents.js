import { cozyFetchJSON } from 'lib/stack'

// This is a function that does the bare minimum in order to bypass the normal intent flow. To be replaced in th next version of intents.
export function fetchRawIntent(action, type, data = {}, permissions = []) {
  return cozyFetchJSON(null, 'POST', '/intents', {
    data: {
      type: 'io.cozy.intents',
      attributes: {
        action: action,
        type: type,
        data: data,
        permissions: permissions
      }
    }
  })
}
