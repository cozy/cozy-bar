import { useContext, useEffect } from 'react'

import { BarContext } from 'components/BarProvider'

const BarSearch = ({ children }) => {
  const { setBarSearch } = useContext(BarContext)

  console.log('Render BarSearch')

  useEffect(() => {
    setBarSearch(children)
  }, [children, setBarSearch])

  return null
}

export default BarSearch
