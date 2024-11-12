import { Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, ModalHeader, Box } from '@chakra-ui/react'
import Comment from '../post/comment'
import { useSelector } from 'react-redux'
import Post from '../post/post'
import { COLOR_THEME } from '../../constant'

const FeedModal = ({ isOpen, onClose }) => {
  const postInfo = useSelector(state => state.post?.currentPostInfor.post)
  return (
    <Modal scrollBehavior="inside" isOpen={isOpen} onClose={onClose} size="3xl">
      <ModalOverlay />
      <ModalContent pb={2} px={0}>
        <ModalHeader textAlign="center" borderBottom="1px" borderBottomColor={COLOR_THEME.BORDER}>
          Bài Viết Của {postInfo?.displayName}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody
          paddingInlineStart={0}
          paddingInlineEnd={0}
          // display="flex"
          // flexDir="column"
          // maxH="75vh"
        >
          <Box>
            <Post {...postInfo} isFullPost />
          </Box>
          <Comment isOpen={isOpen} />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default FeedModal
