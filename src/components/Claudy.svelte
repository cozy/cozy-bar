<div class='{{`coz-claudy coz-bar-hide-sm ${opened ? "coz-claudy--opened" : ""}`}}'>
  <button class='coz-claudy-icon' data-claudy-opened='{{opened}}' on:click='toggleClaudy()'/>
  <ClaudyMenu actions='{{config.actions}}' on:close='toggleClaudy()'/>
</div>

<script>
  import { t } from '../lib/i18n'

  import ClaudyMenu from './ClaudyMenu'

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

    helpers: { t },

    components: {
      ClaudyMenu
    }
  }
</script>
