<li class='coz-nav-item'>
  {{#if item.component}}
  <div role='menuitem' data-icon='{{dataIcon?dataIcon:""}}' aria-busy='{{isBusy}}'>
    {{label}}
    {{#if item.component === 'storage'}}
    <Storage diskUsageFromStack='{{item.currentDiskUsage}}' />
    {{/if}}
  </div>
  {{else}}
  <a role='menuitem' href='{{item.href}}' target='{{item.external?"_blank":"_self"}}' data-icon='{{dataIcon?dataIcon:""}}'>
    {{#if fileIcon}}
    <img src='{{fileIcon.src}}' alt='' width='64' height='64' class='{{fileIcon.class ? fileIcon.class : ''}}' />
    {{/if}}
    {{label}}
  </a>
  {{/if}}
</li>

<script>
  import { t } from '../lib/i18n'
  import stack from '../lib/stack'

  import Storage from './Storage'

  export default {
    computed: {
      isBusy: item => {
        if (!item.component) { return false }

        if (item.component === 'storage') {
          item.currentDiskUsage !== null
        }
      },
      fileIcon: item => {
        if (!item.icon) { return false }

        if (item.icon.cached) {
          return {
            src: item.icon.src
          }
        } else {
          return {
            src: require('../assets/icons/16/icon-cube-16.svg'),
            class: 'blurry'
          }
        }
      },
      dataIcon: item => {
        if (!item.icon) { return `icon-${item.label}` }
      },
      label: item => {
        if (item.l10n == null || item.l10n) { return t(item.label) }
        else { return item.label }
      }
    },

    onrender() {
      this.lazyloader = this.observe('item', item => {
        if (!item.icon || item.icon.onload || item.icon.cached) { return }

        const uri = `${stack.get.cozyURL()}${item.icon}`

        item = Object.assign({}, item, { icon: {
          src: uri,
          cached: false,
          onload: true
        }})

        this.set({item})

        const loader = new Image()
        loader.onload = () => {
          item.icon.cached = true
          item.icon.onload = false
          this.set({item})
        }

        loader.src = uri
      })
    },

    onteardown() {
      this.lazyloader.cancel()
    },

    components: {
      Storage
    },

    helpers: { t }
  }
</script>
