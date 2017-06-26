{{#if group.length}}
{{#if separator == 'top'}}<hr />{{/if}}
<ul class='{{`
    ${wrapping ? "coz-nav-group coz-nav-group--wrapping" : "coz-nav-group"}
    ${inactive ? " coz-nav-group--inactive" : ""}
`}}'>
  {{#each group as item}}
    {{#if item.event === 'claudy'}}
      <NavigationItem item='{{item}}' on:claudy='fire("claudy")'/>
    {{else}}
      <NavigationItem item='{{item}}'/>
    {{/if}}
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
      },
      inactive: (group) => {
        return (group.filter((item) => item.inactive).length > 0)
      }
    }
  }
</script>
