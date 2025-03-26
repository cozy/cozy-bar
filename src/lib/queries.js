import { Q } from 'cozy-client'

export const buildMyselfQuery = () => {
  return {
    definition: Q('io.cozy.contacts').where({ me: true }),
    options: {
      as: 'io.cozy.contacts/myself'
    }
  }
}
