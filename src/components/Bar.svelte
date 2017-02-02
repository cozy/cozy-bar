<button class='coz-bar-burger' on:click='toggleDrawer()' data-icon='icon-hamburger'>
  {{t('menu')}}
</button>

<h1 class='coz-bar-title'>
  <img class='coz-bar-hide-sm' src='{{iconPath}}' width='32' />
  <span class='coz-bar-hide-sm'>cozy </span><strong>{{appName}}</strong>
</h1>

<hr class='coz-sep-flex' />

<Navigation sections='{{sections}}' on:open='onOpen(event.panel)' />

<Drawer ref:drawer groups='{{sections[1].items}}' />

<script>
  import { t } from '../lib/i18n'
  import stack from '../lib/stack'

  import Navigation from './Navigation'
  import Drawer from './Drawer'

  import MENU_CONFIG from '../config/menu'

  export default {
    data() {
      return {
        config: MENU_CONFIG
      }
    },

    computed: {
      sections: config => {
        return [{
          label: 'apps',
          icon: 'icon-cube',
          items: config.apps
        }, {
          label: 'settings',
          icon: 'icon-cog',
          items: config.settings
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
      },
      async onOpen (panel) {
        try {
          if (panel === 'apps') {
            let apps = await stack.get.apps()
            apps = [await apps.map(app => {
              return {
                label: app.attributes.name,
                external: true,
                l10n: false,
                href: `https://${app.attributes.slug}.cozy.local/`,
                icon: `https://${app.attributes.slug}.cozy.local/${app.attributes.icon}`
              }
            })]
            const config = Object.assign({}, this.get('config'), {apps})
            this.set({config})
          }
        } catch (e) {
          console.warn(e.message)
        }
      }
    }
  }
</script>
