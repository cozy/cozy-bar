import React from 'react'

import { getAppDisplayName } from 'cozy-client/dist/models/applications'
import Buttons from 'cozy-ui/transpiled/react/Buttons'
import AppIcon from 'cozy-ui/transpiled/react/AppIcon'
import AppLinker from 'cozy-ui/transpiled/react/AppLinker'
import Typography from 'cozy-ui/transpiled/react/Typography'
import cx from 'classnames'

import { appShape } from 'proptypes/index'
import stack from 'lib/stack'

import styles from 'styles/apps-menu.styl'

export const AppItem = ({ app }) => {
  const appName = getAppDisplayName(app)

  return (
    <AppLinker href={app.href || ''} app={app}>
      {({ onClick, href }) => {
        return (
          <Buttons
            height="auto"
            component="a"
            variant="text"
            href={href}
            title={appName}
            onClick={onClick}
            className={cx(styles['apps-menu-grid-item-wrapper'], 'u-bdrs-5')}
            label={
              <div className={styles['apps-menu-grid-item']}>
                <AppIcon app={app} key={app.slug} {...stack.get.iconProps()} />
                <Typography variant="caption" noWrap className="u-mt-half">
                  {appName}
                </Typography>
              </div>
            }
          />
        )
      }}
    </AppLinker>
  )
}

AppItem.propTypes = {
  app: appShape.isRequired
}

export default AppItem
