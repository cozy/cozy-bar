import set from 'lodash.set'

import minilog from '@cozy/minilog'
import flag from 'cozy-flags'

set(window, `cozy.debug.flagship`, () => flag('flagship.debug', true))

const logger = minilog('cozy-bar')
minilog.suggest.deny('cozy-bar', 'info')

export default logger
