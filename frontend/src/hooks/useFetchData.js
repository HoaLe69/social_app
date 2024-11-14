import { useEffect } from 'react'
import { useState } from 'react'
import axiosClient from '../config/axios'

const useFetchData = url => {
  const [isLoading, setLoading] = useState(false)
  const [apiData, setApiData] = useState(null)
  const [serverError, setError] = useState(null)
  useEffect(() => {
    setLoading(true)
    const fetchData = async () => {
      try {
        const res = await axiosClient.get(url)
        setApiData(res)
        setLoading(false)
      } catch (err) {
        setError(err)
        setLoading(false)
      }
    }
    if (!url?.includes('null')) fetchData()
  }, [url])
  return { isLoading, apiData, serverError }
}

export default useFetchData
