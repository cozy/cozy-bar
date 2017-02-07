<div class='coz-nav-storage'>
  {{#if diskUsage && !diskUsage.error}}
  <p class='coz-nav-storage-text'>
    {{t('storage_phrase', {
      diskUsage: diskUsage,
      totalStorage: totalStorage
    })}}
  </p>
  <progress
    class='cozy-nav-storage-bar'
    value='{{diskUsage}}' max='{{totalStorage}}' min='0'
  />
  {{elseif diskUsage && diskUsage.error}}
  <p class='coz-nav-storage-error'>
    {{t(`error_${diskUsage.error}`)}}
  </p>
  {{/if}}
</div>

<script>
  import { t } from '../lib/i18n'

  export default {
    data() {
      return {
        totalStorage: 60 // TODO grab it from the cozy stack
      }
    },

    computed: {
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
