export const instanceReq = {
  query: client => {
    return client.get('io.cozy.settings', 'instance')
  },
  as: 'instanceQuery'
}

export const contextReq = {
  query: client => {
    return client.get('io.cozy.settings', 'context')
  },
  as: 'contextQuery'
}

export const diskUsageReq = {
  query: client => {
    return client.get('io.cozy.settings', 'disk-usage')
  },
  as: 'diskUsageQuery'
}
