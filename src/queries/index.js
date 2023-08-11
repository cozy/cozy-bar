import { Q } from 'cozy-client'

export const instanceReq = {
  query: () => Q('io.cozy.settings').getById('io.cozy.settings.instance'),
  as: 'io.cozy.settings/io.cozy.settings.instance'
}

export const contextReq = {
  query: () => Q('io.cozy.settings').getById('context'),
  as: 'io.cozy.settings/context'
}

export const diskUsageReq = {
  query: () => Q('io.cozy.settings').getById('disk-usage'),
  as: 'io.cozy.settings/disk-usage'
}
