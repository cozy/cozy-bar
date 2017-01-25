<nav class='coz-nav'>
  <ul>
    {{#each sections as section}}
      <NavigationSection label='{{section.label}}' icon='{{section.icon}}' items='{{section.items}}' standalone='false' />
    {{/each}}
  </ul>
</nav>

<script>
  import '../styles/navigation.css'

  import NavigationSection from './NavigationSection'

  export default {
    components: {
      NavigationSection
    }
  }
</script>
