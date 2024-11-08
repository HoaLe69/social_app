import { Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, ModalHeader } from '@chakra-ui/react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { COLOR_THEME } from '../../constant'
import { resetStatus } from '../../redux/postSlice'
import MakePost from '../post/make-post'

const CreatePostModal = ({ mode, isOpen, onClose, postDataEditMode }) => {
  const dispatch = useDispatch()
  const isCreateSuccess = useSelector(state => state.post.createPost.success)
  const isEditSuccess = useSelector(state => state.post.editPost.success)
  useEffect(() => {
    if (isCreateSuccess || isEditSuccess) {
      onClose()
      dispatch(resetStatus())
    }
  }, [isCreateSuccess, onClose, isEditSuccess])

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent py={0}>
        <ModalHeader textAlign="center" borderBottom="1px" borderBottomColor={COLOR_THEME.BORDER}>
          {mode === 'edit' ? 'Edit post' : 'Create new post'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody py={0}>
          <MakePost postDataEditMode={postDataEditMode} />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default CreatePostModal
