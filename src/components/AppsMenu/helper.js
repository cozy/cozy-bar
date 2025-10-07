export const buildEntrypoints = apps => {
  return apps.flatMap(app => {
    if (!app.entrypoints) return []

    return app.entrypoints.map(entrypoint => ({
      ...entrypoint,
      slug: app.slug
    }))
  })
}
