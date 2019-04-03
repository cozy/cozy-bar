import { isAndroidApp } from 'cozy-device-helper'

export const NATIVE_APP_INFOS = {
  drive: {
    appId: 'io.cozy.drive.mobile',
    uri: 'cozydrive://'
  },
  banks: {
    appId: isAndroidApp() ? 'io.cozy.banks.mobile' : 'io.cozy.banks',
    uri: 'cozybanks://'
  }
}
