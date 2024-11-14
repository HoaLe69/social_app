import {
  Flex,
  IconButton,
  Box,
  Link,
  Input,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
  InputRightElement,
  Spinner,
  Avatar,
  Heading
} from '@chakra-ui/react'
import NavWrap from './nav-wrap'
import Logo from './logo'
import { AiOutlineHeart, AiOutlineMessage } from 'react-icons/ai'
import { Link as ReactRouterLink } from 'react-router-dom'
import NavMenuPc from './nav-menu-items-pc'
import route from '@config/route'
import { BiSearchAlt } from 'react-icons/bi'
import { useCallback, useEffect, useRef, useState } from 'react'
import useDebounce from '../../hooks/useDebounce'
import { IoMdClose } from 'react-icons/io'
import axiosClient from '../../config/axios'
import { useSelector } from 'react-redux'
import useClickOutside from '../../hooks/useClickOutside'
import { refreshEvents } from '../../hooks/useRefreshable'

const PopResult = ({ result, isOpen, setVisibleResult, userLoginId }) => {
  const refContainer = useRef(null)
  const bgHover = useColorModeValue('blackAlpha.200', 'whiteAlpha.300')
  const users = result.filter(user => user.id !== userLoginId) || []

  const handleClosePopResult = useCallback(() => {
    setVisibleResult(false)
  }, [])
  useClickOutside(refContainer, handleClosePopResult)
  return (
    <Box
      ref={refContainer}
      display={isOpen ? 'block' : 'none'}
      p={1}
      rounded="10px"
      pos="absolute"
      right="0"
      left="0"
      top="90%"
      width="100%"
      bg={useColorModeValue('#fff', '#2D3748')}
    >
      <Box display="flex" alignItems="center">
        <Heading fontSize="16px">Result</Heading>
        <IconButton onClick={handleClosePopResult} ml="auto" icon={<IoMdClose />} size="sm" rounded="full" />
      </Box>
      {users?.length === 0 ? (
        <Box p={1}>No search result</Box>
      ) : (
        <Box p={1}>
          {users?.map(user => {
            return (
              <Link _hover={{ textDecoration: 'none' }} key={user?.id} as={ReactRouterLink} to={`/profile/${user?.id}`}>
                <Flex
                  alignItems="center"
                  gap="2"
                  py={1}
                  px={2}
                  rounded="10px"
                  _hover={{
                    backgroundColor: bgHover
                  }}
                >
                  <Avatar src={user?.avatar} alt={user?.displayName} size="sm" />
                  <Heading fontSize="13px">{user?.displayName}</Heading>
                </Flex>
              </Link>
            )
          })}
        </Box>
      )}
    </Box>
  )
}

const NavTop = ({ isFixed }) => {
  const [search, setSearchValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshsing] = useState(false)
  const [result, setResult] = useState([])
  const [visibleResult, setVisibleResult] = useState(false)
  const debounceValue = useDebounce(search)
  const userLogin = useSelector(state => state.auth.authState.user)

  useEffect(() => {
    if (!debounceValue.trim()) {
      setLoading(false)
      return
    }
    setLoading(true)
    const getSearchResult = async () => {
      try {
        setLoading(true)
        const res = await axiosClient.get(`/user/search?email=${debounceValue}`)
        if (res) {
          setResult(res)
          setVisibleResult(true)
        }
      } catch (err) {
        setLoading(false)
        console.log(err)
      } finally {
        setLoading(false)
      }
    }
    getSearchResult()
  }, [debounceValue])

  const handleOnChange = e => {
    setSearchValue(e.target.value)
  }

  const bgLoadingPost = useColorModeValue('#f0e7db', '#202023')
  const handleRefreshPost = useCallback(async () => {
    setRefreshsing(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setRefreshsing(false)

    refreshEvents.emit('refresh:posts')
  }, [])

  return (
    <NavWrap isFixed={isFixed}>
      <Flex justify="space-between">
        <Logo onClick={handleRefreshPost} />
        <Box pos="relative">
          <Box
            shadow="dark-lg"
            display={refreshing ? 'flex' : 'none'}
            alignItems="center"
            justifyContent="center"
            position="absolute"
            top="120%"
            left="50%"
            bg={bgLoadingPost}
            width="12"
            height="12"
            borderRadius="full"
          >
            <Spinner color="teal.500" />
          </Box>
          <InputGroup bg={useColorModeValue('whiteAlpha.700', 'whiteAlpha.200')} rounded="20px" w="300px">
            <InputLeftElement pointerEvents="none">
              <BiSearchAlt />
            </InputLeftElement>
            <Input
              placeholder="Search"
              rounded="20px"
              focusBorderColor="whiteAlpha.300"
              value={search}
              onChange={handleOnChange}
            />
            {loading && (
              <InputRightElement>
                <Spinner />
              </InputRightElement>
            )}
          </InputGroup>
          <PopResult
            userLoginId={userLogin?.id}
            result={result}
            isOpen={visibleResult}
            setVisibleResult={setVisibleResult}
          />
        </Box>

        <Box display={{ lg: 'none' }}>
          <Link to={route.notifi} as={ReactRouterLink}>
            <IconButton
              fontSize={'20px'}
              isRound={true}
              icon={<AiOutlineHeart />}
              bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
            />
          </Link>
          <Link to={route.message} as={ReactRouterLink}>
            <IconButton
              fontSize={'20px'}
              isRound={true}
              ml={2}
              icon={<AiOutlineMessage />}
              bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
            />
          </Link>
        </Box>
        <NavMenuPc />
      </Flex>
    </NavWrap>
  )
}

export default NavTop
