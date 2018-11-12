import React, { Component } from 'react'
import { ButtonLink } from 'cozy-ui/react/Button'
import { translate } from 'cozy-ui/react/I18n'

class Banner extends Component {
  constructor(props) {
    super(props)
    this.state = { unmounted: true }
    this.animate = this.animate.bind(this)
  }

  animate() {
    // To animate we have to use a setTimeout to
    // force a CSS class update and trigger CSS animation
    return setTimeout(() => {
      this.setState(() => ({ unmounted: false }))
    }, 100)
  }

  componentDidMount() {
    this.animate()
  }

  render() {
    const { t, code, links } = this.props
    const { unmounted } = this.state
    return (
      <div className={`coz-bar-banner${unmounted ? ' unmounted' : ''}`}>
        <p>{t(`banner.${code}.description`)}</p>
        <ButtonLink
          className="coz-bar-banner-button"
          size="tiny"
          href={links}
          label={t(`banner.${code}.CTA`)}
        />
      </div>
    )
  }
}

export default translate()(Banner)
