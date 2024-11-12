import { useEffect } from 'react'
const useClickOutside = (ref, callback) => {
  useEffect(() => {
    const mouseClickHandler = event => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback()
      }
    }
    document.addEventListener('mousedown', mouseClickHandler)
    return () => {
      document.removeEventListener('mousedown', mouseClickHandler)
    }
  }, [ref, callback])
}

export default useClickOutside
