<li class='coz-nav-section' on:click='dispatch(event)'>
  <a on:click='togglePop()' aria-controls='{{`coz-nav-pop--${slug}`}}' aria-busy='{{busy}}' data-icon='{{icon}}'>
    {{t(label)}}
  </a>
  {{#if items.length}}
  <div class='{{`coz-nav-pop coz-nav-pop--${slug}`}}' id='{{`coz-nav-pop--${slug}`}}' aria-hidden={{hidden}}>
    {{#each items as group}}
    <NavigationGroup group='{{group}}' separator='bottom' />
    {{/each}}
  </div>
  {{/if}}
</li>

<script>
  import slug from 'slug'
  import { t } from '../lib/i18n'

  import NavigationGroup from './NavigationGroup'

  let clickOutsideListener

  export default {
    data() {
      return {
        hidden: true
      }
    },
    computed: {
      slug: label => slug(label),
      busy: label => {
        return (label  === 'apps')
      }
    },

    onrender () {
      clickOutsideListener = this._root.on('clickOutside', event => {
        if (!event || event.source != this) { this.set({hidden: true}) }
      })
    },

    onteardown () {
      clickOutsideListener.cancel()
    },

    components: {
      NavigationGroup
    },

    helpers: { t },

    methods: {
      togglePop () {
        const hidden = !this.get('hidden')

        this.set({ hidden })
        if (!hidden) {
          this.fire('open', { panel: this.get('label') })
        }
      },
      dispatch (event) {
        event.stopPropagation()
        this._root.fire('clickOutside', { source: this })
      }
    }
  }
</script>
