import WrapContent from '@components/common/wrap-content'
import { Flex, Avatar, Text, Heading, Box, useColorModeValue } from '@chakra-ui/react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { getAllRoomConversation } from '@redux/api-request/room'
import useFetchData from '../../hooks/useFetchData'
import { getSelectedRoom } from '@redux/conversationSlice'

const CoversItem = ({ senderId, accessToken, room }) => {
  //get room id
  const params = useParams()
  const roomFormStore = useSelector(state => state.room.selectedRoom.id)
  const roomId = roomFormStore || params?.id

  const dispatch = useDispatch()

  // get receiver id
  const [receiveId] = room?.member.filter(memberId => memberId !== senderId)

  const url = `${process.env.REACT_APP_API_URL}/user/${receiveId}`
  const { apiData: user } = useFetchData(url, accessToken)

  const bgColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.300')
  const textColor = useColorModeValue('gray.500', 'whiteAlpha.600')

  const handleOnClickRoom = () => {
    window.history.replaceState(null, `Chat with ${user?.displayName}`, `/chat/${room?.id}?receiver=${user?.id}`)
    dispatch(getSelectedRoom(room?.id))
  }
  return (
    <Flex
      onClick={handleOnClickRoom}
      gap={'10px'}
      bg={room?.id === roomId && bgColor}
      p={2}
      rounded="10px"
      align="center"
      cursor="pointer"
      _hover={{
        backgroundColor: `${bgColor}`
      }}
    >
      <Avatar src={user?.avatar} sx={{ width: '40px', height: '40px' }} />
      <Box display={{ base: 'none', lg: 'block' }}>
        <Heading as="h3" fontSize="md">
          {user?.displayName}
        </Heading>
      </Box>
    </Flex>
  )
}
const Converstation = () => {
  const dispatch = useDispatch()
  const userLogin = JSON.parse(localStorage.getItem('user'))
  const rooms = useSelector(state => state.room.getAllRoomConversation.rooms)
  useEffect(() => {
    if (userLogin?.accessToken) {
      getAllRoomConversation(dispatch, userLogin.accessToken, userLogin?.id)
    }
  }, [userLogin?.accessToken, dispatch, userLogin?.id])
  return (
    <WrapContent title="Message">
      {rooms.map(room => {
        return <CoversItem senderId={userLogin?.id} accessToken={userLogin?.accessToken} key={room.id} room={room} />
      })}
    </WrapContent>
  )
}

export default Converstation
