<li>
  <span>{{ name }}</span>
  <div>
    {{#each items as group}}
    <ul>
      {{#each group as item}}
        <NavigationItem item='{{item}}' />
      {{/each}}
    </ul>
    <hr />
    {{/each}}
  </div>
</li>

<script>
  import NavigationItem from './NavigationItem'

  export default {
    components: {
      NavigationItem
    }
  }
</script>
