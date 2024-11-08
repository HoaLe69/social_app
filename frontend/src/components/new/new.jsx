import { Box, Heading, Image, useColorModeValue, Text, Link } from '@chakra-ui/react'
import axios from 'axios'
import { forwardRef, useEffect, useState } from 'react'
import formatTime from '../../util/timeago'
import useInfinity from '../../hooks/useInfinityScroll'

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
  const { page, setHasmore, lastPostRef } = useInfinity()
  const [news, setNews] = useState([])
  useEffect(() => {
    const apikey = '95e807e72f434d859fb379370df15ff9'
    const pageSize = 3
    const getNews = async () => {
      try {
        const baseUrl = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apikey}&page=${page}&pageSize=${pageSize}`
        const res = await axios.get(baseUrl)
        setNews(pre => [...pre, ...res.articles])
        setHasmore(true)
      } catch (err) {
        console.log(err)
      }
    }
    getNews()
  }, [page])
  return (
    <Box>
      {news?.map((newinfo, index) => {
        if (index + 1 === news.length) {
          return <NewCard key={index} ref={lastPostRef} infor={newinfo} />
        }

        return <NewCard key={index} infor={newinfo} />
      })}
    </Box>
  )
}

export default News
