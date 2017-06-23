{{#if target !== 'mobile' && !isPublic}}
<button class='coz-bar-burger' on:click='toggleDrawer()' data-icon='icon-hamburger'>
  <span class='coz-bar-hidden'>{{t('menu')}}</span>
</button>
{{/if}}

<h1 lang='{{lang}}' class='{{titleClass}}'>
  <img class='coz-bar-hide-sm' src='{{iconPath}}' width='32' />
  {{#if appEditor}}<span class='coz-bar-hide-sm'>{{appEditor}} </span>{{/if}}
  <strong>{{appName}}</strong>
  <sup class='coz-bar-hide-sm coz-bar-beta-status'>{{t('beta')}}</sup>
</h1>

<hr class='coz-sep-flex' />

{{#if !isPublic}}
<Navigation sections='{{config.sections.bar}}' on:open='onPopOpen(event.panel)' />
{{/if}}

{{#if target !== 'mobile' && !isPublic}}
<Drawer content='{{config.apps}}' footer='{{config.sections.drawer}}' visible={{drawerVisible}} on:close='toggleDrawer(true)'/>
  {{#if claudyConfig}}
    <Claudy config='{{claudyConfig}}' appsList='{{config.apps}}'/>
  {{/if}}
{{/if}}

<script>
  import { t } from '../lib/i18n'
  import { createMenuPointers, updateSettings, updateApps, getClaudyConfig } from '../lib/config'

  import Navigation from './Navigation'
  import Drawer from './Drawer'
  import Claudy from './Claudy'

  import MENU_CONFIG from '../config/menu'
  import CLAUDY_CONFIG from '../config/claudy'

  export default {
    data () {
      const config = createMenuPointers(MENU_CONFIG)

      return {
        target: __TARGET__,
        config,
        claudyConfig: null, // no claudy by default
        drawerVisible: false
      }
    },

    computed : {
      titleClass: replaceTitleOnMobile => `coz-bar-title ${replaceTitleOnMobile ? 'coz-bar-hide-sm' : ''}`
    },

    /**
     * When loading the Bar component, we once force a first update of config
     * w/ settings and apps
     */
    async oncreate () {
      const config = this.get('config')

      this.observe('lang', () => {
        this.set({config}) // force to rerender when locale change
      })

      let claudyConfig = null
      if (this.get('target') !== 'mobile' && !this.get('isPublic')) {
        claudyConfig = await getClaudyConfig()
        await updateSettings(config)
        await updateApps(config)
      }

      this.set({ config, claudyConfig })
    },

    components: {
      Navigation,
      Drawer,
      Claudy
    },

    helpers: { t },

    methods: {
      async toggleDrawer() {
        const config = this.get('config')
        const drawerVisible = !this.get('drawerVisible')

        if (drawerVisible) {
          // we only update settings items, and lets the `updateApps`
          // as the settings items directly rely on the presence of the
          // _settings_ app
          const settingsValve = await updateSettings(config, {storage: false})
          const appsValve = await updateApps(config)

          /** Ugly hack to force re-render by triggering `set` method on config */
          if ( settingsValve || appsValve ) { this.set({ config }) }
        }

        this.set({ drawerVisible })
      },
      async onPopOpen (panel) {
        const config = this.get('config')
        let valve

        switch (panel) {
          case 'apps':
            await updateApps(config)
            // we force config update as the menu dropdown opening depends on it
            valve = true
            break
          case 'settings':
            valve = await updateSettings(config)
            break
        }

        /** Ugly hack to force re-render by triggering `set` method on config */
        if ( valve ) { this.set({ config }); }
      }
    }
  }
</script>
