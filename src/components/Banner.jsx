import React, { Component } from 'react'
import { ButtonLink } from 'cozy-ui/react/Button'
import { translate } from 'cozy-ui/react/I18n'

class Banner extends Component {
  constructor (props) {
    super(props)
    this.state = { unmounted: true }
  }

  componentDidMount () {
    this.setState(() => ({ unmounted: false }))
  }

  render () {
    const { t, code, links } = this.props
    const { unmounted } = this.state
    return (
      <div className={`coz-bar-banner${unmounted ? ' unmounted' : ''}`}>
        <p>{t(`banner.${code}.description`)}</p>
        <ButtonLink
          className='coz-bar-banner-button'
          size='tiny'
          href={links}
        >
          {t(`banner.${code}.CTA`)}
        </ButtonLink>
      </div>
    )
  }
}

export default translate()(Banner)
