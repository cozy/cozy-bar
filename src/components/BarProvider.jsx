import React, { createContext, useContext, useState, useCallback } from 'react'

const BarContext = createContext()

/**
 * This provider allows you to hide banners while browsing the site
 */
const BarProvider = ({ children }) => {
  const [barCenter, setBarCenter] = useState(null)
  const [barRight, setBarRight] = useState(null)
  const [barLeft, setBarLeft] = useState(null)
  const [barSearch, setBarSearch] = useState(null)
  const [theme, setTheme] = useState()
  const [themeOverrides, setThemeOverrides] = useState()

  const handleThemeChange = useCallback((theme, overrides) => {
    setTheme(theme)
    if (overrides) {
      setThemeOverrides(overrides)
    }
  }, [])

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
        setBarSearch,
        setTheme: handleThemeChange,
        themeOverrides,
        theme
      }}
    >
      {children}
    </BarContext.Provider>
  )
}

const useBarContext = () => useContext(BarContext)

export { BarProvider, BarContext, useBarContext }
