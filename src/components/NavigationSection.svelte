<li class='coz-nav-section' on:click='dispatch(event)'>
  <a on:click='toggle()' aria-controls='{{`coz-nav-pop--${hash}`}}' aria-busy='{{busy}}' data-icon='{{icon}}'>
    {{label}}
  </a>
  {{#if items && items.length}}
  <div class='{{`coz-nav-pop coz-nav-pop--${hash}`}}' id='{{`coz-nav-pop--${hash}`}}' aria-hidden={{closed}}>
  {{#if items[0].error}}
    <p class='coz-nav--error coz-nav-group'>
      {{t(`error_${items[0].error.name}`)}}
    </p>
  {{elseif grouped}}
    {{#each items as group}}
    <NavigationGroup group='{{group}}' separator='bottom' />
    {{/each}}
  {{else}}
    <NavigationGroup group='{{items}}' />
  {{/if}}
  </div>
  {{/if}}
</li>

<script>
  import { t } from '../lib/i18n'

  import NavigationGroup from './NavigationGroup'

  const BUSY_DELAY = 450

  function open () {
    let valveObserver, busyTimer

    const show = () => {
      clearTimeout(busyTimer)
      this.set({closed: false, busy: false})
      if (valveObserver) {
        valveObserver.cancel()
      }
    }

    busyTimer = setTimeout(() => {
      this.set({busy: true})
    }, BUSY_DELAY)

    this.fire('open', { panel: this.get('slug') })

    if (this.get('async')) {
      this.set({valve: true})
      valveObserver = this.observe('valve', valve => {
        if (!valve) {
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

  export default {
    data() {
      return {
        busy: false,
        closed: true,
        valve: false
      }
    },
    computed: {
      hash: slug => Math.abs([].reduce.call(slug, (hash, char) => char.charCodeAt(0) + (hash << 5) + (hash << 16) - hash, 0)),
      label: slug => t(slug),
      grouped: items => items[0] instanceof Array
    },

    onrender () {
      this.clickOutsideListener = this._root.on('clickOutside', event => {
        if (!event || event.source != this) { this.set({closed: true}) }
      })

      if (this.get('async')) {
        this.asyncObserver = this.observe('items', items => {
          this.set({ valve: false })
        });
      }
    },

    onteardown () {
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
