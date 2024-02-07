import { Q } from 'cozy-client'

export const buildInstanceQuery = () => ({
  definition: () => Q('io.cozy.settings').getById('io.cozy.settings.instance'),
  options: {
    as: 'io.cozy.settings/io.cozy.settings.instance'
  }
})

export const buildContextQuery = () => ({
  definition: () => Q('io.cozy.settings').getById('io.cozy.settings.context'),
  options: { as: 'io.cozy.settings/io.cozy.settings.context' }
})

export const buildDiskUsageQuery = () => ({
  definition: () =>
    Q('io.cozy.settings').getById('io.cozy.settings.disk-usage'),
  options: { as: 'io.cozy.settings/io.cozy.settings.disk-usage' }
})
