import React, { Component } from 'react'
import { connect } from 'react-redux'
import Hammer from 'hammerjs'
import Spinner from 'cozy-ui/react/Spinner'

import { fetchApps, isAppListFetching, hasFetched } from '../lib/reducers'

import AppsList from './Apps/AppsList'
import SettingsContent from './Settings/SettingsContent'

class Drawer extends Component {
  constructor (props, context) {
    super(props)
    this.store = context.barStore
    this.state = {
      isScrolling: false,
      isClosing: false
    }
  }

  onDrawerClick = event => {
    if (event.target === this.wrapperRef) {
      this.close()
    }
  }

  onTransitionEnd = event => {
    if (this.props.visible) {
      if (!this.gesturesHandler) this.attachGestures()
      this.preventBackgroundScrolling()
    } else {
      this.restoreBackgroundScrolling()
      this.setState({ isClosing: false })
    }
    this.props.drawerListener()
  }

  async componentWillMount () {
    await this.props.fetchAppsList()
    await this.store.fetchSettingsData()
  }

  componentDidMount () {
    this.turnTransitionsOn()
  }

  async componentWillReceiveProps (nextProps) {
    if (!this.props.visible && nextProps.visible) {
      this.props.fetchAppsList()
      this.store.fetchSettingsData()
    }
  }

  turnTransitionsOn () {
    this.asideRef.classList.add('with-transition')
    this.asideRef.addEventListener('transitionend', this.onTransitionEnd)
  }

  turnTransitionsOff () {
    this.asideRef.classList.remove('with-transition')
    this.asideRef.removeEventListener('transitionend', this.onTransitionEnd)
  }

  preventBackgroundScrolling () {
    document.body.style.overflow = 'hidden'
  }

  restoreBackgroundScrolling () {
    document.body.style.overflow = 'auto'
  }

  detachGestures () {
    this.gesturesHandler.destroy()
    this.gesturesHandler = null
  }

  attachGestures () {
    // IMPORTANT: on Chrome, the `overflow-y: scroll` property on .coz-drawer--apps prevented
    // swipe events to be dispatched correctly ; the `touch-action: pan-y` fixes the problem
    // see drawer.css
    this.gesturesHandler = new Hammer.Manager(document.body, {
      // we listen in all directions so that we can catch panup/pandown events and let the user scroll
      recognizers: [[Hammer.Pan, { direction: Hammer.DIRECTION_ALL }]]
    })

    // to be completely accurate, `maximumGestureDelta` should be the difference between the right of the aside and the
    // left of the page; but using the width is much easier to compute and accurate enough.
    const maximumGestureDistance = this.asideRef.getBoundingClientRect().width
    // between 0 and 1, how far down the gesture must be to be considered complete upon release
    const minimumCloseDistance = 0.4
    // a gesture faster than this will dismiss the menu, regardless of distance traveled
    const minimumCloseVelocity = 0.2

    let currentGestureProgress = null

    this.gesturesHandler.on('panstart', event => {
      if (this.state.isClosing) return
      if (event.additionalEvent === 'panup' || event.additionalEvent === 'pandown') {
        this.setState({ isScrolling: true })
      } else {
        this.turnTransitionsOff()
        currentGestureProgress = 0
      }
    })

    this.gesturesHandler.on('pan', e => {
      if (this.state.isClosing || this.state.isScrolling) return
      currentGestureProgress = -e.deltaX / maximumGestureDistance
      this.applyTransformation(currentGestureProgress)
    })

    this.gesturesHandler.on('panend', e => {
      if (this.state.isClosing) return
      if (this.state.isScrolling) {
        this.setState({ isScrolling: false })
        return
      }
      // Dismiss the menu if the swipe pan was bigger than the treshold,
      // or if it was a fast, leftward gesture
      const haveTravelledFarEnough = -e.deltaX / maximumGestureDistance >= minimumCloseDistance
      const haveTravelledFastEnough = e.velocity < 0 && Math.abs(e.velocity) >= minimumCloseVelocity

      const shouldDismiss = haveTravelledFarEnough || haveTravelledFastEnough

      if (shouldDismiss) {
        this.close()
      } else {
        this.turnTransitionsOn()
        this.applyTransformation(0)
      }
    })
  }

  close () {
    if (this.state.isClosing) return
    this.detachGestures()
    this.setState(state => ({ isClosing: true }))
    this.turnTransitionsOn()
    this.props.onClose()
    this.asideRef.style.transform = ''
  }

  applyTransformation (progress) {
    // constrain between 0 and 1.1 (go a bit further than 1 to be hidden completely)
    progress = Math.min(1.1, Math.max(0, progress))
    this.asideRef.style.transform = 'translateX(-' + (progress * 100) + '%)'
  }

  render () {
    const { onClaudy, visible, isClaudyLoading, toggleSupport, onLogOut, showSpinner } = this.props
    const { settingsData } = this.store
    return (
      <div className='coz-drawer-wrapper'
        onClick={this.onDrawerClick}
        aria-hidden={visible ? 'false' : 'true'}
        ref={(node) => { this.wrapperRef = node }}
      >
        <aside ref={(node) => { this.asideRef = node }}>
          <nav className='coz-drawer--apps'>
            {showSpinner
              ? (
                <Spinner size='xlarge' middle />
              )
              : (
                <AppsList
                  wrappingLimit={3}
                />
              )
            }
          </nav>
          <hr className='coz-sep-flex' />
          <nav className='coz-drawer--settings'>
            {settingsData &&
              <SettingsContent
                onLogOut={() => {
                  if (onLogOut && typeof onLogOut === 'function') {
                    onLogOut()
                  } else {
                    this.store.logout()
                  }
                }}
                settingsData={settingsData}
                isClaudyLoading={isClaudyLoading}
                onClaudy={onClaudy}
                toggleSupport={toggleSupport}
                isDrawer
              />
            }
          </nav>
        </aside>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  showSpinner: isAppListFetching(state) && !hasFetched(state)
})

const mapDispatchToProps = dispatch => ({
  fetchAppsList: () => dispatch(fetchApps())
})

export default connect(mapStateToProps, mapDispatchToProps)(Drawer)
