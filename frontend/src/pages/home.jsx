import PostContainer from '@components/post/post-container'
import { Avatar, Text, Box, useColorModeValue, useDisclosure } from '@chakra-ui/react'
import CreatePostModal from '@components/modals/create'
import { memo } from 'react'
import ChatFloat from '@components/chat-float/chat-float'
import LayoutTab from '../layout/layout-tab'

const Home = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const userLogin = JSON.parse(localStorage.getItem('user'))
  return (
    <LayoutTab>
      <Box px={0}>
        <Box
          mt={2}
          display="flex"
          alignItems="center"
          gap="2"
          py={2}
          rounded="20px"
          px={2}
          justifyContent="flex-start"
          bg={useColorModeValue('whiteAlpha.700', 'whiteAlpha.200')}
          onClick={onOpen}
        >
          <Avatar src={userLogin?.avatar} alt={userLogin?.displayName} />
          <Box textAlign={'left'} flex="1" height="40px" rounded="25px" px={4}>
            <Text lineHeight={'40px'} color={useColorModeValue('blackAlpha.700', 'whiteAlpha.700')} noOfLines={1}>
              {userLogin?.displayName} let share your great moment to everyone
            </Text>
            <CreatePostModal isOpen={isOpen} onClose={onClose} />
          </Box>
        </Box>
        <PostContainer />
      </Box>
      <ChatFloat />
    </LayoutTab>
  )
}

export default memo(Home)
