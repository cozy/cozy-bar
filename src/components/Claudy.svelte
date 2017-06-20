<div class='coz-claudy coz-bar-hide-sm'>
  <button class='coz-claudy-icon' data-claudy-opened='{{opened}}' on:click='toggleClaudy()'/>
  {{#if opened}}
    <ClaudyMenu actions='{{config.actions}}' />
  {{/if}}
</div>

<script>
  import { t } from '../lib/i18n'

  export default {
    data () {
      return {
        opened: false
      }
    },

    methods: {
      toggleClaudy () {
        const opened = !this.get('opened')
        this.set({ opened })
      }
    },

    helpers: { t }
  }
</script>
