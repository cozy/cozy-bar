<li>
  {{#if item.external}}
    <a href='{{item.href}}' target='_blank'>{{ item.label }}</li>
  {{else}}
    <a href='{{item.href}}'>{{ item.label }}</li>
  {{/if}}
</li>
