import { useContext, useEffect } from 'react'

import { BarContext } from 'components/BarProvider'

const BarRight = ({ children }) => {
  const { setBarRight } = useContext(BarContext)

  console.log('Render BarRight')

  useEffect(() => {
    setBarRight(children)
  }, [children, setBarRight])

  return null
}

export default BarRight
