import React, { Component } from 'react'
import Modal, { ModalContent } from 'cozy-ui/transpiled/react/Modal'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import { create as createIntent } from 'lib/intents'

class SupportModal extends Component {
  constructor(props, context) {
    super(props)
    this.store = context.barStore
    this.state = {
      isLoading: false
    }
  }

  toggle = () => {
    this.setState({ isLoading: true })
    // init support intent
    createIntent(null, 'SUPPORT', 'io.cozy.settings', null).start(
      this.intentWrapperRef,
      () => {
        this.setState({ isLoading: false })
      }
    )
  }

  componentDidMount() {
    this.toggle()
  }

  render() {
    const { isLoading } = this.state
    return (
      <div>
        <Modal
          secondaryAction={this.props.onClose}
          className="coz-support-modal"
          into="#cozy-bar-modal-dom-place"
        >
          <ModalContent className="coz-support-modal-wrapper">
            <div className="coz-support-modal-content">
              {isLoading && <Spinner size="xxlarge" middle />}
              <div
                className={`coz-support-intent-wrapper${
                  isLoading ? ' coz-hidden' : ''
                }`}
                ref={wrapper => {
                  this.intentWrapperRef = wrapper
                }}
              />
            </div>
          </ModalContent>
        </Modal>
      </div>
    )
  }
}

export default SupportModal
