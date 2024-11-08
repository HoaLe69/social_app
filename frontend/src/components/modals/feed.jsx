import { Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, ModalHeader, Box } from '@chakra-ui/react'
import Comment from '../post/comment'
import { useSelector } from 'react-redux'
import Post from '../post/post'
import { COLOR_THEME } from '../../constant'

const FeedModal = ({ isOpen, onClose }) => {
  const postInfor = useSelector(state => state.post?.currentPostInfor.post)
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl">
      <ModalOverlay />
      <ModalContent pb={2} px={0}>
        <ModalHeader textAlign="center" borderBottom="1px" borderBottomColor={COLOR_THEME.BORDER}>
          Bài Viết Của {postInfor?.displayName}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody
          paddingInlineStart={0}
          paddingInlineEnd={0}
          display="flex"
          flexDir="column"
          maxH="75vh"
          overflowY="auto"
        >
          <Box>
            <Post {...postInfor} isDetail />
          </Box>
          <Comment isOpen={isOpen} />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default FeedModal
