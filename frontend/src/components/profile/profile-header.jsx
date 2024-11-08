import { Avatar, Box, Heading, Text, Button, useColorModeValue, useDisclosure, HStack } from '@chakra-ui/react'
import EditProfileModal from '@components/modals/edit-profile'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { followOrtherUser, getUser } from '@redux/api-request/user'
import ListFollowingModal from '../modals/following'
import ListFollowerModal from '../modals/follower'
import MessaageButton from './message-button-profile'

const Details = ({ title, quantity, onClick, ...props }) => {
  return (
    <Box
      display="flex"
      flexDir="row"
      gap={1}
      alignItems="center"
      cursor="pointer"
      fontSize="16px"
      onClick={onClick}
      {...props}
    >
      <Text fontWeight="bold">{quantity}</Text>
      <Text>{title}</Text>
    </Box>
  )
}

const ProfileHeader = ({ userId: userIdFromUrl }) => {
  const dispatch = useDispatch()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const currentUser = useSelector(state => state.user.users?.currentUser)
  const isLoadingFollow = useSelector(state => state.user.followOrtherUser.isFetching)
  const userLogin = JSON.parse(localStorage.getItem('user'))
  const quantityPost = useSelector(state => state.post.getPostUser?.posts).length

  useEffect(() => {
    getUser(dispatch, userIdFromUrl, userLogin?.accessToken)
  }, [dispatch, userIdFromUrl, userLogin?.accessToken])

  const handleFollowOrtherUser = async () => {
    followOrtherUser(dispatch, userIdFromUrl, { id: userLogin?.id }, userLogin?.accessToken, relation, userLogin)
  }
  const relation = () => {
    const isFollowingUserFromUserLogin = currentUser?.following.includes(userLogin?.id)
    const ioFollowerUserFromUserLogin = currentUser?.follower.includes(userLogin?.id)
    if (isFollowingUserFromUserLogin && ioFollowerUserFromUserLogin) return 'Following'
    else if (ioFollowerUserFromUserLogin) return 'Following'
    else if (isFollowingUserFromUserLogin) return 'Follow back'
    return 'Follow'
  }
  return (
    <Box pt={16}>
      <Box display="flex" alignItems="center" flexDir={{ base: 'column', lg: 'row' }} justifyContent="center">
        <Box width="300px" display="flex" justifyContent="center">
          <Avatar
            size="2xl"
            src={currentUser?.avatar}
            borderWidth="2px"
            borderStyle="solid"
            boxSize="150px"
            borderColor={useColorModeValue('gray.500', 'whiteAlpha.500')}
          />
        </Box>
        <Box display="flex" flexDir="column" alignItems="center">
          <HStack spacing={5}>
            <Heading as="h3" mt={2} fontSize="20px" fontWeight="500">
              {currentUser?.displayName}
            </Heading>
            {userLogin?.id === userIdFromUrl ? (
              <Box mt={2} gap="10px" display="flex">
                <Button colorScheme="teal" onClick={onOpen}>
                  Edit profile
                </Button>
                <EditProfileModal isOpen={isOpen} user={currentUser} onClose={onClose} />
              </Box>
            ) : (
              <Box mt={2}>
                <Button px={4} onClick={handleFollowOrtherUser} colorScheme="teal" isLoading={isLoadingFollow} mr={2}>
                  {relation()}
                </Button>
                <MessaageButton member={[userLogin?.id, currentUser?.id]} />
              </Box>
            )}
          </HStack>
          <Box display="flex" gap="10px" mt={4} alignItems="center">
            <Details quantity={quantityPost} title="post" />
            <Follower follower={currentUser?.follower} />
            <Following following={currentUser?.following} />
          </Box>
          <Box p={2} fontSize="14px" color={useColorModeValue('blue.500', 'pink.400')}>
            {currentUser?.about}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

const Following = ({ following }) => {
  const { isOpen: isOpenFollowing, onClose: onCloseFollowing, onOpen: onOpenFollowing } = useDisclosure()
  return (
    <Box>
      <Details quantity={following?.length} title="following" onClick={onOpenFollowing} />
      <ListFollowingModal isOpen={isOpenFollowing} onClose={onCloseFollowing} listsUserIdFollowing={following} />
    </Box>
  )
}

const Follower = ({ follower }) => {
  const { isOpen: isOpenFollower, onClose: onCloseFollower, onOpen: onOpenFollower } = useDisclosure()
  return (
    <Box>
      <Details quantity={follower?.length} title="follower" onClick={onOpenFollower} />
      <ListFollowerModal isOpen={isOpenFollower} onClose={onCloseFollower} listsUserIdFollower={follower} />
    </Box>
  )
}
export default ProfileHeader
