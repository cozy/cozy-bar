import React, { Component } from 'react'
import { connect } from 'react-redux'

import { getHomeApp } from 'lib/reducers'

import Icon from 'cozy-ui/react/Icon'
import { translate } from 'cozy-ui/react/I18n'
import homeIcon from 'assets/icons/icon-cozy-home.svg'

class AppNavButton extends Component {
  render () {
    const { homeApp, busy, onClick, appName, appNamePrefix, iconPath, opened, t } = this.props

    const isHomeApp = homeApp && homeApp.isCurrentApp

    return (
      <div className={`coz-nav-apps-btns${isHomeApp ? ' --currentHome' : ''}`}>
        <a href={homeApp && homeApp.href} className='coz-nav-apps-btns-home'>
          <img src={homeIcon} />
        </a>
        {!isHomeApp && <span className='coz-nav-apps-btns-sep' />}
        <button
          type='button'
          onClick={onClick}
          className='coz-nav-apps-btns-main'
          aria-controls='coz-nav-pop--apps' aria-busy={busy}
          data-tutorial='apps'
        >
          {!isHomeApp && <img className='coz-bar-hide-sm' src={iconPath} width='28' alt='' />}
          <span className='coz-nav-app-name'>
            {isHomeApp
              ? t('menu.home_title')
              : appNamePrefix ? `${appNamePrefix} ${appName}` : appName
            }
          </span>
          {<Icon icon={opened ? 'top' : 'bottom'} color='#95999d' size='12' />}
        </button>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  homeApp: getHomeApp(state)
})

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(translate()(AppNavButton))
