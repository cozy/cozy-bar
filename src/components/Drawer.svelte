<div ref:wrapper class='coz-drawer-wrapper' on:click='fire("close")'>
  <aside ref:aside on:click='event.stopPropagation()'>
    <nav class='coz-drawer--apps'>
      <h1>{{t('drawer apps')}}</h1>
      <NavigationGroup group='{{content}}' itemsLimit={{3}} separator='bottom' />
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
    oncreate() {
      const SWIPE_CLASS = 'swipe-active'

      /**
       * We manage the [aria-hidden] attribute manually, as it serves for CSS
       * transitions, and needs to be wrapped in next frames ticks to ensure
       * smooth movements.
       */
      this.refs.wrapper.setAttribute('aria-hidden', !this.get('visible'))

      /**
       * Animation engine, based on CSS transitions
       *
       * This is how it works :
       * 1. it first adds the `SWIPE_CLASS` class on wrapper
       * 2. it register a `transitionend` listener that:
       *    - remove the SWIPE_CLASS on frame after transition's last one
       *    - unregister the listener to prevent memory leaks
       * 3. on next frame after adding SWIPE_CLASS, it starts animation by
       *    setting aria-hidden attribute
       *
       * So animation lifecycle is:
       * | Frame id          | Action                                          |
       * | :---------------- | ----------------------------------------------- |
       * | 1                 | Add SWIPE_CLASS                                 |
       * | 2                 | Set aria-hidden attribute                       |
       * | transitionEnd + 1 | Remove SWIPE_CLASS                              |
       */
      const animateTo = target => {
        if (this.refs.wrapper.getAttribute('aria-hidden') === target.toString()) {
          return
        }

        const startState = () => {
          this.refs.wrapper.setAttribute('aria-hidden', target)
        }
        const endState = () => {
          setTimeout(() => { this.refs.wrapper.classList.remove(SWIPE_CLASS)}, 10)
          this.refs.aside.removeEventListener('transitionend', endState)
        }

        this.refs.wrapper.classList.add(SWIPE_CLASS)
        this.refs.aside.addEventListener('transitionend', endState)
        setTimeout(startState, 10)
      }

      toggleDrawerObserver = this.observe('visible', visible => { animateTo(!visible) })
    },

    ondestroy() {
      toggleDrawerObserver.cancel()
    },

    components: {
      NavigationGroup
    },

    helpers: { t }
  }
</script>
