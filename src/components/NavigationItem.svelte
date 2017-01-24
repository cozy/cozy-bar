<li class='coz-nav-item'>
  {{#if item.external}}
    <a href='{{item.href}}' target='_blank' data-icon='{{icon}}'>
      {{ item.label }}
    </a>
  {{else}}
    <a href='{{item.href}}' data-icon='{{icon}}'>
      {{ item.label }}
    </a>
  {{/if}}
</li>

<script>
  export default {
    computed: {
      icon: item => `icon-${item.label}`
    }
  }
</script>

<style>
  .coz-nav-item a {
    display: flex;
    padding: .5em 1.5em .5em calc(1.5em + 16px + .5em);
    background-position: 1.5em 50%;
    align-items: center;
    white-space: nowrap;
    color: var(--charcoal-grey);
    text-decoration: none;
    text-transform: capitalize;
  }
</style>
