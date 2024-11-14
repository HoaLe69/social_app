import { Box, Heading, Image, useColorModeValue, Text, Link } from '@chakra-ui/react'
import axios from 'axios'
import { forwardRef, useCallback, useEffect, useState } from 'react'
import formatTime from '../../util/timeago'
import { useInView } from 'react-intersection-observer'
import { BeatLoader } from 'react-spinners'

const NewCard = forwardRef(({ infor }, ref) => {
  return (
    <Box ref={ref} my={4} py={2} rounded={'10px'} bg={useColorModeValue('whiteAlpha.700', 'whiteAlpha.200')}>
      <Link isExternal href={infor?.url} _hover={{ textDecortion: 'none' }}>
        <Box as="header" px={2} pb={2}>
          <Heading textAlign="left" fontSize="20px">
            {infor?.title}
          </Heading>
          <Text textAlign="right" color={useColorModeValue('blue.500', 'pink.400')}>
            {infor?.author}
          </Text>
          <Text textAlign={'right'} color={useColorModeValue('blackAlpha.600', 'whiteAlpha.500')}>
            {formatTime(infor?.publishedAt)}
          </Text>
        </Box>
        {infor?.urlToImage && (
          <Box overflow={'hidden'}>
            <Image
              loading="lazy"
              minH="400px"
              maxH="600px"
              w="full"
              src={infor?.urlToImage}
              alt={infor?.title}
              objectFit={'cover'}
            />
          </Box>
        )}
        <Text noOfLines={infor?.urlToImage ? '3' : 'none'} pl={2} textAlign="left">
          {infor?.description}
        </Text>
      </Link>
    </Box>
  )
})

const News = () => {
  //  const { page, setHasmore, lastPostRef } = useInfinity()
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasmore] = useState(true)
  const [page, setPage] = useState(1)
  const { ref, inView } = useInView()
  const apikey = process.env.REACT_APP_NEWS_API_KEY
  const PAGE_SIZE = 10

  const fetchNew = useCallback(async () => {
    if (loading || !hasMore) return
    try {
      setLoading(true)
      const baseUrl = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apikey}&page=${page}&pageSize=${PAGE_SIZE}`
      const response = await axios.get(baseUrl)
      if (!response?.data.articles.length) {
        setHasmore(false)
        return
      }
      setNews(pre => [...pre, ...response.data.articles])
      setPage(pre => pre + 1)
      //      setNews(pre => [...pre, ...res.data.articles])
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }, [page, hasMore])

  useEffect(() => {
    if (inView) {
      fetchNew()
    }
  }, [inView])
  return (
    <Box>
      {news?.map((newinfo, index) => {
        return <NewCard key={index} infor={newinfo} />
      })}
      <Box>
        <Box pt={2} ref={ref} display="flex" justifyContent="center">
          {loading && <BeatLoader color="white" />}
        </Box>
      </Box>
    </Box>
  )
}

export default News
