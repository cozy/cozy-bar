<div ref:wrapper class='coz-drawer-wrapper' on:click='fire("close")'>
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
    onrender() {
      toggleDrawerObserver = this.observe('visible', visible => {
        if (!visible) {
          this.refs.wrapper.classList.toggle('visible', false)
          setTimeout(() => {
            this.refs.wrapper.setAttribute('aria-hidden', true)
          }, 530)
        } else {
          this.refs.wrapper.setAttribute('aria-hidden', false)
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
