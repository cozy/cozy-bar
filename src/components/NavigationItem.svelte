<li class='coz-nav-item'>
  <a href='{{item.href}}' target='{{item.external?"_blank":"_self"}}' data-icon='{{dataIcon?dataIcon:""}}'>
    {{#if fileIcon}}
    <img src='{{fileIcon}}' alt='' width='64' height='64' class='blurry' />
    {{/if}}
    {{label}}
  </a>
</li>

<script>
  import { t } from '../lib/i18n'

  export default {
    computed: {
      fileIcon: item => {
        if (item.icon) {
          return require('../assets/icons/16/icon-cube-16.svg')
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

    helpers: { t }
  }
</script>
