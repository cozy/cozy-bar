/*
  The bar needs some icons for cozy-ui
  To be independant we import icons needed in the cozy-bar
  to not rely on the sprite imported by the application
 */

const importIcons = function() {
  // add needed cozy-ui icon names here
  const names = ['bottom', 'cross', 'top']
  names.map(n => {
    require('cozy-ui/assets/icons/ui/' + n + '.svg')
  })
}

importIcons()
