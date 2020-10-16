export const locations = ['left', 'center', 'right', 'search']

const upperFirstLetter = val => {
  return val[0].toUpperCase() + val.slice(1)
}

export const getJsApiName = location => {
  return `setBar${upperFirstLetter(location)}`
}

export const getReactApiName = location => {
  return `Bar${upperFirstLetter(location)}`
}
