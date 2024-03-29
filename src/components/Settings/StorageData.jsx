import React from 'react'

import useI18n from 'components/useI18n'

const StorageData = ({ data }) => {
  const { t } = useI18n()
  const diskQuota = Number.isInteger(data.quota)
    ? (data.quota / (1000 * 1000 * 1000)).toFixed(2)
    : data.quota
  const diskUsage = Number.isInteger(data.usage)
    ? (data.usage / (1000 * 1000 * 1000)).toFixed(2)
    : data.usage
  return (
    <div className="coz-nav-storage">
      <p className="coz-nav-storage-text">
        {t('storage_phrase', {
          diskUsage,
          diskQuota
        })}
      </p>
      <progress
        className="cozy-nav-storage-bar"
        value={diskUsage}
        max={diskQuota}
        min="0"
      />
    </div>
  )
}

export default StorageData
