<li class='coz-nav-item'>
  {{#if item.external}}
    <a href='{{item.href}}' target='_blank' data-icon='{{icon}}'>
      {{t(item.label)}}
    </a>
  {{else}}
    <a href='{{item.href}}' data-icon='{{icon}}'>
      {{t(item.label)}}
    </a>
  {{/if}}
</li>

<script>
  import { t } from '../lib/i18n'

  export default {
    computed: {
      icon: item => `icon-${item.label}`
    },

    helpers: { t }
  }
</script>
