import React from 'react'

import { useInstanceInfo } from 'cozy-client'
import { makeDiskInfos } from 'cozy-client/dist/models/instance'
import { LinearProgress } from 'cozy-ui/transpiled/react/Progress'

import useI18n from 'components/useI18n'

const StorageData = () => {
  const { t } = useI18n()
  const { isLoaded, diskUsage } = useInstanceInfo()

  if (!isLoaded) return null

  // we used this default quota set in getStorageData, we just reuse it here
  const storageData = makeDiskInfos(
    diskUsage.data.attributes.used,
    diskUsage.data.attributes.quota ||
      Math.max(10 ** 12, 10 * parseInt(diskUsage.data.attributes.used, 10))
  )

  return (
    <>
      {t('storage_phrase', {
        diskUsage: storageData.humanDiskUsage,
        diskQuota: storageData.humanDiskQuota
      })}
      <LinearProgress
        style={{ width: '85%' }}
        className="u-mt-half"
        variant="determinate"
        value={parseInt(storageData.percentUsage)}
      />
    </>
  )
}

export default StorageData
