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
  Input,
  Stack,
  Textarea,
  Avatar,
  VStack,
  Popover,
  PopoverTrigger,
  PopoverArrow,
  PopoverContent,
  PopoverHeader,
  PopoverCloseButton,
  PopoverBody,
  HStack
} from '@chakra-ui/react'
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useFormik } from 'formik'
import { updateUser } from '@redux/api-request/user'
import { getUserSuccess } from '@redux/userSlice'

const ListAvatar = ({ handleChooseImage }) => {
  const importAll = r => r.keys().map(r)
  const images = importAll(require.context('../../assets/avatar', false, /\.(png|jpe?g|svg)$/))

  const exclude = ['auth', 'emptyRoom']
  return (
    <HStack justifyContent="center" gap="20px" flexWrap="wrap">
      {images.map(image => {
        return (
          !exclude.includes(image) && (
            <Avatar
              key={image}
              onClick={() => handleChooseImage(image)}
              cursor="pointer"
              _hover={{
                boxShadow: '1px 1px 4px 4px rgba(255 , 255 ,255 , 0.7)'
              }}
              src={image}
            />
          )
        )
      })}
    </HStack>
  )
}

const EditProfileModal = ({ isOpen, onClose, user }) => {
  const dispatch = useDispatch()
  const userLogin = JSON.parse(localStorage.getItem('user'))
  const currentUser = useSelector(state => state.user.users?.currentUser)
  const isLoading = useSelector(state => state.user.updateUser.isFetching)
  const [previewSource, setPreviewSource] = useState(undefined)
  const formik = useFormik({
    initialValues: {
      avatar: currentUser?.avatar,
      displayName: '',
      about: ''
    },
    onSubmit: data => {
      const sendData = {}
      for (const key in data) {
        if (key === 'avatar') {
          if (previewSource) sendData[key] = previewSource
        } else if (data[key] !== '') sendData[key] = data[key]
      }
      updateUser(
        dispatch,
        currentUser?.id,
        {
          ...sendData
        },
        userLogin?.accessToken
      )
      dispatch(getUserSuccess({ ...user, ...sendData }))
      const userStorage = {
        ...userLogin,
        ...sendData
      }
      localStorage.setItem('user', JSON.stringify(userStorage))
      if (!isLoading) {
        onClose()
      }
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
            <Popover>
              <PopoverTrigger>
                <Avatar src={previewSource ? previewSource : currentUser?.avatar} cursor="pointer" size="xl" />
              </PopoverTrigger>
              <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader>Choose avatar</PopoverHeader>
                <PopoverBody>
                  <ListAvatar handleChooseImage={setPreviewSource} />
                </PopoverBody>
              </PopoverContent>
            </Popover>
            <Heading fontSize="15px">{currentUser?.displayName}</Heading>
          </VStack>
          <form onSubmit={formik.handleSubmit}>
            <Stack spacing={4}>
              <FormControl>
                <FormLabel htmlFor="displayName">Display name</FormLabel>
                <Input
                  onChange={formik.handleChange}
                  value={formik.values.displayName}
                  type="text"
                  name="displayName"
                  id="displayName"
                  placeholder="Enter your display name..."
                />
              </FormControl>
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
