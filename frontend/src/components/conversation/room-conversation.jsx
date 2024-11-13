import { Box, Text, Flex, Avatar, Heading, useColorModeValue, Link } from '@chakra-ui/react'
import { AiOutlineLeft } from 'react-icons/ai'
import { Link as ReactRouterLink } from 'react-router-dom'
import route from '@config/route'
import { COLOR_THEME } from '../../constant'
import { useSelector } from 'react-redux'
import EmptyRoom from './room-empty'
import Message from './message'
import { useStompClient } from '../../hooks/useWebSocket'
import { useEffect, useRef, useState, useCallback } from 'react'
import InputRoomChat from './input-mess'
import axiosClient from '../../config/axios'

const RoomConversation = () => {
  const [messages, setMessages] = useState([])
  const refDiv = useRef(null)

  const selectedRoom = useSelector(state => state.room.selectedRoom.info)
  const receiver = useSelector(state => state.room.selectedRoom.receiver)

  const handleIncomingMessage = useCallback(message => {
    setMessages(pre => [...pre, message.body])
  }, [])

  const { sendMessage } = useStompClient('/topic/messages', selectedRoom?.id, handleIncomingMessage)

  const bgHeader = useColorModeValue('#ffffff40', '#20202380')

  useEffect(() => {
    if (refDiv.current) refDiv.current.scrollTop = refDiv.current.scrollHeight
  }, [messages])

  useEffect(() => {
    const loadMessageHistory = async () => {
      try {
        const res = await axiosClient.get(`/message/all/${selectedRoom?.id}`)
        setMessages(res)
      } catch (err) {
        console.log(err)
      }
    }
    if (selectedRoom?.id) loadMessageHistory()
  }, [selectedRoom])

  return (
    <>
      {selectedRoom ? (
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
            <Avatar ml={2} src={receiver?.avatar} size="sm" alt={receiver?.displayName} />
            <Heading as="h3" fontSize="16px">
              {receiver?.displayName}
            </Heading>
          </Flex>
          <Box flex="1" sx={{ height: 'calc(100% - 56px)' }} display="flex" flexDir="column" justifyContent="flex-end">
            <Box p={2} display="flex" flexDir="column" maxH="100%" ref={refDiv} overflowY="auto" overflowX="hidden">
              <Box display="flex" flexDir="column" alignItems="center" mb={20}>
                <Avatar src={receiver?.avatar} size="xl" alt={receiver?.displayName} />
                <Text color="gray.500">Let chat with {receiver?.displayName}</Text>
              </Box>
              <Box pb={12}>
                {messages.map((message, index) => {
                  return (
                    <Message
                      roomId={selectedRoom?.id}
                      key={index}
                      receiver={receiver}
                      avatar={receiver?.avatar}
                      {...message}
                    />
                  )
                })}
              </Box>
            </Box>
            <InputRoomChat roomId={selectedRoom.id} sendMessage={sendMessage} />
          </Box>
        </Box>
      ) : (
        <EmptyRoom />
      )}
    </>
  )
}

export default RoomConversation
