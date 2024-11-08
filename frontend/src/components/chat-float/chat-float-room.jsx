import { Text, Avatar, Box, Flex, Heading, IconButton, Link, useColorModeValue } from '@chakra-ui/react'
import { IoMdClose } from 'react-icons/io'
import { COLOR_THEME } from '../../constant'
import InputRoomChat from '../conversation/input-mess'
import { useEffect, useMemo, useRef, useState } from 'react'
import axios from 'axios'
import Message from '../conversation/message'
import WebSocket from '../../hooks/useWebSocket'
import { Link as ReactRouterLink } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { closeRoomFloat } from '../../redux/conversationSlice'

const ChatFloatRoom = ({ receiver, roomId }) => {
  const dispatch = useDispatch()
  const refDiv = useRef()
  const [messages, setMessages] = useState([])
  const [filterMess, setfilterMess] = useState({ message: '' })
  const userLogin = JSON.parse(localStorage.getItem('user'))
  const baseUrl = process.env.REACT_APP_API_URL
  const { sendMessage, connect, disconnect } = useMemo(() => WebSocket(setMessages, setfilterMess), [])
  useEffect(() => {
    if (roomId) connect('messages', roomId)
  }, [])

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
  }, [filterMess.message])

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get(`${baseUrl}/message/all/${roomId}`, {
          headers: { Authorization: `Bearer ${userLogin.accessToken}` }
        })
        setMessages(res)
      } catch (err) {
        console.log(err)
      }
    }
    if (roomId) getMessages()
  }, [roomId, baseUrl, userLogin.accessToken])
  const handleOnClickCloseRoom = () => {
    dispatch(closeRoomFloat(roomId))
    if (roomId) disconnect()
  }

  useEffect(() => {
    if (refDiv.current) refDiv.current.scrollTop = refDiv.current.scrollHeight
  }, [messages])
  return (
    <Box
      w="328px"
      border="1px"
      borderColor={COLOR_THEME.BORDER}
      roundedTop="10px"
      h="450px"
      boxShadow="lg"
      bg={useColorModeValue('#f0e7db', '#202023')}
    >
      <Flex as="header" borderBottom="1px" borderColor={COLOR_THEME.BORDER} alignItems="center" gap={2} p={2}>
        <Link
          display="flex"
          alignItems="center"
          gap="5px"
          _hover={{ textDecoration: 'none' }}
          as={ReactRouterLink}
          to={`/profile/${receiver?.id}`}
        >
          <Avatar size="sm" src={receiver?.avatar} />
          <Heading fontSize={'13px'}>{receiver?.displayName}</Heading>
        </Link>
        <IconButton
          onClick={handleOnClickCloseRoom}
          ml="auto"
          rounded="full"
          size="sm"
          icon={<IoMdClose />}
        ></IconButton>
      </Flex>
      <Box display="flex" flexDir="column" sx={{ height: 'calc(100% - 50px )' }} justifyContent="end">
        <Box p={2} overflowX={'hidden'} display="flex" flexDir="column" maxH="100%" overflowY="auto" ref={refDiv}>
          <Box display="flex" flexDir="column" alignItems="center" mb={20}>
            <Avatar src={receiver?.avatar} size="md" alt={receiver?.displayName} />
            <Text color="gray.500">Let chat with {receiver?.displayName}</Text>
          </Box>
          <Box>
            {messages?.map((message, index) => {
              return (
                <Message
                  {...message}
                  avatar={receiver?.avatar}
                  key={message?.id || index}
                  roomId={roomId}
                  sendMessage={sendMessage}
                  isFloat
                />
              )
            })}
          </Box>
        </Box>
        <InputRoomChat roomId={roomId} sendMessage={sendMessage} />
      </Box>
    </Box>
  )
}

export default ChatFloatRoom
