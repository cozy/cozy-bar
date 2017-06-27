import { t } from '../lib/i18n'

// Take an items array and return an array of category objects with the matching category slug and items
export function getCategorizedItems (items) {
  if (items[0] instanceof Array) return null // doesn't handle this case
  const categorizedItemsObject = items.reduce((accumulator, item) => {
    accumulator[item.category] = accumulator[item.category] || []
    accumulator[item.category].push(item)
    return accumulator
  }, {})

  return Object.keys(categorizedItemsObject)
    .map(category => {
      return {slug: category, items: categorizedItemsObject[category]}
    })
    // categories alphabetical sorting
    .sort((c1, c2) => {
      if (c1.slug === 'others') return 1
      if (c2.slug === 'others') return -1
      if (t(`Categories.${c1.slug}`) > t(`Categories.${c2.slug}`)) return 1
      if (t(`Categories.${c1.slug}`) < t(`Categories.${c2.slug}`)) return -1
      return 0
    })
}
