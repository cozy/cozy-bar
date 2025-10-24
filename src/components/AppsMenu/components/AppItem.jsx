import React from 'react'

import { getAppDisplayName } from 'cozy-client/dist/models/applications'
import { makeStyles } from 'cozy-ui/transpiled/react/styles'
import Buttons from 'cozy-ui/transpiled/react/Buttons'
import AppIcon from 'cozy-ui/transpiled/react/AppIcon'
import AppLinker from 'cozy-ui/transpiled/react/AppLinker'
import Typography from 'cozy-ui/transpiled/react/Typography'
import cx from 'classnames'

import { appShape } from 'proptypes/index'
import stack from 'lib/stack'

import styles from 'styles/apps-menu.styl'

const useStyles = makeStyles(() => {
  return {
    text: {
      lineHeight: '22.5px',
      fontSize: '12px',
      fontWeight: 400
    }
  }
})

export const AppItem = ({ app, onAppSwitch }) => {
  const appName = getAppDisplayName(app)

  const classes = useStyles()

  return (
    <AppLinker href={app.href || ''} app={app} onAppSwitch={onAppSwitch}>
      {({ onClick, href }) => {
        return (
          <Buttons
            height="auto"
            component="a"
            target="_blank"
            variant="text"
            href={href}
            title={appName}
            onClick={onClick}
            className={cx(styles['apps-menu-grid-item-wrapper'], 'u-bdrs-5')}
            label={
              <div className={styles['apps-menu-grid-item']}>
                <div className={styles['apps-menu-grid-item-icon']}>
                  <AppIcon
                    app={app}
                    key={app.slug}
                    {...stack.get.iconProps()}
                  />
                </div>
                <Typography
                  noWrap
                  align="center"
                  className={`u-w-100 ${classes.text}`}
                >
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
