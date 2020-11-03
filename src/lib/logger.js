import flag from 'cozy-flags'
import _minilog from '@cozy/minilog'

const minilog = window.minilog || _minilog
const logger = minilog('cozy-bar')

if (!flag('bar.debug')) {
  minilog.suggest.deny('cozy-bar', 'info')
}

export default logger
