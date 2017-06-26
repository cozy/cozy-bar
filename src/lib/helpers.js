import { t } from '../lib/i18n'

// Take an items array and return an array of category objects with the matching title and items
export function getCategorizedItems (items) {
  if (items[0] instanceof Array) return null // doesn't handle this case
  const categorizedItemsObject = items.reduce((accumulator, item) => {
    accumulator[item.category] = accumulator[item.category] || []
    accumulator[item.category].push(item)
    return accumulator
  }, {})

  return Object.keys(categorizedItemsObject)
    .map(category => {
      return {title: category, items: categorizedItemsObject[category]}
    })
    // categories alphabetical sorting
    .sort((c1, c2) => {
      if (c1.title === 'others') return 1
      if (t(`Categories.${c1.title}`) > t(`Categories.${c2.title}`)) return 1
      if (t(`Categories.${c1.title}`) < t(`Categories.${c2.title}`)) return -1
      return 0
    })
}
