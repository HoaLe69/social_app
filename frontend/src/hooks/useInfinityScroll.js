import { useInView } from 'react-intersection-observer'
import { useCallback, useEffect, useRef, useState } from 'react'

const useInfinity = () => {
  const [page, setPage] = useState(0)
  const [hasMore, setHasmore] = useState(false)
  const observer = useRef()
  const lastPostRef = useCallback(
    node => {
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting && hasMore) {
            setPage(pre => pre + 1)
          }
        },
        {
          threshold: 1
        }
      )
      if (node) observer.current.observe(node)
    },
    [hasMore]
  )
  return { lastPostRef, page, setHasmore }
}

export default useInfinity
