import React, { Component } from 'react'
import Modal, { ModalContent } from 'cozy-ui/react/Modal'
import Spinner from 'cozy-ui/react/Spinner'
import { getIntents } from 'lib/stack'

class SupportModal extends Component {
  constructor(props, context) {
    super(props)
    this.store = context.barStore
    this.state = {
      isLoading: false
    }
    this.intents = getIntents()
  }

  toggle = () => {
    this.setState({ isLoading: true })
    // init support intent
    this.intents
      .create('SUPPORT', 'io.cozy.settings')
      .start(this.intentWrapperRef, () => {
        this.setState({ isLoading: false })
      })
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
          closeBtnClassName="coz-support-modal-close"
        >
          <ModalContent className="coz-support-modal-wrapper u-mt-1">
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
