import deepClone from 'deep-clone'
import deepEqual from 'deep-equal'

import stack from '../lib/stack'

import MENU_CONFIG from '../config/menu'

const EXCLUDES = ['settings', 'onboarding']
const CATEGORIES = ['cozy', 'partners', 'ptnb']

let cachedComingSoonApps
function fetchComingSoonApps () {
  if (cachedComingSoonApps) return Promise.resolve(cachedComingSoonApps)
  return stack.get.context()
    .then(context => {
      const comingSoonApps = context.data && context.data.attributes &&
        context.data.attributes['coming_soon'] &&
          Object.values(context.data.attributes['coming_soon']) || []

      cachedComingSoonApps = comingSoonApps.map(app => {
        let icon

        try {
          icon = app.slug && {
            cached: true,
            src: require(`../assets/icons/comingsoon/icon-${app.slug}.svg`)
          }
        } catch (error) {
          console.warn && console.warn(`Cannot retrieve icon for app ${app.name}:`, error.message)
        }

        return Object.assign({}, app, {
          comingSoon: true,
          l10n: false,
          icon: icon
        })
      })

      return cachedComingSoonApps
    })
}

async function updateAppsItems (config) {
  let apps
  let comingSoonApps

  try {
    apps = await Promise.all((await stack.get.apps())
      .filter(app => !EXCLUDES.includes(app.attributes.slug))
      .map(async app => {
        const oldApp = config.apps.find(item => item.slug === app.attributes.slug)
        let icon

        if (oldApp && oldApp.icon.cached) {
          icon = oldApp.icon
        } else {
          icon = {
            src: await stack.get.icon(app.links.icon),
            cached: true
          }
        }

        return {
          editor: app.attributes.editor,
          name: app.attributes.name,
          slug: app.attributes.slug,
          l10n: false,
          href: app.links.related,
          category: CATEGORIES.includes(app.attributes.category) ? app.attributes.category : 'others',
          icon
        }
      })
    )
  } catch (e) {
    apps = [{error: e}]
  }

  config.apps.length = 0

  comingSoonApps = await fetchComingSoonApps()
    .catch(error => {
      console.warn && console.warn(`Cozy-bar cannot fetch comming soon apps: ${error.message}`)
      return []
    })

  Array.prototype.push.apply(config.apps, apps.concat(comingSoonApps))
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

async function updateDiskQuota (config) {
  let currentDiskQuota

  try {
    currentDiskQuota = await stack.get.diskQuota()
  } catch (e) {
    currentDiskQuota = { error: e.name }
  }

  config.components.storage.currentDiskQuota = currentDiskQuota
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
    await updateDiskQuota(config)
    valve = valve || oldDiskUsage !== config.components.storage.currentDiskUsage
  }

  if (items) {
    const oldSettingsItems = config.subsections.settings.slice()
    await toggleSettingsItems(config)
    valve = valve || !deepEqual(oldSettingsItems, config.subsections.settings)
  }

  return valve
}

export { createMenuPointers, updateSettings, updateApps }
