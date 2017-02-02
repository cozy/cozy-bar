<nav class='coz-nav'>
  <ul>
    {{#each sections as section}}
      <NavigationSection on:open='fire("open", {panel: event.panel})' label='{{section.label}}' icon='{{section.icon}}' items='{{section.items}}' standalone='false' />
    {{/each}}
  </ul>
</nav>

<script>
  import NavigationSection from './NavigationSection'

  export default {
    components: {
      NavigationSection
    }
  }
</script>
