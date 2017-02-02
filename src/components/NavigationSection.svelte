<li class='coz-nav-section' on:click='event.stopPropagation()'>
  <a on:click='togglePop()' aria-controls='{{`coz-nav-pop--${slug}`}}' data-icon='{{icon}}'>
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
      slug: label => slug(label)
    },

    onrender () {
      clickOutsideListener = this._root.on('clickOutside', () => {
        this.set({hidden: true})
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
      }
    }
  }
</script>
