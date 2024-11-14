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
import { useDispatch, useSelector } from 'react-redux'
import { getCurrentPostInfor } from '@redux/postSlice'
import FeedModal from '../modals/feed'
import { reactPost } from '@redux/api-request/posts'
import { forwardRef, useState, memo, useRef, useEffect, useCallback } from 'react'
import formatTime from '../../util/timeago'
import { deletePost } from '../../redux/api-request/posts'
import { useToast } from '@chakra-ui/react'

const Post = forwardRef((props, ref) => {
  const { isFullPost, ...postInfo } = props
  const toast = useToast()

  const userLogin = useSelector(state => state.auth.authState.user)
  const [numberOfLines, setNumberOfLines] = useState(0)
  // paragraph ref
  const pRef = useRef()
  const { isOpen, onClose, onOpen } = useDisclosure()
  const [activeEmojiButton, setActiveEmojiButton] = useState(() =>
    postInfo.like ? postInfo.like?.includes(userLogin?.id) : false
  )
  const [liked, setLiked] = useState(postInfo.like || [])
  const dispatch = useDispatch()

  const colorReact = useColorModeValue('#1a202c', '#ffffff')
  const bgPost = useColorModeValue('whiteAlpha.700', 'whiteAlpha.200')

  const amountOfComment = useSelector(state => state.comment.amountCommentCurrPost)

  useEffect(() => {
    if (pRef.current) {
      const lineHeight = parseFloat(window.getComputedStyle(pRef.current).lineHeight)
      const height = pRef.current.getBoundingClientRect().height
      const calculatedNumberOfLines = Math.round(height / lineHeight)
      setNumberOfLines(calculatedNumberOfLines)
    }
  }, [])

  const showRectPost = useCallback(() => {
    const quantity = liked?.length
    if (quantity === 0) return '0'
    else {
      if (quantity === 1 && activeEmojiButton) return 'you'
      else if (activeEmojiButton) return `you and ${quantity - 1} other`
      return `${quantity} other`
    }
  }, [liked])

  const handleOnClickLike = async () => {
    try {
      await reactPost(postInfo.id, userLogin?.id)
      if (activeEmojiButton) {
        setLiked([...liked].filter(likerId => likerId !== userLogin?.id))
      } else setLiked([...liked, userLogin?.id])
      setActiveEmojiButton(!activeEmojiButton)
    } catch (error) {
      console.log(error)
      toast({
        title: 'Post',
        position: 'bottom-left',
        description: error.response.data || 'Something went wrong',
        status: 'info',
        duration: 1500,
        isClosable: true
      })
    }
  }
  const handleShowFullPost = () => {
    dispatch(
      getCurrentPostInfor({
        ...postInfo,
        like: liked
      })
    )
  }

  const handleReadMorePost = () => {
    handleShowFullPost()
    onOpen()
  }

  const handleDeletePost = useCallback(() => {
    deletePost(dispatch, postInfo.id, postInfo.cloudinaryId)
  }, [])

  return (
    <Box mb={4} ref={ref} bg={isFullPost ? 'none' : bgPost} rounded="10px">
      <HStack as="header" p={2} display="flex">
        <Link
          as={ReactRouterLink}
          to={`/profile/${postInfo.userId}`}
          _hover={{ textDecoration: 'none' }}
          display="flex"
          alignItems="center"
          gap="5px"
        >
          <Avatar src={postInfo.photoUrl} size="md" />
          <Box>
            <Heading as="h3" fontSize="15px">
              {postInfo.displayName}
            </Heading>
            <Text fontSize="12px" textAlign={'left'} color={useColorModeValue('blackAlpha.600', 'whiteAlpha.500')}>
              {formatTime(postInfo.createAt)}
            </Text>
          </Box>
        </Link>
        {postInfo.userId === userLogin?.id && (
          <Box ml="auto">
            <MenuPost onDelete={handleDeletePost} postInfo={postInfo} />
          </Box>
        )}
      </HStack>
      <Box pl={2}>
        <Text ref={pRef} textAlign="left" noOfLines={numberOfLines >= 3 && !isFullPost ? '3' : 'none'}>
          {postInfo.description}
        </Text>
      </Box>
      <Box display={numberOfLines >= 3 && !isFullPost ? 'block' : 'none'} textAlign="left" pl={2}>
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
        {postInfo?.tag && <Badge colorScheme="red">{postInfo.tag}</Badge>}
      </Box>
      {postInfo?.thumbnail && (
        <Box overflow={'hidden'}>
          <Image
            loading="lazy"
            minH="400px"
            maxH="600px"
            w="full"
            src={postInfo.thumbnail}
            alt={postInfo.displayName}
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
          <Text>{amountOfComment || postInfo.comments} comments</Text>
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
          color={activeEmojiButton ? 'pink.400' : colorReact}
        >
          <Box lineHeight={1}>
            <AiOutlineHeart />
          </Box>
          Like
        </Flex>
        <Box flex={1} pointerEvents={isFullPost && 'none'} onClick={handleShowFullPost}>
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
          {isOpen && <FeedModal isOpen={isOpen} onClose={onClose} />}
        </Box>
      </Flex>
    </Box>
  )
})

export default memo(Post)
