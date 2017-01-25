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

<style>
  .coz-nav-section {
    position: relative;
    display: flex;
    height: 100%;
    align-items: center;
    cursor: pointer;
  }

  .coz-nav-section [aria-controls] {
    font-size: .875em;
    font-weight: bold;
    text-transform: uppercase;
    color: var(--slate-grey);
  }

  .coz-nav-icon {
    margin-right: .5em;
  }

  .coz-nav-pop[aria-hidden=true] {
    display: none;
  }

  .coz-nav-pop {
    position: absolute;
    top: calc(100% + 4px);
    right: -1.5em;
    box-sizing: border-box;
    min-width: 100%;
    background-color: #fff;
    border-radius: 8px;
    border: solid 1px rgba(50, 54, 63, 0.12);
    box-shadow: 0 1px 3px 0 rgba(50, 54, 63, 0.19), 0 6px 18px 0 rgba(50, 54, 63, 0.19);
  }

  .coz-nav-pop ul {
    padding: .5em 0;
  }

  .coz-nav-pop hr {
    border: none;
    border-bottom: solid 1px var(--silver);
  }

  .coz-nav-pop ul:last-of-type + hr {
    display: none;
  }
</style>
