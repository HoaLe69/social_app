import { Box } from '@chakra-ui/react'
import ChatFloatRoom from './chat-float-room'
import { useSelector } from 'react-redux'

const ChatFloat = () => {
  const receiver = useSelector(state => state.room.roomFloatSelect.Listreceiver)

  return (
    <Box position="fixed" display="flex" gap={5} bottom={0} right={10}>
      {receiver?.map((roomData, index) => {
        return <ChatFloatRoom key={roomData?.roomId || index} receiver={roomData?.receiver} roomId={roomData?.roomId} />
      })}
    </Box>
  )
}

export default ChatFloat
