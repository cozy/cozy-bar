<div class='coz-nav-storage'>
  {{#if diskUsage && !diskUsage.error}}
  <p class='coz-nav-storage-text'>
    {{t('storage_phrase', {
      diskUsage: diskUsage,
      diskQuota: diskQuota
    })}}
  </p>
  <progress
    class='cozy-nav-storage-bar'
    value='{{diskUsage}}' max='{{diskQuota}}' min='0'
  />
  {{elseif diskUsage && diskUsage.error}}
  <p class='coz-nav--error'>
    {{t(`error_${diskUsage.error}`)}}
  </p>
  {{/if}}
</div>

<script>
  import { t } from '../lib/i18n'

  export default {
    computed: {
      diskQuota: diskQuotaFromStack => {
        if (Number.isInteger(diskQuotaFromStack)) {
            return (diskQuotaFromStack/1000000000).toFixed(2)
        }
        return diskQuotaFromStack
    },
      diskUsage: diskUsageFromStack => {
        if (Number.isInteger(diskUsageFromStack)) {
            return (diskUsageFromStack/1000000000).toFixed(2)
        }
        return diskUsageFromStack
      }
    },

    helpers: { t }
  }
</script>
