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
import { getListFollower } from '@redux/api-request/user'

const ListFollowerModal = ({ isOpen, onClose, listsUserIdFollower }) => {
  const dispatch = useDispatch()
  const listFollower = useSelector(state => state.user.getListUserFollower?.listFollower)

  useEffect(() => {
    if (!isOpen) return
    if (listsUserIdFollower) {
      getListFollower(dispatch, listsUserIdFollower)
    }
  }, [dispatch, isOpen])
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Follower</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {listFollower?.map(user => {
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

export default ListFollowerModal
