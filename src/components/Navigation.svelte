<nav class='coz-nav'>
  <ul>
    {{#each sections as section}}
      <NavigationSection label='{{section.label}}' icon='{{section.icon}}' items='{{section.items}}' standalone='false' />
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

<style>
  .coz-nav ul {
    margin: 0;
    padding: 0;
    height: 100%;
    list-style-type: none;
  }

  @media (max-width: 30em) {
    .coz-nav {
      display: none;
    }
  }
</style>
