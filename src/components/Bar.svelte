<button class='coz-bar-burger' on:click='toggleDrawer()'>
  <svg class='coz-nav-icon'><use xlink:href='{{burgerIcon}}' /></svg>
</button>

<h1 class='coz-bar-title'>
  <img class='coz-bar-hide-sm' src='{{ iconPath }}' width='32' />
  <span class='coz-bar-hide-sm'>cozy </span><strong>{{ appName }}</strong>
</h1>

<hr class='coz-sep-flex' />

<Navigation sections='{{ sections }}' />

<Drawer ref:drawer groups='{{sections[0].items}}' />

<script>
  import Navigation from './Navigation'
  import Drawer from './Drawer'

  import MENU_CONFIG from '../config/menu'

  export default {
    data () {
      return {
        burgerIcon: require('../assets/icons/icon-hamburger.svg'),
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

    methods: {
      toggleDrawer() {
        this.refs.drawer.set({folded: false})
      }
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

  @media (max-width: 30em) {
    .coz-bar-title {
      font-size: 1.25em
    }
  }

  .coz-bar-title img {
    margin-right: .45em;
  }

  .coz-bar-title strong {
    margin-left: .25em;
    font-weight: bold;
  }

  @media (max-width: 30em) {
    .coz-bar-hide-sm {
      display: none;
    }

    .coz-bar-title strong {
      margin: 0;
      text-transform: capitalize;
    }
  }

  .coz-bar-burger {
    width: 16px;
    height: 16px;
    margin: auto 1em auto 0;
    padding: 0;
    border: none;
  }

  @media (min-width: 30.0625em) {
    .coz-bar-burger {
      display: none;
    }
  }
</style>
