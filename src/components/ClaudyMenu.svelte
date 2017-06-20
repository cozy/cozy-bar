<div class='coz-claudy-menu'>
  <header class='coz-claudy-menu-header'>
    <h2 class='coz-claudy-menu-title'>{{t('claudy.title')}}</h2>
    <button class='coz-btn-close' on:click='fire("close")'/>
  </header>
  <div class='coz-claudy-menu-content'>
    <div class='coz-claudy-menu-actions-list'>
      {{#each actions as action}}
        <a class='coz-claudy-menu-action'>
          <img
            class='coz-claudy-menu-action-icon'
            src='{{getIcon(action.icon)}}'
          />
          <p class='coz-claudy-menu-action-title'>
            {{t(`claudy.actions.${action.slug}.title`)}}
          <p>
        </a>
      {{/each}}
    </div>
  </div>
</div>

<script>
  import { t } from '../lib/i18n'

  export default {
    data () {
      return {
        openedAction: false,
        getIcon (iconName) {
          return require(`../assets/icons/claudyActions/${iconName}`)
        }
      }
    },
    helpers: { t }
  }
</script>
