import {
  Link,
  HStack,
  useColorModeValue,
  Avatar,
  Heading,
  Text,
  Box,
  Menu,
  MenuItem,
  Button,
  MenuList,
  MenuButton,
  IconButton
} from '@chakra-ui/react'
import { Link as ReactRouterLink } from 'react-router-dom'
import formatTime from '../../util/timeago'
import { AiFillDelete } from 'react-icons/ai'
import { BsThreeDots } from 'react-icons/bs'

const ReplyComment = ({ reply, replys, rootComment, setShowReply, userOfPost, handleDeleteComment }) => {
  const userLogin = JSON.parse(localStorage.getItem('user'))
  const replyer = replys.find(rep => rep?.userId === reply?.replyId)
  const bgContent = useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')
  const createColor = useColorModeValue('blackAlpha.800', 'whiteAlpha.700')

  const handleDeleteSubComment = async () => {
    await handleDeleteComment(reply?.id)
  }
  return (
    <Box>
      <HStack alignItems="start" py={2}>
        <Link as={ReactRouterLink} to={`/profile/${reply?.userId}`}>
          <Avatar sx={{ width: '24px', height: '24px' }} src={reply?.avatar} alt={reply?.displayName} />
        </Link>
        <Box display="flex" flexDir={'column'}>
          <Box bg={bgContent} p={1} px={2} borderRadius="10px">
            <Heading fontSize={'13px'}>{reply?.displayName}</Heading>
            <Heading fontSize="13px" display="inline" mr="2">
              <Link
                as={ReactRouterLink}
                to={`/profile/${replyer ? replyer?.userId : rootComment?.userId}`}
                color={useColorModeValue('blue.500', 'pink.400')}
              >
                <strong>{replyer ? replyer?.displayName : rootComment?.displayName}</strong>
              </Link>
            </Heading>
            <Text display="inline" as="p">
              {reply?.content}
            </Text>
          </Box>

          <Text
            ml={2}
            fontSize="12px"
            fontWeight="bold"
            color={useColorModeValue('gray.700', 'whiteAlpha.600')}
            cursor="pointer"
            _hover={{ textDecoration: 'underline' }}
            onClick={() =>
              setShowReply(pre => ({
                ...pre,
                replyId: reply?.userId,
                show: true,
                displayName: reply?.displayName
              }))
            }
          >
            reply
          </Text>
        </Box>
        {(userLogin?.id === reply?.userId || rootComment?.id === userOfPost) && (
          <Menu placement="bottom-end">
            <MenuButton size="sm" rounded="full" icon={<BsThreeDots />} as={IconButton} />
            <MenuList>
              <MenuItem leftIcon={<AiFillDelete />} loadingText="delete" as={Button} onClick={handleDeleteSubComment}>
                delete
              </MenuItem>
            </MenuList>
          </Menu>
        )}
        <Text fontSize="12px" color={createColor}>
          {formatTime(reply?.createAt)}
        </Text>
      </HStack>
    </Box>
  )
}

export default ReplyComment
