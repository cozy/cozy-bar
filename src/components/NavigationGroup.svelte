{{#if separator == 'top'}}<hr />{{/if}}
<ul class='coz-nav-group'>
  {{#each group as item}}
    <NavigationItem item='{{item}}' />
  {{/each}}
</ul>
{{#if separator == 'bottom'}}<hr />{{/if}}

<script>
  import NavigationItem from './NavigationItem'

  export default {
    components: {
      NavigationItem
    }
  }
</script>
