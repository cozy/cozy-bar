<button class='coz-bar-burger' on:click='toggleDrawer()' data-icon='icon-hamburger'>
  {{t('menu')}}
</button>

<h1 class='coz-bar-title'>
  <img class='coz-bar-hide-sm' src='{{iconPath}}' width='32' />
  <span class='coz-bar-hide-sm'>cozy </span><strong>{{appName}}</strong>
</h1>

<hr class='coz-sep-flex' />

<Navigation sections='{{sections}}' on:open='onPopOpen(event.panel)' />

<Drawer ref:drawer content='{{config.apps.length?config.apps[0]:false}}' footer='{{sections[1].items}}' />

<script>
  import { t } from '../lib/i18n'
  import stack from '../lib/stack'

  import Navigation from './Navigation'
  import Drawer from './Drawer'

  import MENU_CONFIG from '../config/menu'

  async function updateAppsItems () {
    try {
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
      this.set({ config: Object.assign({}, this.get('config'), {apps}) })
    } catch (e) {
      console.error(e.message)
    }
  }

  async function updateDiskUsage () {
      let currentDiskUsage
    try {
      let data = await stack.get.diskUsage()
      currentDiskUsage = parseInt(data.attributes.used)
    } catch (e) {
      console.error(e.message)
      currentDiskUsage = { error: e.name }
    }
    // copy settings section to update storage item
    const newSettings = this.get('config').settings.slice()
    newSettings.forEach(section => {
      let storageItem = section.find(item => item.label === 'storage')
      if (storageItem) {
        storageItem.currentDiskUsage = currentDiskUsage
      }
    })
    this.set({ config: Object.assign({}, this.get('config'), {settings: newSettings}) })
  }

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
          async: true,
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
        updateAppsItems.call(this)
      },
      onPopOpen (panel) {
        if (panel === 'apps') {
          updateAppsItems.call(this)
        } else if (panel === 'settings') {
          updateDiskUsage.call(this)
        }
      }
    }
  }
</script>
