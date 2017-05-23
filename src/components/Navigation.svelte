<nav class='coz-nav'>
  <ul>
    {{#each sections as section}}
      <NavigationSection on:open='fire("open", {panel: event.panel})' slug='{{section.slug}}' icon='{{section.icon}}' items='{{section.items}}' async='{{section.async}}' categorized='{{section.categorized}}' standalone='false' />
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
