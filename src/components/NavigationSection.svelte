<li class='coz-nav-section' on:click='dispatch(event)'>
  <a on:click='toggle()' aria-controls='{{`coz-nav-pop--${slug}`}}' aria-busy='{{busy}}' data-icon='{{icon}}'>
    {{t(slug)}}
  </a>
  {{#if items && items.length}}
  <div class='{{`coz-nav-pop coz-nav-pop--${slug}`}}' id='{{`coz-nav-pop--${slug}`}}' aria-hidden={{closed}}>
  {{#if items[0].error}}
    <p class='coz-nav--error coz-nav-group'>
      {{t(`error_${items[0].error.name}`)}}
    </p>
  {{elseif grouped}}
    {{#each items as group}}
    <NavigationGroup group='{{group}}' separator='bottom' />
    {{/each}}
  {{else}}
    {{#if categories}}
      {{#each categories as category}}
        <h2 class='coz-nav-category'>{{t(`Categories.${category.title}`)}}</h2>
        <NavigationGroup group='{{category.items}}' itemsLimit={{4}} separator='bottom' />
      {{/each}}
    {{else}}
      <NavigationGroup group='{{items}}' />
    {{/if}}
  {{/if}}
  </div>
  {{/if}}
</li>

<script>
  import { t } from '../lib/i18n'

  import NavigationGroup from './NavigationGroup'

  const BUSY_DELAY = 450

  function open () {
    let isFetchingObserver, busyTimer

    const show = () => {
      clearTimeout(busyTimer)
      this.set({closed: false, busy: false})
      if (isFetchingObserver) {
        isFetchingObserver.cancel()
      }
    }

    busyTimer = setTimeout(() => {
      this.set({busy: true})
    }, BUSY_DELAY)

    this.fire('open', { panel: this.get('slug') })

    if (this.get('async')) {
      isFetchingObserver = this.observe('isFetching', isFetching => {
        if (!isFetching) {
          // setTimeout for states propagation
          setTimeout(() => { show() }, 0)
        }
      })
    } else {
      show()
    }
  }

  function close () {
    this.set({closed: true})
  }


  function toggle () {
    const closed = this.get('closed')
    if (closed) {
      open.call(this)
    } else {
      close.call(this)
    }
  }

  // Take an items array and return an array of category objects with the matching title and items
  function getCategorizedItems (items) {
    if (items[0] instanceof Array) return null // doesn't handle this case
    const categorizedItemsObject = items.reduce((accumulator, item) => {
      accumulator[item.category] = accumulator[item.category] || []
      accumulator[item.category].push(item)
      return accumulator
     }, {})

    return Object.keys(categorizedItemsObject).map(category => {
      return {title: category, items: categorizedItemsObject[category]}
    })
  }

  export default {
    data() {
      return {
        busy: false,
        closed: true,
        isFetching: true
      }
    },
    computed: {
      grouped: items => items[0] instanceof Array,
      categories: (items, categorized) =>
        categorized ? getCategorizedItems(items) : null
    },

    oncreate () {
      this.clickOutsideListener = this._root.on('clickOutside', event => {
        if (!event || event.source != this) { this.set({closed: true}) }
      })

      if (this.get('async')) {
        this.asyncObserver = this.observe('items', items => {
          this.set({ isFetching: false })
        });
      }
    },

    ondestroy () {
      this.clickOutsideListener.cancel()
      this.asyncObserver.cancel()
    },

    components: {
      NavigationGroup
    },

    helpers: { t },

    methods: {
      toggle () {
        toggle.call(this)
      },
      dispatch (event) {
        event.stopPropagation()
        this._root.fire('clickOutside', { source: this })
      }
    }
  }
</script>
