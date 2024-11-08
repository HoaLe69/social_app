import {
  Box,
  Text,
  Link,
  Image,
  Avatar,
  Heading,
  HStack,
  Flex,
  Badge,
  useColorModeValue,
  useDisclosure
} from '@chakra-ui/react'
import { Link as ReactRouterLink } from 'react-router-dom'
import MenuPost from '../menu-post'
import { AiOutlineHeart, AiFillHeart, AiOutlineMessage } from 'react-icons/ai'
import { useDispatch } from 'react-redux'
import { getCurrentPostInfor } from '@redux/postSlice'
import FeedModal from '../modals/feed'
import { reactPost } from '@redux/api-request/posts'
import { forwardRef, useState, memo, useRef, useEffect } from 'react'
import formatTime from '../../util/timeago'

const Post = forwardRef((props, ref) => {
  const {
    id,
    userId,
    cloudinaryId,
    photoUrl,
    displayName,
    description,
    thumbnail,
    like,
    tag,
    comments,
    createAt,
    isDetail
  } = props

  const userLogin = JSON.parse(localStorage.getItem('user'))
  const [numberOfLines, setNumberOfLines] = useState(0)
  // paragraph ref
  const pRef = useRef()
  const { isOpen, onClose, onOpen } = useDisclosure()
  const [isLiked, setIsLike] = useState(() => (like ? like?.includes(userLogin?.id) : false))
  const [liked, setLiked] = useState(like || [])
  const dispatch = useDispatch()

  const handleOnClickLike = () => {
    if (userLogin?.accessToken && id) {
      reactPost(userLogin?.accessToken, id, userLogin?.id)
    }
    if (isLiked) {
      setLiked([...liked].filter(likerId => likerId !== userLogin?.id))
    } else setLiked([...liked, userLogin?.id])
    setIsLike(!isLiked)
  }
  const handleShowFullPost = () => {
    dispatch(
      getCurrentPostInfor({
        id,
        userId,
        cloudId: cloudinaryId,
        photoUrl,
        tag,
        displayName,
        description,
        thumbnail,
        like: liked,
        comments,
        createAt,
        isDetail
      })
    )
  }
  const colorReact = useColorModeValue('#1a202c', '#ffffff')
  const showRectPost = () => {
    const quantity = liked?.length
    if (quantity === 0) return '0'
    else {
      if (quantity === 1 && isLiked) return 'you'
      else if (isLiked) return `you and ${quantity - 1} other`
      return `${quantity} other`
    }
  }
  const bgPost = useColorModeValue('whiteAlpha.700', 'whiteAlpha.200')

  useEffect(() => {
    if (pRef.current) {
      const lineHeight = parseFloat(window.getComputedStyle(pRef.current).lineHeight)
      const height = pRef.current.getBoundingClientRect().height
      const calculatedNumberOfLines = Math.round(height / lineHeight)
      setNumberOfLines(calculatedNumberOfLines)
    }
  }, [])

  const handleReadMorePost = () => {
    handleShowFullPost()
    onOpen()
  }
  return (
    <Box mb={4} ref={ref} bg={isDetail ? 'none' : bgPost} rounded="10px">
      <HStack as="header" p={2} display="flex">
        <Link
          as={ReactRouterLink}
          to={`/profile/${userId}`}
          _hover={{ textDecoration: 'none' }}
          display="flex"
          alignItems="center"
          gap="5px"
        >
          <Avatar src={photoUrl} size="md" />
          <Box>
            <Heading as="h3" fontSize="15px">
              {displayName}
            </Heading>
            <Text fontSize="12px" textAlign={'left'} color={useColorModeValue('blackAlpha.600', 'whiteAlpha.500')}>
              {formatTime(createAt)}
            </Text>
          </Box>
        </Link>
        {userId === userLogin?.id && (
          <Box ml="auto">
            <MenuPost inforPost={props} id={id} cloudId={cloudinaryId} />
          </Box>
        )}
      </HStack>
      <Box pl={2}>
        <Text ref={pRef} textAlign="left" noOfLines={numberOfLines >= 3 && !isDetail ? '3' : 'none'}>
          {description}
        </Text>
      </Box>
      <Box display={numberOfLines >= 3 && !isDetail ? 'block' : 'none'} textAlign="left" pl={2}>
        <Text
          onClick={handleReadMorePost}
          cursor="pointer"
          fontSize="12px"
          _hover={{ textDecoration: 'underline' }}
          color={useColorModeValue('blue.500', 'pink.500')}
        >
          <strong> read more </strong>
        </Text>
      </Box>
      <Box pb={2} pl={2} textAlign="left">
        {tag && <Badge colorScheme="red">{tag}</Badge>}
      </Box>
      {thumbnail && (
        <Box overflow={'hidden'}>
          <Image
            loading="lazy"
            minH="400px"
            maxH="600px"
            w="full"
            src={thumbnail}
            alt={displayName}
            objectFit={'cover'}
          />
        </Box>
      )}
      <Flex
        py={2}
        px={7}
        justify="space-between"
        borderBottom="1px"
        borderBottomColor={useColorModeValue('blackAlpha.200', 'whiteAlpha.200')}
      >
        <Box display="flex" alignItems="center" gap="5px">
          <Box fontSize="12px" p={1} color="white" bg="pink.400" rounded="full">
            <AiFillHeart />
          </Box>
          <Text lineHeight={1}>{showRectPost()}</Text>
        </Box>
        <Box>
          <Text>{comments} comments</Text>
        </Box>
      </Flex>
      <Flex
        px={10}
        align="center"
        justify="space-around"
        mt={1}
        borderBottom="1px"
        borderBottomColor={useColorModeValue('blackAlpha.200', 'whiteAlpha.200')}
      >
        <Flex
          flex={1}
          alignItems="center"
          gap={1}
          justify="center"
          py={1}
          rounded="5px"
          _hover={{ bg: useColorModeValue('whiteAlpha.500', 'whiteAlpha.200') }}
          cursor="pointer"
          onClick={handleOnClickLike}
          color={isLiked ? 'pink.400' : colorReact}
        >
          <Box lineHeight={1}>
            <AiOutlineHeart />
          </Box>
          Like
        </Flex>
        <Box flex={1} pointerEvents={isDetail && 'none'} onClick={handleShowFullPost}>
          <Flex
            onClick={onOpen}
            cursor="pointer"
            py={1}
            rounded="5px"
            _hover={{
              bg: useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')
            }}
            flex={1}
            alignItems="center"
            gap={2}
            justify="center"
          >
            <AiOutlineMessage />
            Comments
          </Flex>
          <FeedModal isOpen={isOpen} onClose={onClose} />
        </Box>
      </Flex>
    </Box>
  )
})

export default memo(Post)
