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
<Drawer ref:drawer content='{{config.apps}}' footer='{{config.sections.drawer}}' />
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

  async function updateAppsItems () {
    const config = this.get('config')
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
      console.error(e.message)
      apps = [{error: e}]
    }

    config.apps.length = 0
    Array.prototype.push.apply(config.apps, apps)
  }

  async function updateDiskUsage () {
    const config = this.get('config')
    let currentDiskUsage

    try {
      currentDiskUsage = +(await stack.get.diskUsage()).attributes.used
    } catch (e) {
      console.error(e.message)
      currentDiskUsage = { error: e.name }
    }

    config.components.storage.currentDiskUsage = currentDiskUsage
  }

  /**
   * Add / Remove settings' links items regarding the status of
   * the `settings` app
   * @return {Promise}
   */
  async function toggleSettingsItems () {
    const config = this.get('config')

    // We reset the settings' links array
    config.subsections.settings.length = 0

    // If the `settings` app is available, we restore links from the root
    // MENU_CONFIG tree, updating the links' URLs with the app URI at same time.
    if (await stack.has.settings()) {
      const items = await updateSettingsURIs(MENU_CONFIG.subsections.settings)
      Array.prototype.push.apply(config.subsections.settings, items)
    }
  }

  /**
   * Replace in the given tree the base URIs for settings' app items
   * @param  {Object}  tree The JSON defined menu entries
   * @return {Promise}      The parsed tree
   */
  async function updateSettingsURIs (items) {
    try {
      const baseURI = await stack.get.settingsBaseURI()
      return items.map(item => Object.assign({}, item, {href: `${baseURI}#${item.href}`}))
    } catch (e) {
      console.warn(e.message)
    }
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

  export default {
    data () {
      return {
        target: __TARGET__,
        config: createMenuPointers(MENU_CONFIG)
      }
    },

    onrender () {
      this.updateApps()
      this.updateSettings()
    },

    components: {
      Navigation,
      Drawer
    },

    helpers: { t },

    methods: {
      toggleDrawer() {
        this.refs.drawer.set({folded: false})
        this.updateApps()
      },
      onPopOpen (panel) {
        switch (panel) {
          case 'apps':
            this.updateApps()
            break
          case 'settings':
            this.updateSettings()
            break
        }
      },
      async updateApps () {
        const config = this.get('config')
        await updateAppsItems.call(this)
        /** Ugly hack to force re-render by triggering `set` method on config */
        this.set({ config })
      },
      async updateSettings () {
        const config = this.get('config')
        const oldDiskUsage = config.components.storage.currentDiskUsage
        const oldSettingsItems = config.subsections.settings.slice()

        await updateDiskUsage.call(this)
        await toggleSettingsItems.call(this)

        /** Ugly hack to force re-render by triggering `set` method on config */
        if (oldDiskUsage != config.components.storage.currentDiskUsage ||
            !deepEqual(oldSettingsItems, config.subsections.settings)) { this.set({ config }) }
      }
    }
  }
</script>
