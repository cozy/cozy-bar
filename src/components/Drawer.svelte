<div ref:wrapper class='coz-drawer-wrapper' on:click='set({folded: true})'>
  <aside on:click='event.stopPropagation()'>
    <hr class='coz-sep-flex' />
    <nav>
      {{#each groups as group}}
      <NavigationGroup group='{{group}}' separator='top' />
      {{/each}}
    </nav>
  </aside>
</div>

<script>
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
    }
  }
</script>

<style>
  .coz-drawer-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
  }

  .coz-drawer-wrapper[aria-hidden=true] {
    display: none;
  }

  @media (min-width: 30.0625em) {
    .coz-drawer-wrapper {
      display: none;
    }
  }

  .coz-drawer-wrapper::before {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--charcoal-grey);
    opacity: 0;
    transition: opacity 250ms ease-out;
  }

  .coz-drawer-wrapper.visible::before {
    opacity: .5;
  }

  .coz-drawer-wrapper aside {
    transform: translateX(-100vw);
    transition: transform 500ms ease-out;
  }

  .coz-drawer-wrapper.visible aside {
    transform: translateX(0);
  }

  .coz-drawer-wrapper aside {
    position: absolute;
    top: 0;
    left: 0;
    width: 90%;
    height: 100%;
    background-color: #fff;
  }

  .coz-drawer-wrapper aside {
    display: flex;
    flex-direction: column;
  }

  .coz-drawer-wrapper ul {
    margin: 0;
    padding: 0;
    list-style-type: none;
  }

  .coz-drawer-wrapper ul {
    margin: 0;
    padding: .8em 0;
    list-style-type: none;
  }

  .coz-drawer-wrapper hr {
    margin: 0;
    border: none;
    border-bottom: solid 1px var(--silver);
  }

  .coz-drawer-wrapper .coz-nav-icon {
    margin-right: .5em;
  }
</style>
