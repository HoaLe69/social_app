import {
  Flex,
  Avatar,
  Box,
  Text,
  useColorModeValue,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem
} from '@chakra-ui/react'
import formatTime from '../../util/timeago'
import { BsThreeDots } from 'react-icons/bs'
import { useSelector } from 'react-redux'
import { memo } from 'react'

const WrapMessage = ({ children, isMyMess }) => {
  return (
    <Box>
      {!isMyMess ? (
        <Flex gap="5px" align="end" mt={3}>
          {children}
        </Flex>
      ) : (
        <Flex gap="5px" align="end" mt={3} justifyContent="end" flexDir="row-reverse">
          {children}
        </Flex>
      )}
    </Box>
  )
}

const Message = ({ isFloat, receiver, ...message }) => {
  const userLogin = useSelector(state => state.auth.authState.user)
  const handleRecallMessage = async () => {}

  const inactive = useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')
  const isMyMess = userLogin?.id === message?.userId
  const colorRecall = useColorModeValue('blackAlpha.700', 'whiteAlpha.500')
  return (
    <WrapMessage isMyMess={isMyMess}>
      <Box display="flex" gap="5px" maxW={isFloat ? '70%' : '60%'}>
        {!isMyMess && <Avatar src={receiver?.avatar} alt={receiver?.displayName} size="sm" />}
        <Box display="flex" flexDir="column" alignItems={isMyMess ? 'flex-end' : 'flex-start'}>
          <Box
            position="relative"
            role="group"
            _before={{
              content: '""',
              width: '100px',
              height: '150%',
              position: 'absolute',

              top: '50%',
              transform: 'translateY(-50%)',
              right: `${!isMyMess ? '-100px' : 'unset'}`,
              left: `${isMyMess ? '-100px' : 'unset'}`,
              backgroundColor: 'transparent'
            }}
          >
            {message?.content?.length > 0 ? (
              <Box bg={isMyMess ? 'grassTeal' : inactive} p={1} px={2} borderRadius="10px" maxW="max-content">
                <Text fontSize="16px">{message?.content}</Text>
              </Box>
            ) : (
              <Box fontSize="16px" p={2} border="1px" rounded="25px" color={colorRecall}>
                Tin nhắn đã được thu hồi
              </Box>
            )}
            <Box
              right={isMyMess ? '104%' : 'unset'}
              left={!isMyMess ? '104%' : 'unset'}
              position="absolute"
              top="0"
              display={message?.content?.length > 0 && message?.userId === userLogin?.id ? 'flex' : 'none'}
              alignItems="center"
              gap="5px"
            >
              <Menu>
                <MenuButton
                  as={IconButton}
                  icon={<BsThreeDots />}
                  backgroundColor="transparent"
                  display="none"
                  _groupHover={{ display: 'flex' }}
                  rounded="full"
                  size="sm"
                />
                <MenuList>
                  <MenuItem onClick={handleRecallMessage}>Thu hồi tin nhắn</MenuItem>
                </MenuList>
              </Menu>
            </Box>
          </Box>

          <Text color={useColorModeValue('blackAlpha.800', 'whiteAlpha.700')} fontSize="13px">
            {message?.createAt && formatTime(message?.createAt)}
          </Text>
        </Box>
      </Box>
    </WrapMessage>
  )
}

export default memo(Message)
