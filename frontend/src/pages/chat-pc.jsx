import { Box } from '@chakra-ui/react'
import Converstation from '@components/conversation/conversation'
import RoomConversation from '@components/conversation/room-conversation'
import NavTop from '../components/nav/nav-top'
import { COLOR_THEME } from '../constant'

const ChatPc = () => {
  return (
    <Box display="flex" flexDir="column" justifyContent="flex-end" height="100vh">
      <NavTop isFixed={true} />
      <Box display="flex" flex={1} overflow="hidden">
        <Box borderRightWidth={1} flex={1} borderColor={COLOR_THEME.BORDER}>
          <Converstation />
        </Box>
        <Box flex={3}>
          <RoomConversation />
        </Box>
      </Box>
    </Box>
  )
}

export default ChatPc
