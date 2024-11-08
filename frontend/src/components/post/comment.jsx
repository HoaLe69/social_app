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
  Button
} from '@chakra-ui/react'
import { useSelector } from 'react-redux'
import { useState, useEffect, useMemo } from 'react'
import { Link as ReactRouterLink } from 'react-router-dom'
import InputComment from './input-comment'
import socketService from '../../hooks/useWebSocket'
import axios from 'axios'
import { BsThreeDots } from 'react-icons/bs'
import { AiFillDelete } from 'react-icons/ai'
import formatTime from '../../util/timeago'
import ReplyComment from './reply-comment'
import { GoReply } from 'react-icons/go'
import { IoIosArrowDown } from 'react-icons/io'

const CommentItem = ({ userOfPost, comment, postId, sendMessage }) => {
  const [showReplyInput, setShowReplyInput] = useState({
    show: false,
    replyId: '',
    displayName: undefined
  })
  const [showReplyComment, setShowReplyComment] = useState(false)
  const baseUrl = process.env.REACT_APP_API_URL
  const userLogin = JSON.parse(localStorage.getItem('user'))
  const handleDeleteComment = async (subCommentId = '') => {
    if (subCommentId.length > 0) {
      console.log('delete subComment')
      sendMessage(
        {
          deleteComment: 1,
          id: comment.id,
          subCommentId: subCommentId
        },
        'comments',
        postId
      )
    } else {
      sendMessage(
        {
          deleteComment: 1,
          id: comment.id
        },
        'comments',
        postId
      )
    }
    try {
      const url =
        subCommentId.length > 0
          ? `${baseUrl}/comment/${comment?.id}/${postId}/${subCommentId}`
          : `${baseUrl}/comment/${comment?.id}/${postId}`
      await axios.delete(url, {
        headers: { Authorization: `Bearer ${userLogin?.accessToken}` }
      })
    } catch (err) {
      console.log(err)
    }
  }
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
          <Text
            ml={2}
            fontSize="12px"
            fontWeight="bold"
            color={useColorModeValue('gray.700', 'whiteAlpha.600')}
            cursor="pointer"
            _hover={{ textDecoration: 'underline' }}
            onClick={() => {
              setShowReplyInput(pre => ({
                ...pre,
                replyId: comment?.userId,
                show: true,
                displayName: comment?.displayName
              }))
              setShowReplyComment(true)
            }}
          >
            reply
          </Text>
        </Box>
        <Box>
          {(userLogin?.id === comment?.userId || userLogin?.id === userOfPost) && (
            <Menu placement="bottom-end">
              <MenuButton size="sm" rounded="full" icon={<BsThreeDots />} as={IconButton} />
              <MenuList>
                <MenuItem leftIcon={<AiFillDelete />} loadingText="delete" as={Button} onClick={handleDeleteComment}>
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
        <HStack display={comment.reply.length > 0 && showReplyComment === false ? 'flex' : 'none'}>
          <Box sx={{ transform: 'rotate(180deg)' }}>
            <GoReply />
          </Box>
          <Text
            fontSize="15px"
            cursor="pointer"
            _hover={{ textDecoration: 'underline' }}
            color={useColorModeValue('blackAlpha.700', 'whiteAlpha.600')}
            onClick={() => setShowReplyComment(true)}
          >
            <strong>Xem thêm {comment?.reply?.length} phản hồi</strong>
          </Text>
        </HStack>
        <Box display={showReplyComment || showReplyInput.show ? 'block' : 'none'}>
          {comment?.reply?.map((reply, index) => {
            return (
              <ReplyComment
                userOfPost={userOfPost}
                handleDeleteComment={handleDeleteComment}
                setShowReply={setShowReplyInput}
                replys={comment?.reply}
                rootComment={comment}
                reply={reply}
                key={reply?.id || index}
              />
            )
          })}
        </Box>
      </Box>
      <Box px={4} pl={8} display={showReplyInput.show ? 'block' : 'none'}>
        <HStack alignItems="center" px={2}>
          <Link>
            <Avatar src={userLogin?.avatar} size="sm" />
          </Link>
          <Box mt={2} bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')} alignItems="center" flex={1}>
            <InputComment
              sendMessage={sendMessage}
              id={comment?.id}
              postId={postId}
              displayName={showReplyInput?.displayName}
              replyId={showReplyInput?.replyId}
            />
          </Box>
        </HStack>
      </Box>
    </Box>
  )
}

const Comment = ({ isOpen }) => {
  const [filterDel, setFilterDel] = useState({ message: '' })
  const [comments, setComments] = useState([])
  const [pageNumber, setPageNumber] = useState(0)
  const [totalComment, setTotalComment] = useState(0)
  const { sendMessage, disconnect, connect } = useMemo(() => socketService(setComments, setFilterDel), [])
  const postId = useSelector(state => state.post?.currentPostInfor?.post?.id)
  const userOfPost = useSelector(state => state.post?.currentPostInfor?.post?.userId)
  const userLogin = JSON.parse(localStorage.getItem('user'))
  const baseUrl = process.env.REACT_APP_API_URL
  useEffect(() => {
    const arrId = filterDel.message.trim().split(' ')
    if (arrId.length === 2) {
      const fixComment = comments.find(com => com?.id === arrId[0])
      if (fixComment) {
        const subCommentFix = fixComment?.reply?.filter(sub => sub?.id !== arrId[1])
        fixComment.reply = subCommentFix
        setComments([...comments])
      }
    } else {
      setComments(pre => pre.filter(comment => comment?.id !== filterDel.message))
    }
  }, [filterDel.message])
  useEffect(() => {
    if (postId) {
      const getAllComment = async () => {
        try {
          const res = await axios.get(`${baseUrl}/comment/${postId}?page=${pageNumber}`, {
            headers: { Authorization: `Bearer ${userLogin?.accessToken}` }
          })
          console.log(res)
          setTotalComment(res.totalElements)
          setComments(pre => [...pre, ...res.content])
        } catch (err) {
          console.log(err)
        }
      }
      getAllComment()
    }
  }, [postId, userLogin?.accessToken, baseUrl, pageNumber])

  useEffect(() => {
    if (isOpen) {
      connect('comments', postId)
    }
    return () => disconnect()
  }, [isOpen, postId])
  return (
    <Box position="relative">
      {comments?.map((comment, index) => {
        return (
          <CommentItem
            filterDel={filterDel}
            key={comment?.id || index}
            userOfPost={userOfPost}
            comment={comment}
            setComments={setComments}
            sendMessage={sendMessage}
            postId={postId}
          />
        )
      })}
      <HStack justifyContent="center" alignItems="center" display={comments.length >= totalComment ? 'none' : 'flex'}>
        <Text
          fontWeight="bold"
          color={useColorModeValue('blackAlpha.600', 'whiteAlpha.600')}
          cursor="pointer"
          _hover={{ textDecoration: 'underline' }}
          onClick={() => setPageNumber(pre => pre + 1)}
        >
          Xem thêm bình luận
        </Text>
        <Box>
          <IoIosArrowDown />
        </Box>
      </HStack>
      <HStack alignItems="center" px={2}>
        <Link>
          <Avatar src={userLogin?.avatar} size="sm" />
        </Link>
        <Box mt={2} bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')} alignItems="center" flex={1}>
          <InputComment postId={postId} sendMessage={sendMessage} />
        </Box>
      </HStack>
    </Box>
  )
}

export default Comment
