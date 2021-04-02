import React, { PureComponent } from 'react'

import AppIcon from 'cozy-ui/transpiled/react/AppIcon'

import stack from 'lib/stack'

/* Generated with node_modules/.bin/svgr src/assets/sprites/icon-cozy-home.svg  */
function SvgIconCozyHome(props) {
  return (
    <svg width={32} height={32} {...props}>
      <g fill="none" fillRule="evenodd">
        <circle fill="#297EF2" fillRule="nonzero" cx={16} cy={16} r={16} />
        <path
          d="M19.314 17.561a.555.555 0 01-.82.12 4.044 4.044 0 01-2.499.862 4.04 4.04 0 01-2.494-.86.557.557 0 01-.815-.12.547.547 0 01.156-.748c.214-.14.229-.421.229-.424a.555.555 0 01.176-.385.504.504 0 01.386-.145.544.544 0 01.528.553c0 .004 0 .153-.054.36a2.954 2.954 0 003.784-.008 1.765 1.765 0 01-.053-.344.546.546 0 01.536-.561h.01c.294 0 .538.237.545.532 0 0 .015.282.227.422a.544.544 0 01.158.746m2.322-6.369a5.94 5.94 0 00-1.69-3.506A5.651 5.651 0 0015.916 6a5.648 5.648 0 00-4.029 1.687 5.936 5.936 0 00-1.691 3.524 5.677 5.677 0 00-3.433 1.737 5.966 5.966 0 00-1.643 4.137C5.12 20.347 7.704 23 10.882 23h10.236c3.176 0 5.762-2.653 5.762-5.915 0-3.083-2.31-5.623-5.244-5.893"
          fill="#FFF"
        />
      </g>
    </svg>
  )
}

class IconCozyHome extends PureComponent {
  render() {
    const { className } = this.props
    const fetchIcon = () =>
      `${stack.get.cozyURL()}/assets/images/icon-cozy-home.svg`

    return (
      <AppIcon
        fetchIcon={fetchIcon}
        fallbackIcon={SvgIconCozyHome}
        className={className}
      />
    )
  }
}

export default IconCozyHome
