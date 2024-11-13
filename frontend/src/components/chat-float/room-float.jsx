import { useColorModeValue, Heading, Text, Flex, Box, Avatar, Link } from '@chakra-ui/react'
import WrapContent from '@components/common/wrap-content'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getAllRoomConversation } from '@redux/api-request/room'
import { chooseRoomFloat } from '@redux/conversationSlice'
import { Link as ReactRouterLink } from 'react-router-dom'
import axiosClient from '../../config/axios'

const ListConversation = () => {
  const dispatch = useDispatch()
  const userLogin = useSelector(state => state.auth.authState.user)
  const rooms = useSelector(state => state.room.getAllRoomConversation.rooms)
  useEffect(() => {
    if (userLogin?.id) {
      getAllRoomConversation(dispatch, userLogin?.id)
    }
  }, [userLogin])
  return (
    <WrapContent title="Messages">
      {rooms?.map((room, index) => {
        return <Conversation senderId={userLogin?.id} key={room?.id || index} room={room} />
      })}
      <Link as={ReactRouterLink} to="/chat">
        <Text textAlign="center" color={useColorModeValue('blue.500', 'pink.400')}>
          See all in Messager
        </Text>
      </Link>
    </WrapContent>
  )
}

const Conversation = ({ room, senderId }) => {
  const [receiver, setReceiver] = useState()
  const dispatch = useDispatch()

  const receiverId = useMemo(() => {
    return room?.member.find(m => m !== senderId)
  }, [room])

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const user = await axiosClient.get(`/user/${receiverId}`)
        setReceiver(user)
      } catch (error) {
        console.log(error)
      }
    }
    if (receiverId) {
      loadUserProfile()
    }
  }, [receiverId])

  const handleSelectRoom = useCallback(() => {
    dispatch(chooseRoomFloat({ info: room, receiver }))
  }, [receiver])
  return (
    <Flex
      onClick={handleSelectRoom}
      gap={'10px'}
      p={2}
      rounded="10px"
      align="center"
      cursor="pointer"
      _hover={{
        backgroundColor: `${useColorModeValue('blackAlpha.200', 'whiteAlpha.300')}`
      }}
    >
      <Avatar src={receiver?.avatar} sx={{ width: '40px', height: '40px' }} />
      <Box>
        <Heading as="h3" fontSize="md">
          {receiver?.displayName}
        </Heading>
        <Text color={useColorModeValue('gray.500', 'whiteAlpha.600')} fontSize="sm" noOfLines={1}></Text>
      </Box>
    </Flex>
  )
}

export default ListConversation
