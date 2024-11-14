import {
  Box,
  HStack,
  Avatar,
  Heading,
  Text,
  Link,
  useColorModeValue,
  IconButton,
  Menu,
  MenuList,
  MenuButton,
  MenuItem,
  Button,
  Spinner
} from '@chakra-ui/react'
import { useDispatch, useSelector } from 'react-redux'
import { useState, useEffect, useCallback, memo } from 'react'
import { Link as ReactRouterLink } from 'react-router-dom'
import InputComment from './input-comment'
import { useStompClient } from '../../hooks/useWebSocket'
import { BsThreeDots } from 'react-icons/bs'
import { AiFillDelete } from 'react-icons/ai'
import formatTime from '../../util/timeago'
// import ReplyComment from './reply-comment'
// import { GoReply } from 'react-icons/go'
import { getAllComment } from '../../redux/api-request/comment'
import { useToast } from '@chakra-ui/react'
import { useInView } from 'react-intersection-observer'
import { getAmountCommentCurrPost } from '../../redux/commentSlice'

const CommentItem = memo(({ userOfPost, comment, onDelete }) => {
  // const [replyCommentData, setReplyCommentData] = useState({
  //   visible: false,
  //   replyTo: '',
  //   displayName: undefined
  // })
  //  const [showReplyComment, setShowReplyComment] = useState(false)
  const userLogin = useSelector(state => state.auth.authState.user)

  // const handleReplyComment = useCallback(replyTo => {
  //   setReplyCommentData(pre => ({
  //     ...pre,
  //     root: comment?.id,
  //     replyTo,
  //     visible: true,
  //     displayName: comment?.displayName
  //   }))
  //   setShowReplyComment(true)
  // }, [])

  return (
    <Box pos="relative">
      <HStack p={2} px={2} alignItems="start">
        <Link as={ReactRouterLink} to={`/profile/${comment?.userId}`}>
          <Avatar src={comment?.avatar} size="sm" alt={comment?.displayName} />
        </Link>
        <Box>
          <Box bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')} p={1} px={2} borderRadius="10px">
            <Heading fontSize={'13px'}>{comment?.displayName}</Heading>
            <Text as="p">{comment?.content}</Text>
          </Box>
          {/* <Text */}
          {/*   ml={2} */}
          {/*   fontSize="12px" */}
          {/*   fontWeight="bold" */}
          {/*   color={useColorModeValue('gray.700', 'whiteAlpha.600')} */}
          {/*   cursor="pointer" */}
          {/*   _hover={{ textDecoration: 'underline' }} */}
          {/*   onClick={() => handleReplyComment(comment?.id)} */}
          {/* > */}
          {/*   reply */}
          {/* </Text> */}
        </Box>
        <Box>
          {(userLogin?.id === comment?.userId || userLogin?.id === userOfPost) && (
            <Menu placement="bottom-end">
              <MenuButton size="sm" rounded="full" icon={<BsThreeDots />} as={IconButton} />
              <MenuList>
                <MenuItem
                  leftIcon={<AiFillDelete />}
                  loadingText="delete"
                  as={Button}
                  onClick={() => onDelete(comment?.id)}
                >
                  delete
                </MenuItem>
              </MenuList>
            </Menu>
          )}
          <Text fontSize="12px" color={useColorModeValue('blackAlpha.800', 'whiteAlpha.700')}>
            {formatTime(comment?.createAt)}
          </Text>
        </Box>
      </HStack>
      <Box pl={12}>
        {/* <HStack display={comment?.reply?.length > 0 && showReplyComment === false ? 'flex' : 'none'}> */}
        {/*   <Box sx={{ transform: 'rotate(180deg)' }}> */}
        {/*     <GoReply /> */}
        {/*   </Box> */}
        {/*   <Text */}
        {/*     fontSize="15px" */}
        {/*     cursor="pointer" */}
        {/*     _hover={{ textDecoration: 'underline' }} */}
        {/*     color={useColorModeValue('blackAlpha.700', 'whiteAlpha.600')} */}
        {/*     onClick={() => setShowReplyComment(true)} */}
        {/*   > */}
        {/*     <strong>Xem thêm {comment?.reply?.length} phản hồi</strong> */}
        {/*   </Text> */}
        {/* </HStack> */}
        {/* <Box display={showReplyComment || replyCommentData.visible ? 'block' : 'none'}> */}
        {/*TODO: render reply comment here*/}
        {/* </Box> */}
      </Box>
      {/* <Box px={4} pl={8} display={replyCommentData.visible ? 'block' : 'none'}> */}
      {/*   <HStack alignItems="center" px={2}> */}
      {/*     <Link> */}
      {/*       <Avatar src={userLogin?.avatar} size="sm" /> */}
      {/*     </Link> */}
      {/*     <Box mt={2} bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')} alignItems="center" flex={1}> */}
      {/*       <InputComment */}
      {/*         sendMessage={sendMessage} */}
      {/*         id={comment?.id} */}
      {/*         postId={postId} */}
      {/*         reply={{ */}
      {/*           root: replyCommentData.root, */}
      {/*           displayName: replyCommentData?.displayName, */}
      {/*           to: replyCommentData?.replyTo */}
      {/*         }} */}
      {/*       /> */}
      {/*     </Box> */}
      {/*   </HStack> */}
      {/* </Box> */}
    </Box>
  )
})

