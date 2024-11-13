import WrapContent from '@components/common/wrap-content'
import { Flex, Avatar, Heading, Box, useColorModeValue } from '@chakra-ui/react'
import { useDispatch, useSelector } from 'react-redux'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { getAllRoomConversation } from '@redux/api-request/room'
import axiosClient from '../../config/axios'
import { getCurrentSelectedRoom } from '../../redux/conversationSlice'

const CoversItem = ({ senderId, room }) => {
  const [receiver, setReceiver] = useState()
  const selectedRoom = useSelector(state => state.room.selectedRoom.info)

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

  const dispatch = useDispatch()

  const bgColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.300')
  //  const textColor = useColorModeValue('gray.500', 'whiteAlpha.600')

  const handleSelectRoom = useCallback(() => {
    const payload = {
      info: room,
      receiver
    }
    dispatch(getCurrentSelectedRoom(payload))
  }, [receiver])
  return (
    <Flex
      onClick={handleSelectRoom}
      gap={'10px'}
      bg={room?.id === selectedRoom?.id && bgColor}
      p={2}
      rounded="10px"
      align="center"
      cursor="pointer"
      _hover={{
        backgroundColor: `${bgColor}`
      }}
    >
      <Avatar src={receiver?.avatar} sx={{ width: '40px', height: '40px' }} />
      <Box display={{ base: 'none', lg: 'block' }}>
        <Heading as="h3" fontSize="md">
          {receiver?.displayName}
        </Heading>
      </Box>
    </Flex>
  )
}
const Converstation = () => {
  const dispatch = useDispatch()
  const userLogin = useSelector(state => state.auth.authState.user)
  const rooms = useSelector(state => state.room.getAllRoomConversation.rooms)
  useEffect(() => {
    if (userLogin?.id) {
      getAllRoomConversation(dispatch, userLogin?.id)
    }
  }, [userLogin?.id])
  return (
    <WrapContent title="Message">
      {rooms.map(room => {
        return <CoversItem senderId={userLogin?.id} key={room.id} room={room} />
      })}
    </WrapContent>
  )
}

export default Converstation
