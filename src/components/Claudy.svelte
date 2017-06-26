<div class='{{`coz-claudy ${opened ? "coz-claudy--opened" : ""}`}}'>
  <button class='coz-claudy-icon coz-bar-hide-sm' data-claudy-opened='{{opened}}' on:click='fire("toggle")'/>
  <ClaudyMenu actions='{{config.actions}}' on:close='fire("toggle")' usageTracker='{{usageTracker}}' appsList={{appsList}} />
</div>

<script>
  import ClaudyMenu from './ClaudyMenu'

  export default {
    components: {
      ClaudyMenu
    }
  }
</script>
