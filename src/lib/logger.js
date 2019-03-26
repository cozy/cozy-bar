import minilog from 'minilog'

const logger = minilog('cozy-bar')
minilog.suggest.deny('cozy-bar', 'info')

export default logger
