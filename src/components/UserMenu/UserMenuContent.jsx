import React from 'react'
import cx from 'classnames'

import flag from 'cozy-flags'
import { makeDiskInfos } from 'cozy-client/dist/models/instance'
import List from 'cozy-ui/transpiled/react/List'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import PersonAddIcon from 'cozy-ui/transpiled/react/Icons/PersonAdd'
import FromUserIcon from 'cozy-ui/transpiled/react/Icons/FromUser'
import LogoutIcon from 'cozy-ui/transpiled/react/Icons/Logout'
import CloudIcon from 'cozy-ui/transpiled/react/Icons/Cloud'
import CompanyIcon from 'cozy-ui/transpiled/react/Icons/Company'
import RightIcon from 'cozy-ui/transpiled/react/Icons/Right'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Divider from 'cozy-ui/transpiled/react/Divider'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Typography from 'cozy-ui/transpiled/react/Typography'

import useI18n from 'components/useI18n'
import styles from 'styles/user-menu.styl'
import AvatarMyself from './components/AvatarMyself'

export const UserMenuContent = ({ instance, diskUsage }) => {
  const { t } = useI18n()

  const {
    data: { public_name, email }
  } = instance

  const { humanDiskQuota, humanDiskUsage } = makeDiskInfos(
    diskUsage.data.used,
    diskUsage.data.quota
  )

  return (
    <div className={cx(styles['user-menu-content'], 'u-flex u-flex-column')}>
      <div className="u-flex u-flex-column u-flex-items-center u-mt-half">
        <AvatarMyself className="u-mb-half" />
        <Typography variant="h4">{public_name}</Typography>
        <Typography variant="body2">{email}</Typography>
        {flag('cozy.b2b.enabled') && (
          <Button
            label={t('userMenu.addAccount')}
            variant="secondary"
            startIcon={<Icon icon={PersonAddIcon} />}
            className={cx(styles['user-menu-content-add-account'], 'u-mt-1')}
          />
        )}
      </div>
      <List className="u-pb-0">
        <ListItem button size="small">
          <ListItemIcon>
            <Icon icon={FromUserIcon} />
          </ListItemIcon>
          <ListItemText primary={t('userMenu.manageProfile')} />
        </ListItem>
        {flag('cozy.b2b.enabled') && (
          <ListItem button size="small">
            <ListItemIcon>
              <Icon icon={CompanyIcon} />
            </ListItemIcon>
            <ListItemText primary={t('userMenu.createBusinessAccount')} />
          </ListItem>
        )}
        <ListItem button size="small">
          <ListItemIcon>
            <Icon icon={CloudIcon} />
          </ListItemIcon>
          <ListItemText
            primary={t('userMenu.storage')}
            secondary={t(
              'userMenu.storageAvailable',
              humanDiskQuota - humanDiskUsage
            )}
          />
          <ListItemIcon>
            <Icon icon={RightIcon} />
          </ListItemIcon>
        </ListItem>

        <Divider component="li" variant="inset" />

        <ListItem button size="small">
          <ListItemIcon>
            <Icon icon={LogoutIcon} />
          </ListItemIcon>
          <ListItemText primary={t('userMenu.logOut')} />
        </ListItem>
      </List>
    </div>
  )
}

export default UserMenuContent
