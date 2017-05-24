<li class='coz-nav-item'>
  {{#if item.component}}
  <div role='menuitem' data-icon='{{dataIcon?dataIcon:""}}' aria-busy='{{isBusy}}'>
    {{label}}
    {{#if item.component === 'storage'}}
    <Storage diskUsageFromStack='{{item.currentDiskUsage}}' diskQuotaFromStack='{{item.currentDiskQuota}}' />
    {{/if}}
  </div>
  {{elseif item.inactive}}
    <div role='menuitem'>
      <p class='coz-bar-text-item--inactive'>{{label}}</p>
    </div>
  {{elseif item.href}}
    <a role='menuitem' href='{{item.href}}' target='{{item.external?"_blank":"_self"}}' data-icon='{{dataIcon?dataIcon:""}}'>
      {{#if fileIcon}}
      <img src='{{fileIcon.src}}' alt='' width='64' height='64' class='{{fileIcon.class ? fileIcon.class : ''}}' />
      {{/if}}
      <p class='coz-label'>{{label}}</p>
    </a>
  {{elseif item.action}}
    <button role='menuitem' data-icon='{{dataIcon?dataIcon:""}}' on:click='proxy(item.action)'>
      {{#if fileIcon}}
      <img src='{{fileIcon.src}}' alt='' width='64' height='64' class='{{fileIcon.class ? fileIcon.class : ''}}' />
      {{/if}}
      {{label}}
    </button>
  {{else}}
    <div role='menuitem'>
      <p class='coz-bar-text-item'>{{label}}</p>
    </div>
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
        if (!item.icon) { return `icon-${item.slug}` }
      },
      label: item => {
        if (item.name) {
            const displayName = (item.editor ? (item.editor + ' ') : '') + item.name
            if (item.l10n == null || item.l10n) { return t(displayName) }
            else { return displayName }
        } else if (item.slug) {
            if (item.l10n == null || item.l10n) { return t(item.slug) }
            else { return item.slug }
        }
      }
    },

    components: {
      Storage
    },

    helpers: { t },

    methods: {
      proxy (actionName) {
        stack[actionName]()
      }
    }
  }
</script>
