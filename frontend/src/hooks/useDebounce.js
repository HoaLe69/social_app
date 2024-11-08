import { useEffect, useState } from 'react'

const useDebounce = searchValue => {
  const [searchOutput, setSearchOutput] = useState(searchValue)
  useEffect(() => {
    const timeId = setTimeout(() => {
      setSearchOutput(searchValue)
    }, 500)
    return () => clearTimeout(timeId)
  }, [searchValue])
  return searchOutput
}

export default useDebounce
