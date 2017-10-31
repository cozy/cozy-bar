import React, { Component } from 'react'
import Modal, { ModalContent } from 'cozy-ui/react/Modal'
import Spinner from 'cozy-ui/react/Spinner'

class SupportModal extends Component {
  constructor (props, context) {
    super(props)
    this.store = context.barStore
    this.state = {
      isLoading: false
    }

    this.toggle = this.toggle.bind(this)
  }

  toggle () {
    this.setState({isLoading: true})
    this.store.getSupportIntent()
    .start(this.intentWrapperRef, () => {
      this.setState({isLoading: false})
    })
  }

  componentDidMount () {
    this.toggle()
  }

  render () {
    const { isLoading } = this.state
    return (
      <div>
        <Modal secondaryAction={this.props.onClose}>
          <ModalContent>
            <div className='coz-support-modal-content'>
              {isLoading &&
                <Spinner
                  size='xxlarge'
                  middle='true'
                />
              }
              <div
                className={`coz-support-intent-wrapper${isLoading ? ' coz-hidden' : ''}`}
                ref={(wrapper) => { this.intentWrapperRef = wrapper }}
                />
            </div>
          </ModalContent>
        </Modal>
      </div>
    )
  }
}

export default SupportModal
