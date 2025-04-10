import React from 'react'

import { useQuery } from 'cozy-client'
import { getInitials } from 'cozy-client/dist/models/contact'
import Avatar from 'cozy-ui/transpiled/react/Avatar'
import Skeleton from 'cozy-ui/transpiled/react/Skeleton'

import { buildMyselfQuery } from 'lib/queries'

const AvatarMyself = ({ className, size = 'm' }) => {
  const myselfQuery = buildMyselfQuery()

  const { fetchStatus, data } = useQuery(
    myselfQuery.definition,
    myselfQuery.options
  )

  if (fetchStatus !== 'loaded') {
    return <Skeleton variant="circle" width={32} height={32} />
  }

  const me = data[0]

  if (me) {
    const initials = getInitials(me)

    return (
      <Avatar className={className} size={size}>
        {initials}
      </Avatar>
    )
  }
}

export default AvatarMyself
