{{#if separator == 'top'}}<hr />{{/if}}
{{#if group.length}}
<ul class='{{`coz-nav-group${wrappingClass}`}}'>
  {{#each group as item}}
    <NavigationItem item='{{item}}' />
  {{/each}}
</ul>
{{/if}}
{{#if separator == 'bottom'}}<hr />{{/if}}

<script>
  import NavigationItem from './NavigationItem'

  export default {
    components: {
      NavigationItem
    },
    computed: {
      wrappingClass: (itemsLimit, group) => {
        if (!itemsLimit || !group.length) return ''
        return group.length > itemsLimit ? ' --wrapping' : ''
      }
    }
  }
</script>