const Comment = () => {
  const toast = useToast()
  const [comments, setComments] = useState([])
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const { inView, ref } = useInView({ threshold: 1 })

  const postId = useSelector(state => state.post?.currentPostInfor?.post?.id)
  const userOfPost = useSelector(state => state.post?.currentPostInfor?.post?.userId)
  const userLogin = useSelector(state => state.auth.authState.user)

  const handleIncomingComment = useCallback(message => {
    const body = message?.body
    try {
      if (body.error) throw new Error(body.error)
      if (body.action === 'DELETE') {
        setComments(pre => {
          const filterDel = pre.filter(cmt => cmt.id !== body.id)
          return filterDel
        })
      } else {
        setComments(pre => [message.body.comment, ...pre])
      }
      dispatch(getAmountCommentCurrPost(message.body.amountComment))
    } catch (error) {
      toast({
        title: 'Comment',
        position: 'bottom-left',
        description: error.message || 'Something went wrong',
        status: 'info',
        duration: 1500,
        isClosable: true
      })
    }
  }, [])

  const { sendMessage } = useStompClient(`/topic/comments`, postId, handleIncomingComment)

  const dispatch = useDispatch()

  const loadCommentHistory = useCallback(async () => {
    if (loading || !hasMore) return
    try {
      setLoading(true)
      //      await new Promise(resolve => setTimeout(resolve, 10000))
      const response = await getAllComment(dispatch, postId, page)
      if (!response.content.length) {
        setHasMore(false)
        return
      }
      setComments(pre => {
        return [...pre, ...response.content]
        // const sorted = [...pre, ...response.content].sort((a, b) => new Date(a.createAt) - new Date(b.createAt))
        // return sorted
      })
      setPage(pre => pre + 1)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }, [page, hasMore])

  useEffect(() => {
    if (inView && hasMore && !loading) {
      console.log('run code inside useEffect')
      loadCommentHistory()
    }
  }, [inView])

  const handleDeleteComment = commentId => {
    const message = {
      action: 'DELETE',
      id: commentId
    }
    sendMessage(`/app/comments/${postId}`, message)
  }

  const inputBackgroundColor = useColorModeValue('#f0e7db', '#202023')

  // console.log({ loading, hasMore })
  return (
    <Box>
      <Box>
        {comments?.map((comment, index) => {
          return (
            <CommentItem
              key={comment?.id || index}
              userOfPost={userOfPost}
              comment={comment}
              sendMessage={sendMessage}
              onDelete={handleDeleteComment}
            />
          )
        })}
      </Box>
      <Box width="full" display="flex" alignItems="center" justifyContent="center" pt="3" pb="16" ref={ref}>
        {loading && <Spinner />}
      </Box>
      <HStack
        position="absolute"
        bottom="0"
        left={0}
        right={0}
        bg={inputBackgroundColor}
        boxShadow="dark-lg"
        alignItems="center"
        px={2}
        py={3}
      >
        <Link>
          <Avatar src={userLogin?.avatar} size="sm" />
        </Link>
        <Box mt={2} bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')} alignItems="center" flex={1}>
          <InputComment isRoot postId={postId} sendMessage={sendMessage} />
        </Box>
      </HStack>
    </Box>
  )
}

export default Comment
