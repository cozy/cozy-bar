{{#if group.length}}
{{#if separator == 'top'}}<hr />{{/if}}
<ul class='{{`${(wrapping ? "coz-nav-group coz-nav-group--wrapping" : "coz-nav-group")}`}}'>
  {{#each group as item}}
    <NavigationItem item='{{item}}' />
  {{/each}}
</ul>
{{#if separator == 'bottom'}}<hr />{{/if}}
{{/if}}

<script>
  import NavigationItem from './NavigationItem'

  export default {
    components: {
      NavigationItem
    },
    computed: {
      wrapping: (itemsLimit, group) => {
        if (!itemsLimit || !group.length) return false
        return group.length > itemsLimit
      }
    }
  }
</script>
