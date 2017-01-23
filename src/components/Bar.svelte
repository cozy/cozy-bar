<h1 class='coz-bar-title'>
  <img src='{{ iconPath }}' width='32' />
  cozy <strong>{{ appName }}</strong>
</h1>

<hr class='coz-sep-flex' />

<Navigation sections='{{ sections }}' />

<script>
  import Navigation from './Navigation'
  import MENU_CONFIG from '../config/menu'

  export default {
    data () {
      return {
        sections: [{
          label: 'settings',
          icon: require('../assets/icons/icon-cog.svg'),
          items: MENU_CONFIG.settings
        }]
      }
    },
    components: {
      Navigation
    }
  }
</script>

<style>
  .coz-bar-title {
    display: flex;
    margin: 0;
    align-items: center;
    font-size: 1.5em;
    font-weight: normal;
    text-transform: lowercase;
    color: var(--charcoal-grey);
  }

  .coz-bar-title img {
    margin-right: .45em;
  }

  .coz-bar-title strong {
    margin-left: .25em;
    font-weight: bold;
  }

  .coz-sep-flex {
    border: none;
    flex: 1 0;
  }
</style>
