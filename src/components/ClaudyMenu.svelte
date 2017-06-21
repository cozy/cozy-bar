<div class='{{`coz-claudy-menu ${
  openedAction ? "coz-claudy-menu--action-selected" : ""}`}}'>
  <header class='coz-claudy-menu-header'>
    <h2 class='coz-claudy-menu-title'>{{t('claudy.title')}}</h2>
    <button class='coz-btn-close' on:click='fire("close")'/>
    <button class='coz-claudy-menu-header-back-button' on:click='goBack()'/>
  </header>
  <div class='coz-claudy-menu-content-wrapper'>
    <div class='coz-claudy-menu-content'
    >
      <div class='coz-claudy-menu-actions-list'>
        {{#each actions as action}}
          <a class='coz-claudy-menu-action' on:click='selectAction(action)'>
            <img
              class='coz-claudy-menu-action-icon'
              src='{{getIcon(action.icon)}}'
            />
            <p class='coz-claudy-menu-action-title'>
              {{t(`claudy.actions.${action.slug}.title`)}}
            </p>
          </a>
        {{/each}}
      </div>
      <div class='coz-claudy-menu-action-description'>
        {{#if selectedAction}}
          <div class='coz-claudy-menu-action-description-header'>
            <img
              class='coz-claudy-menu-action-icon'
              src='{{getIcon(selectedAction.icon)}}'
            />
            <p class='coz-claudy-menu-action-title'>
              {{t(`claudy.actions.${selectedAction.slug}.title`)}}
            </p>
          </div>
          <div class='coz-claudy-menu-action-description-content'>
            <p class='coz-claudy-menu-action-description-text'>
              {{t(`claudy.actions.${selectedAction.slug}.description`)}}
            </p>
            <a role='button' class='coz-btn-regular coz-claudy-menu-action-description-button'>
              {{t(`claudy.actions.${selectedAction.slug}.button`)}}
            </a>
          </div>
        {{/if}}
      </div>
    </div>
  </div>
</div>

<script>
  import { t } from '../lib/i18n'

  export default {
    data () {
      return {
        openedAction: false,
        selectedAction: null,
        getIcon (iconName) {
          return require(`../assets/icons/claudyActions/${iconName}`)
        }
      }
    },
    methods: {
      goBack () {
        this.set({openedAction: false})
      },
      selectAction (action) {
        this.set({selectedAction: action, openedAction: true})
      }
    },
    helpers: { t }
  }
</script>
