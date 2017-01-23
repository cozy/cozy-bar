<h1 class='coz-bar-title'>
  <img src='{{ iconPath }}' width='32' />
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
