import React, { Component } from 'react'
import { translate } from '../lib/I18n'

class ClaudyMenu extends Component {
  constructor (props) {
    super(props)
    this.state = {
      openedAction: false,
      selectedAction: null
    }

    this.computeSelectedActionUrl = this.computeSelectedActionUrl.bind(this)
    this.goBack = this.goBack.bind(this)
    this.selectAction = this.selectAction.bind(this)
    this.trackActionLink = this.trackActionLink.bind(this)
    this.getIcon = this.getIcon.bind(this)
  }

  getIcon (iconName) {
    return require(`../assets/icons/claudyActions/${iconName}`)
  }

  computeSelectedActionUrl () {
    if (!this.state.selectedAction) return null
    const action = this.state.selectedAction
    const { t, appsList } = this.props
    if (action.link.type === 'apps' && action.link.appSlug) {
      if (!appsList) {
        console.warn('No apps found on the Cozy')
        return null
      }
      const app = appsList.find(a => a.slug === action.link.appSlug)
      if (app && app.href) {
        const appUrl = `${app.href}${action.link.path || ''}`
        return appUrl
      } else {
        console.warn(`No app with slug '${action.link.appSlug}' found on the Cozy.`)
        return null
      }
    } else {
      const url = t(`claudy.actions.${action.slug}.link`)
      return url
    }
  }

  goBack () {
    this.setState({ openedAction: false })
  }

  trackActionLink (action) {
    const usageTracker = this.props.usageTracker
    if (usageTracker) {
      usageTracker.push([
        'trackEvent',
        'Claudy',
        'openActionLink',
        `${action.slug}`
      ])
    }
  }

  selectAction (action) {
    const usageTracker = this.props.usageTracker
    if (usageTracker) {
      usageTracker.push([
        'trackEvent',
        'Claudy',
        'openAction',
        `${action.slug}`
      ])
    }
    this.setState({selectedAction: action, openedAction: true})
  }

  render () {
    const { t, onClose, actions } = this.props
    const { openedAction, selectedAction } = this.state
    const selectedActionUrl = (selectedAction && this.computeSelectedActionUrl()) || null
    return (
      <div className={`coz-claudy-menu ${
        openedAction ? 'coz-claudy-menu--action-selected' : ''}`}>
        <header className='coz-claudy-menu-header'>
          <h2 className='coz-claudy-menu-title'>{t('claudy.title')}</h2>
          <button className='coz-btn-close' onClick={onClose} />
          <button className='coz-claudy-menu-header-back-button' onClick={this.goBack} />
        </header>
        <div className='coz-claudy-menu-content-wrapper'>
          <div className='coz-claudy-menu-content' >
            <div className='coz-claudy-menu-actions-list'>
              {actions.map(action => (
                <a className='coz-claudy-menu-action' onClick={() => this.selectAction(action)}>
                  <img
                    className='coz-claudy-menu-action-icon'
                    src={this.getIcon(action.icon)}
                  />
                  <p className='coz-claudy-menu-action-title'>
                    {t(`claudy.actions.${action.slug}.title`)}
                  </p>
                </a>
              ))}
            </div>
            {selectedAction &&
              <div className='coz-claudy-menu-action-description'>
                <div className='coz-claudy-menu-action-description-header'>
                  <img
                    className='coz-claudy-menu-action-icon'
                    src={this.getIcon(selectedAction.icon)}
                  />
                  <p className='coz-claudy-menu-action-title'>
                    {t(`claudy.actions.${selectedAction.slug}.title`)}
                  </p>
                </div>
                <div className='coz-claudy-menu-action-description-content'>
                  <p className='coz-claudy-menu-action-description-text'>
                    {t(`claudy.actions.${selectedAction.slug}.description`)}
                  </p>
                  {selectedActionUrl
                      ? <a
                        href={selectedActionUrl}
                        role='button'
                        target={selectedAction.link.type === 'external' ? '_blank' : '_self'}
                        className='coz-btn-regular coz-claudy-menu-action-description-button'
                        onClick={() => this.trackActionLink(selectedAction)}
                      >
                        {t(`claudy.actions.${selectedAction.slug}.button`)}
                      </a>
                    : <a
                      role='button'
                      className='coz-btn-regular coz-claudy-menu-action-description-button'
                      disabled
                      title={`App ${selectedAction.slug} not found`}
                    >
                      {t(`claudy.actions.${selectedAction.slug}.button`)}
                    </a>
                  }
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    )
  }
}

export default translate()(ClaudyMenu)
