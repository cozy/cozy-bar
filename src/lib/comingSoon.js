function addComingSoonApps (stackApps) {
  const comingSoonAppsList = [
    {
      'editor': 'Cozy',
      'name': 'Bank',
      'slug': 'bank',
      'category': 'cozy'
    },
    {
      'editor': 'Cozy',
      'name': 'Health',
      'slug': 'health',
      'category': 'cozy'
    }
  ]

  const comingSoonApps = comingSoonAppsList
    // drop coming soon apps already installed
    .filter((a) => !stackApps.filter(st => st.slug === a.slug).length)
    // consolidate
    .map(a => {
      a.comingSoon = true
      a.l10n = false
      a.icon = {
        cached: true,
        src: require(`../assets/icons/comingSoon/icon-${a.slug}.svg`)
      }
      return a
    })

  // merge to installed apps
  return stackApps.concat(comingSoonApps)
}

export default addComingSoonApps
