import { Q, fetchPolicies } from 'cozy-client'

const ONE_HOUR = 60 * 60 * 1000

export const buildMyselfQuery = () => {
  return {
    definition: Q('io.cozy.contacts').where({ me: true }),
    options: {
      as: 'io.cozy.contacts/myself',
      fetchPolicy: fetchPolicies.olderThan(ONE_HOUR)
    }
  }
}
