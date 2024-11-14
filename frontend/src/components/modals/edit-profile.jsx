import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Heading,
  FormControl,
  FormLabel,
  Stack,
  Textarea,
  Avatar,
  VStack
} from '@chakra-ui/react'
import { useSelector, useDispatch } from 'react-redux'
import { useFormik } from 'formik'
import { updateUser } from '../../redux/api-request/user'

const EditProfileModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch()
  const userLogin = useSelector(state => state.auth.authState.user)
  const isLoading = useSelector(state => state.user.updateUser.isFetching)
  const formik = useFormik({
    initialValues: {
      about: ''
    },
    onSubmit: async data => {
      if (!data.about.trim()) return
      const updateInfo = {
        id: userLogin?.id,
        ...data
      }
      await updateUser(dispatch, updateInfo)
      onClose()
    }
  })
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading fontSize="20px">Edit your profile</Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack>
            <Avatar src={userLogin?.avatar} cursor="pointer" size="xl" />
            <Heading fontSize="15px">{userLogin?.displayName}</Heading>
          </VStack>
          <form onSubmit={formik.handleSubmit}>
            <Stack spacing={4}>
              <FormControl>
                <FormLabel htmlFor="about">Bio</FormLabel>
                <Textarea
                  onChange={formik.handleChange}
                  value={formik.values.about}
                  type="text"
                  name="about"
                  id="about"
                  placeholder="Enter your about..."
                />
              </FormControl>
            </Stack>
            <ModalFooter>
              <Button type="submit" isLoading={isLoading} loadingText="saving" colorScheme="teal" mr={3}>
                Save
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            </ModalFooter>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default EditProfileModal
