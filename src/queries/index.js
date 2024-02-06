import { Q } from 'cozy-client'

export const buildInstanceQuery = ({ enabled = true } = {}) => ({
  definition: () => Q('io.cozy.settings').getById('io.cozy.settings.instance'),
  options: {
    as: 'io.cozy.settings/io.cozy.settings.instance',
    enabled
  }
})

export const buildContextQuery = ({ enabled = true } = {}) => ({
  definition: () => Q('io.cozy.settings').getById('io.cozy.settings.context'),
  options: { as: 'io.cozy.settings/io.cozy.settings.context', enabled }
})

export const buildDiskUsageQuery = ({ enabled = true } = {}) => ({
  definition: () =>
    Q('io.cozy.settings').getById('io.cozy.settings.disk-usage'),
  options: { as: 'io.cozy.settings/io.cozy.settings.disk-usage', enabled }
})
