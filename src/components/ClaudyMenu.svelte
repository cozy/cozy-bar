<div class='{{`coz-claudy-menu ${
  openedAction ? "coz-claudy-menu--action-selected" : ""}`}}'>
  <header class='coz-claudy-menu-header'>
    <h2 class='coz-claudy-menu-title'>{{t('claudy.title')}}</h2>
    <button class='coz-btn-close' on:click='fire("close")'/>
    <button class='coz-claudy-menu-header-back-button' on:click='goBack()'/>
  </header>
  <div class='coz-claudy-menu-content-wrapper'>
    <div class='coz-claudy-menu-content' >
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
            {{#if selectedAction.link}}
              {{#if computeUrl(selectedAction) !== ''}}
                <a
                  href='{{selectedActionUrl}}'
                  role='button'
                  target='{{selectedAction.link.type === "external" ? "_blank" : "_self"}}'
                  class='coz-btn-regular coz-claudy-menu-action-description-button'
                  on:click='trackActionLink(selectedAction)'
                >
                  {{t(`claudy.actions.${selectedAction.slug}.button`)}}
                </a>
              {{else}}
                <a
                  role='button'
                  class='coz-btn-regular coz-claudy-menu-action-description-button'
                  disabled
                  title='{{`App ${selectedAction.slug} not found`}}'
                >
                  {{t(`claudy.actions.${selectedAction.slug}.button`)}}
                </a>
              {{/if}}
            {{/if}}
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
        selectedActionUrl: '',
        getIcon (iconName) {
          return require(`../assets/icons/claudyActions/${iconName}`)
        },
        computeUrl (action) {
          const appsList = this.appsList
          if (action.link.type === 'apps' && action.link.appSlug) {
            if (!appsList) {
              console.warn('No apps found on the Cozy')
              this.selectedActionUrl = ''
              return ''
            }
            const app = appsList.find(a => a.attributes.slug === action.link.appSlug)
            if (app && app.links && app.link.related) {
              this.selectedActionUrl = app.links.related
              return app.links.related
            } else {
              console.warn(`No app with slug "${action.link.appSlug}" found on the Cozy.`)
              this.selectedActionUrl = ''
              return ''
            }
          } else {
            const url = t(`claudy.actions.${action.slug}.link`)
            this.selectedActionUrl = url
            return url
          }
        }
      }
    },
    methods: {
      goBack () {
        this.set({openedAction: false})
      },
      trackActionLink (action) {
        const usageTracker = this.get('usageTracker')
        if (usageTracker) {
          usageTracker.push([
            'trackEvent',
            'Claudy',
            'openActionLink',
            `${action.slug}`
          ])
        }
      },
      selectAction (action) {
        const usageTracker = this.get('usageTracker')
        if (usageTracker) {
          usageTracker.push([
            'trackEvent',
            'Claudy',
            'openAction',
            `${action.slug}`
          ])
        }
        this.set({selectedAction: action, openedAction: true})
      }
    },
    helpers: { t }
  }
</script>
