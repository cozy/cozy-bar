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
        currentStorage: 42,
        totalStorage: 60 // TODO grab it from the cozy stack
      }
  },

    helpers: { t }
  }
</script>
