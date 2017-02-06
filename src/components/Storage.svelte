<div class='coz-nav-storage'>
  <p class='coz-nav-storage-text'>
    {{t('storage_phrase', {
      currentStorage: currentStorage,
      totalStorage: totalStorage
    })}}
  </p>
  <progress
    class='cozy-nav-storage-bar'
    value='{{currentStorage}}' max='{{totalStorage}}' min='0'
  />
</div>

<script>
  import { t } from '../lib/i18n'

  export default {
    data() {
      return {
        storageFromStack: 42083672908,
        totalStorage: 60 // TODO grab it from the cozy stack
      }
    },

    computed: {
      currentStorage: (storageFromStack) => {
        return (storageFromStack/1000000000).toFixed(2)
      }
    },

    helpers: { t }
  }
</script>
