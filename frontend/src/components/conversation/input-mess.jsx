import { Input, Box, InputGroup, InputRightElement, useColorModeValue } from '@chakra-ui/react'
import { BsFillSendFill } from 'react-icons/bs'
import { FaRegSmile } from 'react-icons/fa'
import { useCallback, useRef, useState } from 'react'
import { EmojiKeyboard } from 'reactjs-emoji-keyboard'
import { useSelector } from 'react-redux'

const InputRoomChat = ({ roomId, sendMessage }) => {
  const [content, setContent] = useState('')
  const inputRef = useRef(null)
  const [showEmoji, setShowEmoji] = useState(false)
  const userLogin = useSelector(state => state.auth.authState.user)

  const handleSendMessage = useCallback(() => {
    console.log({ roomId })
    if (!content.trim() || !roomId) return
    const message = {
      userId: userLogin?.id,
      conversationId: roomId,
      content: content
    }
    sendMessage(`/app/messages/${roomId}`, message)
    setContent('')
    inputRef?.current.focus()
  }, [content])
  const handleKeydown = e => {
    if (e.key === 'Enter') handleSendMessage()
  }

  const handleHideEmojiKeyboard = e => {
    if (e.target.closest('.emoji')) setShowEmoji(true)
    else setShowEmoji(false)
  }
  const bgInput = useColorModeValue('whiteAlpha.700', 'whiteAlpha.100')
  return (
    <Box p={3} onClick={handleHideEmojiKeyboard}>
      <Box py={2} display="flex" alignItems="center" bg={bgInput} px={2} rounded="25px">
        <Box fontSize="25px" className="emoji" cursor="pointer" position="relative">
          <FaRegSmile />
          <Box display={showEmoji ? 'block' : 'none'} position="absolute" bottom="180%">
            <EmojiKeyboard
              height={320}
              width={350}
              theme={useColorModeValue('light', 'dark')}
              searchLabel="Procurar emoji"
              searchDisabled={false}
              onEmojiSelect={emoji => setContent(pre => pre + emoji.character)}
              categoryDisabled={false}
            />
          </Box>
        </Box>
        <InputGroup px={2}>
          <Input
            autoComplete="off"
            fontSize="18px"
            ref={inputRef}
            placeholder="Message..."
            value={content}
            name="content"
            onChange={e => setContent(e.target.value)}
            onKeyDown={handleKeydown}
            variant="unstyled"
          />
          <InputRightElement>
            <Box pb={2} as="button" onClick={handleSendMessage}>
              <BsFillSendFill />
            </Box>
          </InputRightElement>
        </InputGroup>
      </Box>
    </Box>
  )
}

export default InputRoomChat
