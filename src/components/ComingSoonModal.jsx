import React, { Component } from 'react'
import Modal, { ModalContent } from 'cozy-ui/react/Modal'
import { translate } from 'cozy-ui/react/I18n'

class ComingSoonModal extends Component {
  render () {
    const { appSlug, t } = this.props
    const appIcon = require(`../assets/icons/comingSoon/icon-${appSlug}.svg`)
    return (
      <div>
        <Modal
          dismissAction={this.props.onClose}
          className='coz-coming-soon-modal'
        >
          <ModalContent>
            <div className='coz-coming-soon-modal-content'>
              <img src={appIcon} />
              <h2>{t(`comingSoon.${appSlug}.title`)}</h2>
              <p>{t(`comingSoon.${appSlug}.description`)}</p>
            </div>
          </ModalContent>
        </Modal>
      </div>
    )
  }
}

export default translate()(ComingSoonModal)
