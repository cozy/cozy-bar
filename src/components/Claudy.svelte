<div class='{{`coz-claudy coz-bar-hide-sm ${opened ? "coz-claudy--opened" : ""}`}}'>
  <button class='coz-claudy-icon' data-claudy-opened='{{opened}}' on:click='toggleClaudy()'/>
  <ClaudyMenu actions='{{config.actions}}' on:close='toggleClaudy()' usageTracker='{{usageTracker}}' appsList={{appsList}} />
</div>

<script>
  /* global __PIWIK_TRACKER_URL__  __PIWIK_SITEID__ __PIWIK_DIMENSION_ID_APP__*/
  import { t } from '../lib/i18n'

  import ClaudyMenu from './ClaudyMenu'
  import { shouldEnableTracking, getTracker, configureTracker } from '../lib/piwik'

  export default {
    data () {
      return {
        opened: false,
        usageTracker: null
      }
    },

    oncreate () {
      // if tracking enabled, init the tracker
      if (shouldEnableTracking()) {
        const trackerInstance = getTracker(__PIWIK_TRACKER_URL__, __PIWIK_SITEID__, false, false)
        configureTracker({
          appDimensionId: __PIWIK_DIMENSION_ID_APP__,
          app: 'Cozy Bar',
          heartbeat: 0
        })
        trackerInstance.push(['disableHeartBeatTimer']) // undocumented, see https://github.com/piwik/piwik/blob/3.x-dev/js/piwik.js#L6544
        this.set({usageTracker: trackerInstance})
      }
    },

    methods: {
      toggleClaudy () {
        const opened = this.get('opened')
        const usageTracker = this.get('usageTracker')
        if (usageTracker) {
          usageTracker.push([
            'trackEvent',
            'Claudy',
            opened ? 'close' : 'open',
            'claudy'
          ])
        }
        this.set({ opened: !opened })
      }
    },

    helpers: { t },

    components: {
      ClaudyMenu
    }
  }
</script>
