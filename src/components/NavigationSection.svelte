<li class='coz-nav-section' on:click='event.stopPropagation()'>
  <a on:click='set({hidden: !hidden})' aria-controls='{{`coz-nav-pop-${hash}`}}' data-icon='{{icon}}'>
    {{t(label)}}
  </a>
  <div class='coz-nav-pop' id='{{`coz-nav-pop-${hash}`}}' aria-hidden={{hidden}}>
    {{#each items as group}}
    <NavigationGroup group='{{group}}' separator='bottom' />
    {{/each}}
  </div>
</li>

<script>
  import jsSHA from 'jssha'
  import NavigationGroup from './NavigationGroup'
  import { t } from '../lib/i18n'

  const SHA1 = new jsSHA('SHA-1', 'TEXT')

  let clickOutsideListener

  export default {
    data() {
      return {
        hidden: true
      }
    },
    computed: {
      hash: label => {
        SHA1.update(label)
        return SHA1.getHash('HEX').slice(0, 6)
      }
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

    helpers: { t }
  }
</script>
