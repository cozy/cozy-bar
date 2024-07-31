import React from 'react'

import { useInstanceInfo } from 'cozy-client'
import { makeDiskInfos } from 'cozy-client/dist/models/instance'

import useI18n from 'components/useI18n'

const StorageData = () => {
  const { t } = useI18n()
  const { isLoaded, ...instanceInfo } = useInstanceInfo()

  if (!isLoaded) return null

  // we used this default quota set in getStorageData, we just reuse it here
  const storageData = makeDiskInfos(
    instanceInfo.diskUsage.data.attributes.used,
    instanceInfo.diskUsage.data.attributes.quota ||
      Math.max(
        10 ** 12,
        10 * parseInt(instanceInfo.diskUsage.data.attributes.used, 10)
      )
  )

  return (
    <div className="coz-nav-storage">
      <p className="coz-nav-storage-text">
        {t('storage_phrase', {
          diskUsage: storageData.humanDiskUsage,
          diskQuota: storageData.humanDiskQuota
        })}
      </p>
      <progress
        className="cozy-nav-storage-bar"
        value={storageData.humanDiskUsage}
        max={storageData.humanDiskQuota}
        min="0"
      />
    </div>
  )
}

export default StorageData
