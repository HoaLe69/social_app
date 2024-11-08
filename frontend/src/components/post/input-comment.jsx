import { InputGroup, useColorModeValue, Input, InputRightElement, Box, Badge } from '@chakra-ui/react'
import { useRef, useState } from 'react'
import { BsFillSendFill } from 'react-icons/bs'
import { FaRegSmile } from 'react-icons/fa'
import { EmojiKeyboard } from 'reactjs-emoji-keyboard'
import { v4 as uuid } from 'uuid'

const InputComment = ({ postId, sendMessage, id: commentId, replyId, displayName }) => {
  const userLogin = JSON.parse(localStorage.getItem('user'))
  const [commentValue, setCommentValue] = useState('')
  const refInput = useRef()
  const [showEmoji, setShowEmoji] = useState(false)
  const handleSendMessage = () => {
    const message = {
      userId: userLogin?.id,
      postId: postId,
      avatar: userLogin?.avatar,
      displayName: userLogin?.displayName,
      content: commentValue
    }
    if (postId && userLogin?.id && commentValue.trim().length > 0) {
      if (commentId) {
        const subCommentId = uuid()
        sendMessage(
          {
            ...message,
            id: commentId,
            replyId: replyId,
            subCommentId: subCommentId
          },
          'comments',
          postId
        )
      } else {
        sendMessage(message, 'comments', postId)
      }
      setCommentValue('')
      refInput?.current.focus()
    }
  }

  const handleKeydown = e => {
    if (e.key === 'Enter') handleSendMessage()
  }

  const handleHideEmojiKeyboard = e => {
    if (e.target.closest('.emoji')) setShowEmoji(true)
    else setShowEmoji(false)
  }
  return (
    <InputGroup position="relative" display="flex" alignItems="center" onClick={handleHideEmojiKeyboard} px={2}>
      {displayName && (
        <Box>
          <Badge variant="solid" colorScheme="teal">
            {displayName}
          </Badge>
        </Box>
      )}
      <Input
        flex="1"
        ref={refInput}
        px={2}
        pr={20}
        variant="flushed"
        focusBorderColor="grassTeal"
        placeholder={displayName ? `reply ${displayName}` : 'Enter you comment..'}
        name="comment"
        value={commentValue}
        onChange={e => setCommentValue(e.target.value)}
        onKeyDown={handleKeydown}
      />
      <InputRightElement display="flex" alignItems="center" gap="4">
        <Box pos="relative" fontSize="20px" cursor="pointer" className="emoji">
          <FaRegSmile />
          <Box display={showEmoji ? 'block' : 'none'} position="absolute" bottom="180%" right={0}>
            <EmojiKeyboard
              height={320}
              width={350}
              theme={useColorModeValue('light', 'dark')}
              searchLabel="Procurar emoji"
              searchDisabled={false}
              onEmojiSelect={emoji => setCommentValue(pre => pre + emoji.character)}
              categoryDisabled={false}
            />
          </Box>
        </Box>
        <Box mr={7} as="button" onClick={handleSendMessage}>
          <BsFillSendFill />
        </Box>
      </InputRightElement>
    </InputGroup>
  )
}

export default InputComment
