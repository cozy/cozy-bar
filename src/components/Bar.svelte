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
  import { t } from '../lib/i18n'
  import stack from '../lib/stack'
  import { UnavailableSettingsException } from '../lib/exceptions'

  import Navigation from './Navigation'
  import Drawer from './Drawer'

  import MENU_CONFIG from '../config/menu'

  const EXCLUDES = ['settings']

  async function updateAppsItems () {
    let apps
    const config = this.get('config')

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

    /** Ugly hack to force re-render by triggering `set` method on config */
    this.set({ config })
  }

  async function updateDiskUsage () {
    let currentDiskUsage

    try {
      currentDiskUsage = +(await stack.get.diskUsage()).attributes.used
    } catch (e) {
      console.error(e.message)
      currentDiskUsage = { error: e.name }
    }

    this.get('config').components.storage.currentDiskUsage = currentDiskUsage

    /** Ugly hack to force re-render by triggering `set` method on config */
    this.set({ config: this.get('config') })
  }

  /**
   * Replace in the given tree the base URIs for settings' app items
   * @param  {Object}  tree The JSON defined menu entries
   * @return {Promise}      The parsed tree
   */
  async function updateSettingsURIs (items) {
    try {
      const baseURI = await stack.get.settingsBaseURI()
      items.forEach(item => item.href = `${baseURI}#${item.href}`)
    } catch (e) {
      console.warn(e.message)
    }
    return items
  }

  /**
   * This function parse a root node from a JSON definition tree (aka 'menu')
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
    const clone = Object.assign({}, tree)

    function parse (item) {
      let path

      if (!item) { return undefined }

      if (item.map) {
        return item.map(parse)
      } else if (item.match && (path = item.match(/_\.(\w+)(?:\.(\w+))?/i))) {
        if (path[2]) {
          return clone[path[1]][path[2]]
        } else {
          return clone[path[1]]
        }
      } else if (item === Object(item)) {
        Object.keys(item).forEach(key => item[key] = parse(item[key]))
        return item
      } else {
        return item
      }
    }

    return parse(clone)
  }

  export default {
    data() {
      const config = createMenuPointers(MENU_CONFIG)
      config.subsections.settings = updateSettingsURIs(config.subsections.settings)

      return {
        target: __TARGET__,
        config
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
