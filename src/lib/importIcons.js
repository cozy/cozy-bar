/*
  The bar needs some icons for cozy-ui
  To be independant we import icons needed in the cozy-bar
  to not rely on the sprite imported by the application
 */

const importIcons = function() {
  // add needed cozy-ui icon names here
  require('cozy-ui/assets/icons/ui/bottom.svg')
  require('cozy-ui/assets/icons/ui/cross.svg')
  require('cozy-ui/assets/icons/ui/top.svg')
}

importIcons()
