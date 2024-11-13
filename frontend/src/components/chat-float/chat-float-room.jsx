import { Text, Avatar, Box, Flex, Heading, IconButton, Link, useColorModeValue, Spinner } from '@chakra-ui/react'
import { IoMdClose } from 'react-icons/io'
import { COLOR_THEME } from '../../constant'
import InputRoomChat from '../conversation/input-mess'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import Message from '../conversation/message'
import { useStompClient } from '../../hooks/useWebSocket'
import { Link as ReactRouterLink } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { closeRoomFloat } from '../../redux/conversationSlice'
import axiosClient from '../../config/axios'

const ChatFloatRoom = ({ room, receiver }) => {
  const dispatch = useDispatch()
  const refDiv = useRef()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(null)

  //  const userLogin = useSelector(state => state.auth.authState.user)

  const handleIncomingMessage = useCallback(message => {
    setMessages(pre => [message.body, ...pre])
  }, [])

  const { sendMessage } = useStompClient('/topic/messages', room?.id, handleIncomingMessage)

  const handleOnClickCloseRoom = useCallback(() => {
    dispatch(closeRoomFloat(room?.id))
  }, [room])

  const loadMessageHistory = useCallback(async () => {
    setLoading(true)
    try {
      const res = await axiosClient.get(`/message/all/${room?.id}`)
      setMessages(pre => [...pre, ...res])
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (room?.id) loadMessageHistory()
  }, [room?.id])

  useEffect(() => {
    const containerEl = refDiv.current
    if (containerEl) {
      containerEl.scrollTop = containerEl.scrollHeight
    }
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
          <Box width="full" display="flex" alignItems="center" justifyContent="center">
            {loading && <Spinner />}
          </Box>
          <Box display="flex" flexDirection="column-reverse">
            {messages?.map((message, index) => {
              return <Message {...message} receiver={receiver} key={message?.id || index} roomId={room?.id} isFloat />
            })}
          </Box>
        </Box>
        <InputRoomChat roomId={room?.id} sendMessage={sendMessage} />
      </Box>
    </Box>
  )
}

export default memo(ChatFloatRoom)
