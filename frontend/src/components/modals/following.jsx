import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalHeader,
  Avatar,
  Heading,
  HStack,
  useColorModeValue,
  Link
} from '@chakra-ui/react'
import { Link as ReacRouterLink } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getListFollowing } from '../../redux/api-request/user'

const ListFollowingModal = ({ isOpen, onClose, listsUserIdFollowing }) => {
  const dispatch = useDispatch()
  const accessToken = JSON.parse(localStorage.getItem('user'))?.accessToken
  const listsFollowing = useSelector(state => state.user.getListUserFollowing?.listFollowing)

  useEffect(() => {
    if (!isOpen) return
    if (listsUserIdFollowing) {
      getListFollowing(dispatch, listsUserIdFollowing)
    }
  }, [dispatch, isOpen])
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Following</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {listsFollowing?.map(user => {
            return <UserItem onClose={onClose} user={user} key={user?.id} />
          })}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

const UserItem = ({ user, onClose }) => {
  return (
    <Link _hover={{ textDecoration: 'none' }} onClick={onClose} as={ReacRouterLink} to={`/profile/${user?.id}`}>
      <HStack
        p={2}
        cursor="pointer"
        rounded="10px"
        _hover={{
          backgroundColor: `${useColorModeValue('blackAlpha.200', 'whiteAlpha.300')}`
        }}
      >
        <Avatar src={user?.avatar} alt={user?.displayName} />
        <Heading as="h4" fontSize="14px">
          {user?.displayName}
        </Heading>
      </HStack>
    </Link>
  )
}

export default ListFollowingModal
