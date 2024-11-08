import { Box, Text, Flex, Avatar, Heading, useColorModeValue, Link } from '@chakra-ui/react'
import { AiOutlineLeft } from 'react-icons/ai'
import { Link as ReactRouterLink, useParams } from 'react-router-dom'
import route from '@config/route'
import { COLOR_THEME } from '../../constant'
import { useSelector } from 'react-redux'
import useFetchData from '../../hooks/useFetchData'
import EmptyRoom from './room-empty'
import Message from './message'
import socketService from '../../hooks/useWebSocket'
import { useEffect, useRef, useState, useMemo } from 'react'
import InputRoomChat from './input-mess'
import axios from 'axios'

const RoomConversation = () => {
  const baseUrl = process.env.REACT_APP_API_URL
  const [messages, setMessages] = useState([])
  const [filterMess, setFilterMess] = useState({ message: '' })
  const params = useParams()
  const refDiv = useRef(null)
  const receiverId = new URLSearchParams(document.location.search).get('receiver')
  const userLogin = JSON.parse(localStorage.getItem('user'))
  const roomFormStore = useSelector(state => state.room.selectedRoom.id)
  const roomId = roomFormStore || params?.id
  const url = `${baseUrl}/user/${receiverId}`
  const { apiData: user } = useFetchData(url, userLogin?.accessToken)

  const bgHeader = useColorModeValue('#ffffff40', '#20202380')
  const { sendMessage, disconnect, connect } = useMemo(() => socketService(setMessages, setFilterMess), [])

  useEffect(() => {
    if (refDiv.current) refDiv.current.scrollTop = refDiv.current.scrollHeight
  }, [messages])

  useEffect(() => {
    if (roomId) connect('messages', roomId)
    return () => disconnect()
  }, [roomId])

  useEffect(() => {
    if (filterMess.message) {
      const messRecallIndex = messages.findIndex(el => el.id === filterMess.message)
      if (messRecallIndex !== -1) {
        const newListMessage = messages
        newListMessage[messRecallIndex] = {
          ...newListMessage[messRecallIndex],
          content: ''
        }
        setMessages([...newListMessage])
      }
    }
  }, [filterMess])

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get(`${baseUrl}/message/all/${roomId}`, {
          headers: { Authorization: `Bearer ${userLogin?.accessToken}` }
        })
        setMessages(res)
      } catch (err) {
        console.log(err)
      }
    }
    if (roomId) getMessages()
  }, [roomId, baseUrl, userLogin?.accessToken])
  return (
    <>
      {roomId ? (
        <Box display="flex" h={{ base: '100vh', lg: 'full' }} flexDir="column">
          <Flex
            as="header"
            gap="10px"
            align="center"
            borderBottomWidth={1}
            borderColor={COLOR_THEME.BORDER}
            py={2}
            css={{ backdropFilter: 'blur(10px)' }}
            bg={bgHeader}
          >
            <Link display={{ lg: 'none', base: 'block' }} as={ReactRouterLink} to={route.message}>
              <Box fontSize="20px">
                <AiOutlineLeft />
              </Box>
            </Link>
            <Avatar ml={2} src={user?.avatar} size="sm" alt={user?.displayName} />
            <Heading as="h3" fontSize="16px">
              {user?.displayName}
            </Heading>
          </Flex>
          <Box flex="1" sx={{ height: 'calc(100% - 56px)' }} display="flex" flexDir="column" justifyContent="flex-end">
            <Box p={2} display="flex" flexDir="column" maxH="100%" ref={refDiv} overflowY="auto" overflowX="hidden">
              <Box display="flex" flexDir="column" alignItems="center" mb={20}>
                <Avatar src={user?.avatar} size="xl" alt={user?.displayName} />
                <Text color="gray.500">Let chat with {user?.displayName}</Text>
              </Box>
              <Box pb={12}>
                {messages.map((message, index) => {
                  return (
                    <Message roomId={roomId} key={index} avatar={user?.avatar} {...message} sendMessage={sendMessage} />
                  )
                })}
              </Box>
            </Box>
            <InputRoomChat roomId={roomId} sendMessage={sendMessage} />
          </Box>
        </Box>
      ) : (
        <EmptyRoom />
      )}
    </>
  )
}

export default RoomConversation
