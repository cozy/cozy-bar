import { Q } from 'cozy-client'

export const instanceReq = {
  query: () => Q('io.cozy.settings').getById('instance'),
  as: 'instanceQuery'
}

export const contextReq = {
  query: () => Q('io.cozy.settings').getById('context'),
  as: 'contextQuery'
}

export const diskUsageReq = {
  query: () => Q('io.cozy.settings').getById('disk-usage'),
  as: 'diskUsageQuery'
}
