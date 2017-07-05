import React, { Component } from 'react'

import { translate } from 'cozy-ui/react/I18n'

class Nav extends Component {
  constructor (props, context) {
    super(props)
    this.store = context.store
    this.state = {
      apps: {
        busy: false,
        opened: false
      },
      settings: {
        busy: false,
        opened: false
      }
    }
  }
  render () {
    const { t } = this.props
    const { apps, settings } = this.state
    return (
      <nav class='coz-nav'>
        <ul>
          <li class='coz-nav-section'>
            <a
              aria-controls='coz-nav-pop--apps' aria-busy={apps.busy}
              data-icon='icon-cube'
            >
              {t('menu.apps')}
            </a>
          </li>
          <li class='coz-nav-section'>
            <a
              aria-controls='coz-nav-pop--settings' aria-busy={settings.busy}
              data-icon='icon-cog'
            >
              {t('menu.settings')}
            </a>
          </li>
        </ul>
      </nav>
    )
  }
}

export default translate()(Nav)
