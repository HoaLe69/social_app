import { Input, Box, InputGroup, InputRightElement, useColorModeValue } from '@chakra-ui/react'
import { BsFillSendFill } from 'react-icons/bs'
import { FaRegSmile } from 'react-icons/fa'
import { useRef, useState } from 'react'
import { EmojiKeyboard } from 'reactjs-emoji-keyboard'

const InputRoomChat = ({ roomId, sendMessage }) => {
  const [content, setContent] = useState('')
  const inputRef = useRef(null)
  const [showEmoji, setShowEmoji] = useState(false)
  const userLogin = JSON.parse(localStorage.getItem('user'))

  const handleSendMessage = () => {
    const infor = {
      userId: userLogin?.id,
      conversationId: roomId,
      content: content
    }
    if (roomId && content?.trim().length > 0) {
      sendMessage(infor, 'messages', roomId)
      setContent('')
      inputRef?.current.focus()
    }
  }
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
