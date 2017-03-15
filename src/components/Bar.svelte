{{#if target !== 'mobile'}}
<button class='coz-bar-burger' on:click='toggleDrawer()' data-icon='icon-hamburger'>
  {{t('menu')}}
</button>
{{/if}}

<h1 class='coz-bar-title'>
  <img class='coz-bar-hide-sm' src='{{iconPath}}' width='32' />
  <span class='coz-bar-hide-sm'>cozy </span><strong>{{appName}}</strong>
</h1>

<hr class='coz-sep-flex' />

<Navigation sections='{{config.sections.bar}}' on:open='onPopOpen(event.panel)' />

{{#if target !== 'mobile'}}
<Drawer content='{{config.apps}}' footer='{{config.sections.drawer}}' visible={{drawerVisible}} on:close='toggleDrawer(true)'/>
{{/if}}

<script>
  import deepClone from 'deep-clone'
  import deepEqual from 'deep-equal'

  import { t } from '../lib/i18n'
  import stack from '../lib/stack'
  import { UnavailableSettingsException } from '../lib/exceptions'

  import Navigation from './Navigation'
  import Drawer from './Drawer'

  import MENU_CONFIG from '../config/menu'

  const EXCLUDES = ['settings']

  async function updateAppsItems (config) {
    let apps

    try {
      apps = (await stack.get.apps())
      .filter(app => !EXCLUDES.includes(app.attributes.slug))
      .map(app => {
        return {
          slug: app.attributes.slug,
          l10n: false,
          href: app.links.related,
          icon: app.links.icon
        }
      })
    } catch (e) {
      apps = [{error: e}]
    }

    config.apps.length = 0
    Array.prototype.push.apply(config.apps, apps)
  }

  async function updateDiskUsage (config) {
    let currentDiskUsage

    try {
      currentDiskUsage = await stack.get.diskUsage()
    } catch (e) {
      currentDiskUsage = { error: e.name }
    }

    config.components.storage.currentDiskUsage = currentDiskUsage
  }

  /**
   * Add / Remove settings' links items regarding the status of
   * the `settings` app
   * @return {Promise}
   */
  async function toggleSettingsItems (config) {
    // We reset the settings' links array
    config.subsections.settings.length = 0

    // If the `settings` app is available, we restore links from the root
    // MENU_CONFIG tree, updating the links' URLs with the app URI at same time.
    try {
      await stack.has.settings()
    } catch (e) {
      console.warn('Settings app is unavailable, links are disabled')
      return
    }

    const items = await updateSettingsURIs(MENU_CONFIG.subsections.settings)
    Array.prototype.push.apply(config.subsections.settings, items)
  }

  /**
   * Replace in the given tree the base URIs for settings' app items
   * @param  {Object}  tree The JSON defined menu entries
   * @return {Promise}      The parsed tree
   */
  async function updateSettingsURIs (items) {
    const baseURI = await stack.get.settingsBaseURI()
    return items.map(item => Object.assign({}, item, {href: `${baseURI}#${item.href}`}))
  }

  /**
   * Clone and parse a root node from a JSON definition tree (aka 'menu')
   * and recursively replace string definitions `_.(group).(entry)` (e.g.
   * `_.components.storage`) with a pointer to the given object in the tree
   * (here, `tree[components][entry]`)
   *
   * @param  {Object} tree                  The tree containing root node and
   *                                        definitions
   * @param  {String} [rootItem='settings'] The root node to parse
   * @return {Object}                       The parsed tree containing pointers
   */
  function createMenuPointers (tree) {
    function parse (value, index, array) {
      let path

      if (!value) { return }

      if (Array.isArray(value)) {
        value.forEach(parse)
      } else if (value === Object(value)) {
        Object.keys(value).forEach(key => parse(value[key], key, value))
      } else if (value.match && (path = value.match(/_\.(\w+)(?:\.(\w+))?/i))) {
        if (path[2]) {
          array[index] = clone[path[1]][path[2]]
        } else {
          array[index] = clone[path[1]]
        }
      }
    }

    const clone = deepClone(tree)
    parse(clone)

    return clone
  }

  /**
   * Helper function to update apps in CONFIG tree
   * @param  {Object}           config the JSON CONFIG tree source
   * @return {Promise(boolean)} a valve that allow to trigger update or not
   */
  async function updateApps (config) {
    const oldApps = config.apps.slice()

    await updateAppsItems(config)

    return !deepEqual(oldApps, config.apps)
  }

  /**
   * Helper function to update all settings related in CONFIG tree
   * @param  {Object}           config the JSON CONFIG tree source
   * @param  {Object}           options
   *                            - storage {Boolean} update the storage component
   *                            - items {Boolean} update settings items list
   * @return {Promise(boolean)} a valve that allow to trigger update or not
   */
  async function updateSettings (config, {storage = true, items = true} = {}) {
    let valve = false

    if (storage) {
      const oldDiskUsage = config.components.storage.currentDiskUsage
      await updateDiskUsage(config)
      valve = valve || oldDiskUsage != config.components.storage.currentDiskUsage
    }

    if (items) {
      const oldSettingsItems = config.subsections.settings.slice()
      await toggleSettingsItems(config)
      valve = valve || !deepEqual(oldSettingsItems, config.subsections.settings)
    }

    return valve
  }

  export default {
    data () {
      const config = createMenuPointers(MENU_CONFIG)

      updateSettings(config)
      updateApps(config)

      return {
        target: __TARGET__,
        config,
        drawerVisible: false
      }
    },

    },

    components: {
      Navigation,
      Drawer
    },

    helpers: { t },

    methods: {
      async toggleDrawer(force) {
        const config = this.get('config')
        const toggle = force ? false : !this.get('drawerVisible')

        if (toggle) {
          // we only update settings items, and lets the `updateApps`
          // as the settings items directly rely on the presence of the
          // _settings_ app
          const settingsValve = await updateSettings(config, {storage: false})
          const appsValve = await updateApps(config)

          /** Ugly hack to force re-render by triggering `set` method on config */
          if ( settingsValve || appsValve ) { this.set({ config }) }
        }

        this.set({drawerVisible: toggle})
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
