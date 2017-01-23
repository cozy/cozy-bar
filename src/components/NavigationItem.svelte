<li class='coz-nav-item'>
  {{#if item.external}}
    <a href='{{item.href}}' target='_blank'>
      <svg class='coz-nav-icon' viewBox='0 0 16 16'><use xlink:href='{{icon}}'/></svg>
      {{ item.label }}
    </a>
  {{else}}
    <a href='{{item.href}}'>
      <svg class='coz-nav-icon' viewBox='0 0 16 16'><use xlink:href='{{icon}}'/></svg>
      {{ item.label }}
    </a>
  {{/if}}
</li>

<script>
  export default {
    computed: {
      icon: item => require(`../assets/icons/icon-${item.label}.svg`)
    }
  }
</script>

<style>
  .coz-nav-item a {
    display: flex;
    padding: .5em 1.5em;
    align-items: center;
    white-space: nowrap;
    color: var(--charcoal-grey);
    text-decoration: none;
    text-transform: capitalize;
  }
</style>
