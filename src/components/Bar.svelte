<h1>
  <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" width="32" height="32" />
  cozy <strong>{{ appName }}</strong>
</h1>

<Navigation items='{{ menuItems }}' />

<script>
  import Navigation from './Navigation'
  import MENU_CONFIG from '../config/menu'

  export default {
    data () {
      return {
        menuItems: MENU_CONFIG
      }
    },
    components: {
      Navigation
    }
  }
</script>
