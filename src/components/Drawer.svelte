<div ref:wrapper class='coz-drawer-wrapper' on:click='set({folded: true})'>
  <aside on:click='event.stopPropagation()'>
    <nav class='coz-drawer--apps'>
      <h1>{{t('drawer apps')}}</h1>
      <NavigationGroup group='{{content}}' />
    </nav>
    <hr class='coz-sep-flex' />
    <nav>
      {{#each footer as group}}
      <NavigationGroup group='{{group}}' separator='top' />
      {{/each}}
    </nav>
  </aside>
</div>

<script>
  import { t } from '../lib/i18n'

  import NavigationGroup from './NavigationGroup'

  let toggleDrawerObserver

  export default {
    data() {
      return {
        folded: true
      }
    },

    onrender() {
      toggleDrawerObserver = this.observe('folded', folded => {
        if (folded) {
          this.refs.wrapper.classList.toggle('visible', false)
          setTimeout(() => {
            this.refs.wrapper.setAttribute('aria-hidden', true)
          }, 530)
        } else {
          this.refs.wrapper.setAttribute('aria-hidden', 'false')
          setTimeout(() => {
            this.refs.wrapper.classList.toggle('visible', true)
          }, 30)
        }
      })
    },

    onteardown() {
      toggleDrawerObserver.cancel()
    },

    components: {
      NavigationGroup
    },

    helpers: { t }
  }
</script>
