import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import Typography from 'cozy-ui/transpiled/react/Typography'

import AppItem from 'components/AppsMenu/components/AppItem'
import AppItemPlaceholder from 'components/AppsMenu/components/AppItemPlaceholder'
import useI18n from 'components/useI18n'
import { getApps, getHomeApp, isFetchingApps } from 'lib/reducers'
import styles from 'styles/apps-menu.styl'

const sorter = fn => (itemA, itemB) => fn(itemA) > fn(itemB)

export const AppsMenuContent = ({ isFetchingApps, apps, homeApp }) => {
  const { t } = useI18n()
  const translateAppWithLocales = translateApp(t)

  if (!isFetchingApps && (!apps || !apps.length)) {
    return (
      <Typography className="u-mh-half" color="error">
        {t('no_apps')}
      </Typography>
    )
  }

  if (isFetchingApps) {
    return (
      <div className={styles['apps-menu-grid']}>
        <AppItemPlaceholder key="1" />
        <AppItemPlaceholder key="2" />
        <AppItemPlaceholder key="3" />
      </div>
    )
  }

  const homeSlug = homeApp && homeApp.slug

  const displayedApps = apps
    .filter(app => app.slug !== homeSlug)
    .sort(sorter(translateAppWithLocales))

  return (
    <div className={styles['apps-menu-grid']}>
      {displayedApps.map((app, index) => (
        <AppItem key={index} app={app} />
      ))}
    </div>
  )
}

AppsMenuContent.propTypes = {
  apps: PropTypes.array,
  isFetchingApps: PropTypes.bool.isRequired,
  homeApp: PropTypes.shape({
    isCurrentApp: PropTypes.bool,
    slug: PropTypes.string,
    href: PropTypes.string
  }),
  className: PropTypes.string
}

const translateApp = t => app => {
  const namePrefix = app.namePrefix
    ? t(`${app.slug}.namePrefix`, { _: app.namePrefix })
    : null
  const name = t(`${app.slug}.name`, { _: app.name })
  return namePrefix ? `${namePrefix} ${name}` : `${name}`
}

const mapStateToProps = state => ({
  isFetchingApps: isFetchingApps(state),
  apps: getApps(state),
  homeApp: getHomeApp(state)
})

export default connect(mapStateToProps)(AppsMenuContent)
