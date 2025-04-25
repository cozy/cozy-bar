import React from 'react'

import { useClient } from 'cozy-client'
import Avatar from 'cozy-ui/transpiled/react/Avatar'

const AvatarMyself = ({ className, size = 'm' }) => {
  const client = useClient()
  const rootURL = client.getStackClient().uri

  return (
    <Avatar className={className} size={size}>
      <img
        width="100%"
        height="100%"
        src={`${rootURL}/public/avatar?fallback=initials`}
      />
    </Avatar>
  )
}

export default AvatarMyself
