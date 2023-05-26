import React, { createContext, useState } from 'react'

export const BarContext = createContext()

const BarProvider = ({ children }) => {
  const [barCenter, setBarCenter] = useState(null)
  const [barRight, setBarRight] = useState(null)
  const [barLeft, setBarLeft] = useState(null)
  const [barSearch, setBarSearch] = useState(null)

  return (
    <BarContext.Provider
      value={{
        barCenter,
        setBarCenter,
        barRight,
        setBarRight,
        barLeft,
        setBarLeft,
        barSearch,
        setBarSearch
      }}
    >
      {children}
    </BarContext.Provider>
  )
}

export default BarProvider
