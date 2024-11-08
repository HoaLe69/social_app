import { useColorModeValue, Heading, Text, Flex, Box, Avatar, Link } from '@chakra-ui/react'
import WrapContent from '@components/common/wrap-content'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getAllRoomConversation } from '@redux/api-request/room'
import useFetchData from '../../hooks/useFetchData'
import { chooseRoomFloat } from '@redux/conversationSlice'
import { Link as ReactRouterLink } from 'react-router-dom'

const RoomsHome = () => {
  const dispatch = useDispatch()
  const userLogin = JSON.parse(localStorage.getItem('user'))
  const rooms = useSelector(state => state.room.getAllRoomConversation.rooms)
  useEffect(() => {
    if (userLogin?.accessToken) {
      getAllRoomConversation(dispatch, userLogin.accessToken, userLogin?.id)
    }
  }, [userLogin?.accessToken, dispatch, userLogin?.id])
  return (
    <WrapContent title="Messages">
      {rooms?.map((room, index) => {
        return (
          <Room accessToken={userLogin?.accessToken} senderId={userLogin?.id} key={room?.id || index} room={room} />
        )
      })}
      <Link as={ReactRouterLink} to="/chat">
        <Text textAlign="center" color={useColorModeValue('blue.500', 'pink.400')}>
          See all in Messager
        </Text>
      </Link>
    </WrapContent>
  )
}

const Room = ({ accessToken, room, senderId }) => {
  const dispatch = useDispatch()
  const [receiveId] = room?.member.filter(memberId => memberId !== senderId)

  const url = `${process.env.REACT_APP_API_URL}/user/${receiveId}`
  const { apiData: receiver } = useFetchData(url, accessToken)
  const handleSelectRoom = () => {
    dispatch(chooseRoomFloat({ roomId: room?.id, receiver: { ...receiver } }))
  }
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

export default RoomsHome
