import minilog from '@cozy/minilog'

const logger = minilog('cozy-bar')
minilog.suggest.deny('cozy-bar', 'info')

export default logger
