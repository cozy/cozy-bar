import React from 'react'

import ClaudyMenu from './ClaudyMenu'

const Claudy = ({ opened, onToggle, config, usageTracker, appsList }) => (
  <div className={`coz-claudy ${opened ? 'coz-claudy--opened' : ''}`}>
    <button className='coz-claudy-icon coz-bar-hide-sm' data-claudy-opened={opened} onClick={onToggle} />
    <ClaudyMenu actions={config.actions} onClose={onToggle} usageTracker={usageTracker} appsList={appsList} />
  </div>
)

export default Claudy
