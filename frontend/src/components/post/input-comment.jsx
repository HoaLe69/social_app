import { InputGroup, useColorModeValue, Input, InputRightElement, Box } from '@chakra-ui/react'
import { useCallback, useRef, useState } from 'react'
import { BsFillSendFill } from 'react-icons/bs'
import { FaRegSmile } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { EmojiKeyboard } from 'reactjs-emoji-keyboard'

const InputComment = ({ postId, sendMessage, isRoot }) => {
  const refInput = useRef()
  const userLogin = useSelector(state => state.auth.authState.user)
  const [commentValue, setCommentValue] = useState('')
  const [showEmoji, setShowEmoji] = useState(false)

  const handleSendMessage = useCallback(() => {
    if (!commentValue.trim()) return
    const message = {
      action: 'ADD',
      userId: userLogin?.id,
      postId: postId,
      avatar: userLogin?.avatar,
      displayName: userLogin?.displayName,
      content: commentValue,
      level: isRoot ? 'root' : 'child'
    }
    // if (reply) {
    //   message.root = reply.root
    //   message.replyTo = reply.to
    // }
    sendMessage(`/app/comments/${postId}`, message)
    setCommentValue('')
    setTimeout(() => {
      const inputEl = refInput.current
      if (inputEl) inputEl.focus()
    }, 0)
  }, [commentValue])

  const handleKeydown = e => {
    if (e.key === 'Enter') handleSendMessage()
  }

  const handleHideEmojiKeyboard = e => {
    if (e.target.closest('.emoji')) setShowEmoji(true)
    else setShowEmoji(false)
  }
  return (
    <InputGroup position="relative" display="flex" alignItems="center" onClick={handleHideEmojiKeyboard} px={2}>
      {/* {reply && ( */}
      {/*   <Box> */}
      {/*     <Badge variant="solid" colorScheme="teal"> */}
      {/*       {reply?.displayName} */}
      {/*     </Badge> */}
      {/*   </Box> */}
      {/* )} */}
      <Input
        flex="1"
        ref={refInput}
        px={2}
        pr={20}
        variant="flushed"
        focusBorderColor="grassTeal"
        placeholder="Enter your comment..."
        //        placeholder={reply?.displayName ? `reply to ${reply?.displayName}` : 'Enter you comment..'}
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
