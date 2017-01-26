<button class='coz-bar-burger' on:click='toggleDrawer()' data-icon='icon-hamburger'>
  {{t('menu')}}
</button>

<h1 class='coz-bar-title'>
  <img class='coz-bar-hide-sm' src='{{iconPath}}' width='32' />
  <span class='coz-bar-hide-sm'>cozy </span><strong>{{appName}}</strong>
</h1>

<hr class='coz-sep-flex' />

<Navigation sections='{{sections}}' />

<Drawer ref:drawer groups='{{sections[0].items}}' />

<script>
  import { t } from '../lib/i18n'

  import Navigation from './Navigation'
  import Drawer from './Drawer'

  import MENU_CONFIG from '../config/menu'

  export default {
    data () {
      return {
        sections: [{
          label: 'settings',
          icon: 'icon-cog',
          items: MENU_CONFIG.settings
        }]
      }
    },

    components: {
      Navigation,
      Drawer
    },

    helpers: { t },

    methods: {
      toggleDrawer() {
        this.refs.drawer.set({folded: false})
      }
    }
  }
</script>
