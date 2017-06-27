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
<Drawer content='{{config.apps}}' footer='{{config.sections.drawer}}' visible={{drawerVisible}} on:close='toggleDrawer(true)' on:claudy='toggleClaudy()'/>
  {{#if claudyConfig}}
    <Claudy config='{{claudyConfig}}' appsList='{{config.apps}}' usageTracker='{{usageTracker}}' on:toggle='toggleClaudy()' opened='{{claudyOpened}}'/>
  {{/if}}
{{/if}}

<script>
  import { t } from '../lib/i18n'
  import { createMenuPointers, updateSettings, updateApps, getClaudyConfig } from '../lib/config'
  /* global __PIWIK_TRACKER_URL__  __PIWIK_SITEID__ __PIWIK_DIMENSION_ID_APP__*/
  import { shouldEnableTracking, getTracker, configureTracker } from '../lib/piwik'

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
        claudyOpened: false,
        drawerVisible: false,
        usageTracker: null
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
        const claudyConfigFromState = this.get('claudyConfig')
        this.set({config, claudyConfig: claudyConfigFromState}) // force to rerender when locale change
      })

      let claudyConfig = null
      if (this.get('target') !== 'mobile' && !this.get('isPublic')) {
        claudyConfig = await getClaudyConfig()
        await updateSettings(config)
        await updateApps(config)
      }
      // filter claudy subsection if claudyConfig is null
      if (!claudyConfig) {
        if (config.sections && config.sections.drawer) {
          config.sections.drawer = config.sections.drawer.filter(s => s.length && s[0].slug !== 'claudy')
        }
      }

      this.set({ config, claudyConfig })

      // if tracking enabled, init the piwik tracker
      if (shouldEnableTracking()) {
        const trackerInstance = getTracker(__PIWIK_TRACKER_URL__, __PIWIK_SITEID__, false, false)
        configureTracker({
          appDimensionId: __PIWIK_DIMENSION_ID_APP__,
          app: 'Cozy Bar',
          heartbeat: 0
        })
        trackerInstance.push(['disableHeartBeatTimer']) // undocumented, see https://github.com/piwik/piwik/blob/3.x-dev/js/piwik.js#L6544
        this.set({usageTracker: trackerInstance})
      }
    },

    components: {
      Navigation,
      Drawer,
      Claudy
    },

    helpers: { t },

    methods: {
      async toggleDrawer() {
        // don't allow to toggle the drawer if claudy opened
        if (this.get('claudyOpened')) return

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
      toggleClaudy () {
        if (!this.get('claudyConfig')) return
        const claudyOpened = this.get('claudyOpened')
        const usageTracker = this.get('usageTracker')
        if (usageTracker) {
          usageTracker.push([
            'trackEvent',
            'Claudy',
            claudyOpened ? 'close' : 'open',
            'claudy'
          ])
        }
        this.set({ claudyOpened: !claudyOpened })
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
